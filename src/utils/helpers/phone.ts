/** Маска российского номера прямо во время ввода.
 *
 *  Форматируем на лету, а не при отправке: человек видит, сколько цифр
 *  осталось, и не гадает, в каком виде вводить номер.
 */

const MAX_DIGITS = 11;

/** Любой ввод → «+7 (923) 106-86-26».
 *
 *  Ведущую 8 приводим к 7 — люди набирают номер и так и так. Лишние цифры
 *  отбрасываем: вставка номера с добавочным не должна ломать маску.
 */
export function formatRuPhone(value: string): string {
  let digits = value.replace(/\D/g, '');

  if (digits.startsWith('8')) digits = `7${digits.slice(1)}`;
  // Ввод начали с «9» — человек набирает номер без кода страны.
  if (digits && !digits.startsWith('7')) digits = `7${digits}`;
  digits = digits.slice(0, MAX_DIGITS);

  if (!digits) return '';

  const code = digits.slice(1, 4);
  const first = digits.slice(4, 7);
  const second = digits.slice(7, 9);
  const third = digits.slice(9, 11);

  let result = '+7';
  if (code) result += ` (${code}`;
  if (code.length === 3) result += ')';
  if (first) result += ` ${first}`;
  if (second) result += `-${second}`;
  if (third) result += `-${third}`;

  return result;
}

/** Введён ли номер целиком. Форма пускает отправку только после этого —
 *  иначе бэкенд всё равно ответит ошибкой, но уже после похода по сети. */
export function isCompleteRuPhone(value: string): boolean {
  return value.replace(/\D/g, '').length === MAX_DIGITS;
}

/** «+7 (923) 106-86-26» → «+79231068626» для ссылки `tel:`. */
export function phoneHref(value: string): string {
  const digits = value.replace(/\D/g, '');
  return `tel:+${digits}`;
}
