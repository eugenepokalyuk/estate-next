import { combineEpics } from 'redux-observable';

import { getEstateEpic } from './epics/getEstateEpic';
import { getEstateListEpic } from './epics/getEstateListEpic';

export const estateEpics = combineEpics(getEstateListEpic, getEstateEpic);
