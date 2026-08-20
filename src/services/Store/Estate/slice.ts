import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Estate, EstateDetail } from '@/services/Api';

import {
  initialEstateListState,
  initialEstateState,
} from './store';

const estateListSlice = createSlice({
  name: 'estateList',
  initialState: initialEstateListState,
  reducers: {
    getEstateList: (state) => {
      state.isLoading = true;
      state.error = undefined;
    },
    getEstateListSuccess: (state, action: PayloadAction<Estate[]>) => {
      state.items = action.payload;
      state.isLoading = false;
      state.error = undefined;
    },
    getEstateListFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

const estateSlice = createSlice({
  name: 'estate',
  initialState: initialEstateState,
  reducers: {
    getEstate: {
      reducer: (state, _action: PayloadAction<{ slug: string }>) => {
        state.isLoading = true;
        state.error = undefined;
      },
      prepare: (slug: string) => ({ payload: { slug } }),
    },
    getEstateSuccess: (state, action: PayloadAction<EstateDetail>) => {
      state.data = action.payload;
      state.isLoading = false;
      state.error = undefined;
    },
    getEstateFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const estateListActions = estateListSlice.actions;
export const estateActions = estateSlice.actions;

export const estateListReducer = estateListSlice.reducer;
export const estateReducer = estateSlice.reducer;

export type EstateListActions = ReturnType<
  (typeof estateListActions)[keyof typeof estateListActions]
>;
export type EstateActions = ReturnType<
  (typeof estateActions)[keyof typeof estateActions]
>;
