import { AppSettings } from '@/services/Api';

/** Глобальное состояние приложения — то, что общее для всех страниц.
 *
 *  Сейчас это настройки сайта из админки (контакты, соцсети, правовые
 *  документы), из которых собирается футер и строчка согласия под формой.
 *  Сюда же ляжет всё остальное общее, если появится.
 */
export interface IAppState {
  settings?: AppSettings;
  isLoading: boolean;
  error?: string;
}

export const initialAppState: IAppState = {
  isLoading: false,
};
