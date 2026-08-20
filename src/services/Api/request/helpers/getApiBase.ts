const DEFAULT_API_URL = 'http://localhost:8000/api/v1/';

/** Базовый адрес API со слешем на конце — пути клеятся конкатенацией.
 *
 *  Слеш добавляем сами: забытый слеш в переменной окружения — ошибка,
 *  которая проявляется только в проде и выглядит как 404 на всё сразу.
 */
export function getApiBase(): string {
  const base = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;
  return base.endsWith('/') ? base : `${base}/`;
}
