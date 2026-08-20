import { apiRequest, HttpMethod } from '../../request';

export interface SendLeadParams {
  name: string;
  phone: string;
  email?: string;
  comment?: string;
  /** Со страницы какого объекта пришла заявка. Пусто — с главной. */
  estate_slug?: string;
  /** Адрес страницы: менеджеру он полезнее любого нашего признака
   *  источника — видно и объект, и рекламную метку в ссылке. */
  page_url?: string;
}

interface Result {
  id: number;
}

/** Отправка заявки из окна «Оставить заявку».
 *
 *  Шлём на свой бэкенд, а он уже пересылает в телеграм менеджерам: токен
 *  бота в браузер выносить нельзя.
 */
export function sendLeadApi(data: SendLeadParams): Promise<Result> {
  return apiRequest({
    method: HttpMethod.Post,
    url: 'leads/',
    data,
  });
}
