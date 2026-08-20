import { getApiBase } from './getApiBase';
import { ApiRequestConfig } from '../types';

/** Полный адрес запроса с query string.
 *
 *  Пустые параметры выкидываем: `?city=` бэкенд разбирает как «город —
 *  пустая строка» и не находит ничего, хотя имелось в виду «без фильтра».
 */
export function buildUrl(url: string, params?: ApiRequestConfig['params']): string {
  const base = `${getApiBase()}${url}`;

  if (!params) return base;

  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === '') continue;
    query.append(key, String(value));
  }

  const search = query.toString();
  return search ? `${base}?${search}` : base;
}
