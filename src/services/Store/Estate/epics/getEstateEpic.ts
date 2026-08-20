import { Epic } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, filter, switchMap } from 'rxjs/operators';

import { getEstateApi } from '@/services/Api';

import { estateActions } from '../slice';
import { toErrorMessage } from '../../helpers/toErrorMessage';
import { RootActions, RootStore } from '../../store';

export const getEstateEpic: Epic<RootActions, RootActions, RootStore> = (
  action$,
) =>
  action$.pipe(
    filter(estateActions.getEstate.match),
    // switchMap, а не mergeMap: на экране одна страница объекта, и если
    // посетитель успел перейти на другой объект, ответ по прошлому уже не
    // нужен — иначе он перезапишет свежие данные.
    switchMap((action) => {
      const { slug } = action.payload;

      const req = getEstateApi({ slug });

      return from(req).pipe(
        switchMap((response) => of(estateActions.getEstateSuccess(response))),
        catchError((error) =>
          of(estateActions.getEstateFailure(toErrorMessage(error))),
        ),
      );
    }),
  );
