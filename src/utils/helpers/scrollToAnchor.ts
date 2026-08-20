import { smoothScrollTo } from './smoothScroll';

/** Прокрутка к блоку по якорю из меню шапки.
 *
 *  Обычный переход по `#якорь` здесь не годится: он опирается на штатную
 *  плавную прокрутку браузера, а она ненадёжна — где-то отключена, где-то
 *  не выполняется вовсе, и тогда переход либо не делает ничего, либо
 *  происходит рывком. Анимацию считаем сами (см. smoothScroll).
 *
 *  Отступ под липкую шапку тоже считаем сами: её высота разная на десктопе
 *  и на телефоне, а `scroll-padding-top` пришлось бы держать синхронно
 *  с вёрсткой в двух местах.
 */

/** Запас между шапкой и заголовком блока, чтобы тот не упирался в неё. */
const GAP_BELOW_HEADER = 16;

function getHeaderOffset(): number {
  const header = document.querySelector('header');
  const height = header?.getBoundingClientRect().height ?? 0;
  return height + GAP_BELOW_HEADER;
}

export function scrollToAnchor(anchor: string): void {
  const target = document.getElementById(anchor);
  if (!target) return;

  const top = Math.max(
    0,
    target.getBoundingClientRect().top + window.scrollY - getHeaderOffset(),
  );

  smoothScrollTo(top);

  // Адрес в строке браузера — чтобы ссылку на блок можно было скопировать.
  // replaceState, а не hash: смена hash дёрнула бы ещё одну прокрутку
  // поверх нашей.
  window.history.replaceState(null, '', `#${anchor}`);
}
