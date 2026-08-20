import { ApiErrorPayload } from '../types';

/** Достаёт разбор ошибки по полям из ответа DRF.
 *
 *  Тело может оказаться пустым или не-JSON (например, страница 502 от
 *  nginx) — тогда возвращаем null, и вызывающий покажет общий текст.
 */
export async function parseErrorPayload(response: Response): Promise<ApiErrorPayload> {
  try {
    const data: unknown = await response.json();
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      return data as ApiErrorPayload;
    }
  } catch {
    // Не JSON — не наша забота, отдадим null.
  }
  return null;
}
