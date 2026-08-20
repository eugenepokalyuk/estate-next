import { buildUrl, parseErrorPayload } from './helpers';
import { ApiError, ApiRequestConfig, HttpMethod } from './types';

/** Сколько секунд ответ Django считается свежим по умолчанию.
 *
 *  Страницы собираются в админке, и правка блока должна доезжать сама —
 *  но ходить в Django на каждый запрос посетителя тоже незачем. Минута:
 *  менеджер успевает увидеть правку, пока переключается на вкладку сайта,
 *  а всплеск трафика не превращается во всплеск запросов к API. */
export const DEFAULT_REVALIDATE_SECONDS = 60;

/** Единая точка входа для всех запросов к API.
 *
 *  В face эта же роль у axios, здесь — родной `fetch`: кэш Next живёт
 *  именно на нём (`next.revalidate`), и через axios страницы потеряли бы
 *  ISR. Одна функция работает и на сервере, и в браузере — эпикам и
 *  серверным компонентам нужен один и тот же слой.
 *
 *  Бросает `ApiError` на любой неуспех: сеть, не-2xx, битый JSON. Решать,
 *  что показать посетителю, — дело вызывающего, здесь про это знать нечего.
 */
export async function apiRequest<R = void>(config: ApiRequestConfig): Promise<R> {
  const { method = HttpMethod.Get, url, params, data, revalidate } = config;

  const init: RequestInit & { next?: { revalidate: number | false } } = {
    method: method.toUpperCase(),
  };

  if (data !== undefined) {
    init.headers = { 'Content-Type': 'application/json' };
    init.body = JSON.stringify(data);
  }

  if (method === HttpMethod.Get) {
    init.next = { revalidate: revalidate ?? DEFAULT_REVALIDATE_SECONDS };
  } else {
    // Кэшировать POST нечего, а Next по умолчанию и не станет — но явное
    // указание избавляет от вопросов при чтении.
    init.cache = 'no-store';
  }

  let response: Response;
  try {
    response = await fetch(buildUrl(url, params), init);
  } catch (error) {
    // До сервера не дошли: он лежит, переезжает или не запущен локально.
    // Статус 0 — признак того, что ответа не было вовсе.
    throw new ApiError((error as Error).message || 'Сеть недоступна', 0);
  }

  if (!response.ok) {
    throw new ApiError(
      `Запрос ${url} вернул ${response.status}`,
      response.status,
      await parseErrorPayload(response),
    );
  }

  // 204 и пустое тело — законный ответ на POST, разбирать там нечего.
  if (response.status === 204) return undefined as R;

  try {
    return (await response.json()) as R;
  } catch {
    throw new ApiError(`Запрос ${url} вернул не JSON`, response.status);
  }
}
