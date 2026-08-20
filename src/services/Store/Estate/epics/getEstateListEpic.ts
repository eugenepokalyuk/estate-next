import { Epic } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, filter, mergeMap } from 'rxjs/operators';

import { getEstateListApi } from '@/services/Api';

import { estateListActions } from '../slice';
import { toErrorMessage } from '../../helpers/toErrorMessage';
import { RootActions, RootStore } from '../../store';

export const getEstateListEpic: Epic<RootActions, RootActions, RootStore> = (
  action$,
) =>
  action$.pipe(
    filter(estateListActions.getEstateList.match),
    mergeMap(() => {
      const req = getEstateListApi();

      return from(req).pipe(
        mergeMap((response) =>
          of(estateListActions.getEstateListSuccess(response)),
        ),
        catchError((error) =>
          of(estateListActions.getEstateListFailure(toErrorMessage(error))),
        ),
      );
    }),
  );
