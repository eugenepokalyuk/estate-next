import { combineEpics } from 'redux-observable';

import { analyticsEpics } from './Analytics/epics';
import { appEpics } from './App/epics';
import { estateEpics } from './Estate/epics';
import { leadEpics } from './Lead/epics';

export const rootEpic = combineEpics(
  appEpics,
  estateEpics,
  leadEpics,
  analyticsEpics,
);
