import { Epic } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, filter, mergeMap } from 'rxjs/operators';

import { getAppSettingsApi } from '@/services/Api';

import { appActions } from '../slice';
import { toErrorMessage } from '../../helpers/toErrorMessage';
import { RootActions, RootStore } from '../../store';

export const getAppSettingsEpic: Epic<RootActions, RootActions, RootStore> = (
  action$,
) =>
  action$.pipe(
    filter(appActions.getAppSettings.match),
    mergeMap(() => {
      const req = getAppSettingsApi();

      return from(req).pipe(
        mergeMap((response) => of(appActions.getAppSettingsSuccess(response))),
        catchError((error) =>
          of(appActions.getAppSettingsFailure(toErrorMessage(error))),
        ),
      );
    }),
  );
