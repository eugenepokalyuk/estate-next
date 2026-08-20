import { Epic } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, filter, mergeMap } from 'rxjs/operators';

import { sendLeadApi } from '@/services/Api';

import { leadActions } from '../slice';
import { toErrorMessage } from '../../helpers/toErrorMessage';
import { RootActions, RootStore } from '../../store';

export const sendLeadEpic: Epic<RootActions, RootActions, RootStore> = (
  action$,
) =>
  action$.pipe(
    filter(leadActions.sendLead.match),
    // mergeMap, а не switchMap: заявку, которая уже ушла на сервер, отменять
    // нельзя — она там сохранится, а посетитель увидит, что ничего не
    // отправилось. Двойной клик по кнопке гасится флагом isLoading в форме.
    mergeMap((action) => {
      const req = sendLeadApi(action.payload);

      return from(req).pipe(
        mergeMap(() => of(leadActions.sendLeadSuccess())),
        catchError((error) =>
          of(leadActions.sendLeadFailure(toErrorMessage(error))),
        ),
      );
    }),
  );
