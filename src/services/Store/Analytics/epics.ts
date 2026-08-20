import { combineEpics } from 'redux-observable';

import { trackGoalsEpic } from './epics/trackGoalsEpic';

export const analyticsEpics = combineEpics(trackGoalsEpic);
