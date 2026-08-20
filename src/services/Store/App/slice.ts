import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppSettings } from '@/services/Api';

import { initialAppState } from './store';

const appSlice = createSlice({
  name: 'app',
  initialState: initialAppState,
  reducers: {
    getAppSettings: (state) => {
      state.isLoading = true;
      state.error = undefined;
    },
    getAppSettingsSuccess: (state, action: PayloadAction<AppSettings>) => {
      state.settings = action.payload;
      state.isLoading = false;
      state.error = undefined;
    },
    getAppSettingsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const appActions = appSlice.actions;
export const appReducer = appSlice.reducer;

export type AppActions = ReturnType<
  (typeof appActions)[keyof typeof appActions]
>;
