import { combineEpics } from 'redux-observable';

import { sendLeadEpic } from './epics/sendLeadEpic';

export const leadEpics = combineEpics(sendLeadEpic);
