export enum HttpMethod {
  Get = 'get',
  Post = 'post',
}

/** Разбор ответа с ошибкой от DRF: `{"phone": ["Введите номер полностью."]}`.
 *  Ключ — имя поля, значение — список сообщений или одно сообщение. */
export type ApiErrorPayload = Record<string, string | string[]> | null;

export interface ApiRequestConfig {
  method?: HttpMethod;
  /** Путь относительно базового адреса API, без ведущего слеша: `objects/`. */
  url: string;
  /** Уедут в query string. `undefined` и пустые строки отбрасываются. */
  params?: Record<string, string | number | boolean | undefined>;
  /** Тело запроса, сериализуется в JSON. */
  data?: unknown;
  /** Сколько секунд ответ считается свежим. Работает только на сервере —
   *  это расширение fetch у Next; в браузере опция игнорируется.
   *  `false` — не кэшировать вовсе. */
  revalidate?: number | false;
}

/** Ошибка запроса: сеть не пустила, сервер ответил не 2xx или отдал не JSON.
 *
 *  Отдельный класс, а не строка, потому что вызывающему нужен статус:
 *  429 показывается посетителю иначе, чем 400, а 404 на странице объекта
 *  вообще не ошибка, а повод отдать «не найдено».
 */
export class ApiError extends Error {
  /** 0 — до сервера не дошли (сеть, таймаут, CORS). */
  readonly status: number;
  readonly payload: ApiErrorPayload;

  constructor(message: string, status: number, payload: ApiErrorPayload = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }

  /** Первое сообщение из разбора по полям — то, что показываем в форме.
   *  Показывать весь разбор одной строкой смысла нет. */
  get firstFieldError(): string | null {
    if (!this.payload) return null;

    for (const value of Object.values(this.payload)) {
      if (typeof value === 'string') return value;
      if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
    }
    return null;
  }
}
