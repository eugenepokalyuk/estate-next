/** «185000» → «185 000 ₽».
 *
 *  Перед знаком рубля неразрывный пробел — иначе «₽» уезжает на следующую
 *  строку и цена рвётся пополам. Записан escape-последовательностью, а не
 *  самим символом: глазами в коде такой пробел от обычного не отличить. */
export function formatPrice(value: number): string {
  return `${value.toLocaleString('ru-RU', { maximumFractionDigits: 0 })}\u00A0₽`;
}

/** Цена с припиской из админки: «185 000 ₽ за м²», «от 24 000 000 ₽».
 *
 *  Приписка бывает и до цены («от»), и после («за м²»). Различаем по
 *  самому частому случаю: короткие предлоги ставим спереди, остальное —
 *  сзади. Иначе пришлось бы заводить в админке ещё одно поле-переключатель
 *  ради двух вариантов. */
export function formatPriceWithNote(
  value: number | null,
  note: string,
): string {
  if (value === null) return 'Цена по запросу';

  const price = formatPrice(value);
  const trimmed = note.trim();
  if (!trimmed) return price;

  const PREFIXES = ['от', 'до', 'ок.', 'около'];
  if (PREFIXES.includes(trimmed.toLowerCase())) {
    return `${trimmed} ${price}`;
  }
  return `${price} ${trimmed}`;
}
