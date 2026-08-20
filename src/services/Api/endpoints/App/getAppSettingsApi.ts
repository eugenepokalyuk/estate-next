import { apiRequest, HttpMethod } from '../../request';

/** Что за ссылка в футере, `SocialLink.Kind` на бэкенде. Определяет иконку. */
export enum SocialLinkKind {
  Telegram = 'telegram',
  Whatsapp = 'whatsapp',
  Max = 'max',
  Vk = 'vk',
  Youtube = 'youtube',
  Site = 'site',
}

export interface SocialLink {
  id: number;
  kind: SocialLinkKind;
  title: string;
  url: string;
}

export interface LegalDocument {
  id: number;
  title: string;
  /** Либо наш путь (`/privacy`), либо внешняя ссылка, либо ссылка на
   *  загруженный файл. Куда открывать — решает компонент по первому символу. */
  url: string;
}

/** Общие настройки сайта — всё, из чего собирается футер. */
export interface AppSettings {
  company_name: string;
  legal_name: string;
  logo: string | null;
  description: string;
  phone: string;
  email: string;
  address: string;
  working_hours: string;
  copyright_note: string;
  socials: SocialLink[];
  legal_documents: LegalDocument[];
}

export function getAppSettingsApi(): Promise<AppSettings> {
  return apiRequest({
    method: HttpMethod.Get,
    url: 'site/',
  });
}
