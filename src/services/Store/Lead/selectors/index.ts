import { RootStore } from '../../store';

export const selectIsLeadModalOpen = (state: RootStore) => state.lead.isModalOpen;
export const selectIsLeadSending = (state: RootStore) => state.lead.isLoading;
export const selectIsLeadSent = (state: RootStore) => state.lead.isSent;
export const selectLeadError = (state: RootStore) => state.lead.error;
