import { combineEpics } from 'redux-observable';

import { getAppSettingsEpic } from './epics/getAppSettingsEpic';

export const appEpics = combineEpics(getAppSettingsEpic);
