import { combineReducers } from '@reduxjs/toolkit';

import { appReducer } from './App/slice';
import { estateListReducer, estateReducer } from './Estate/slice';
import { leadReducer } from './Lead/slice';

export const rootReducer = combineReducers({
  app: appReducer,
  estateList: estateListReducer,
  estate: estateReducer,
  lead: leadReducer,
});
