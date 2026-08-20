import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { SendLeadParams } from '@/services/Api';

import { initialLeadState } from './store';

const leadSlice = createSlice({
  name: 'lead',
  initialState: initialLeadState,
  reducers: {
    openLeadModal: (state) => {
      state.isModalOpen = true;
    },
    closeLeadModal: (state) => {
      state.isModalOpen = false;
    },
    /** Сброс формы после закрытия окна: заявка отправлена, ошибка показана —
     *  при следующем открытии всё это должно быть чистым. Отдельным
     *  действием, потому что вызывается с задержкой, когда окно уже уехало
     *  анимацией, — иначе форма моргает по дороге. */
    resetLead: (state) => {
      state.isLoading = false;
      state.isSent = false;
      state.error = undefined;
    },
    sendLead: (state, _action: PayloadAction<SendLeadParams>) => {
      state.isLoading = true;
      state.error = undefined;
    },
    sendLeadSuccess: (state) => {
      state.isLoading = false;
      state.isSent = true;
      state.error = undefined;
    },
    sendLeadFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const leadActions = leadSlice.actions;
export const leadReducer = leadSlice.reducer;

export type LeadActions = ReturnType<
  (typeof leadActions)[keyof typeof leadActions]
>;
