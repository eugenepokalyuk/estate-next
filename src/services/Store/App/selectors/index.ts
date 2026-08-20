import { RootStore } from '../../store';

/** Настройки сайта целиком — из них рисуется футер. */
export const selectAppSettings = (state: RootStore) => state.app.settings;

/** Правовые документы для строчки согласия под кнопкой формы. */
export const selectLegalDocuments = (state: RootStore) => state.app.settings?.legal_documents ?? [];

export const selectCompanyName = (state: RootStore) => state.app.settings?.company_name;

export const selectCompanyPhone = (state: RootStore) => state.app.settings?.phone;
