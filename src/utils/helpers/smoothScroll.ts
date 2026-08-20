/** Плавная прокрутка своими руками, без `behavior: 'smooth'`.
 *
 *  Штатная плавная прокрутка браузера ненадёжна: она отключается настройками
 *  системы и политиками, а в части окружений не выполняется вовсе — тогда
 *  `scrollTo({behavior:'smooth'})` просто не двигает страницу, и переход по
 *  якорю выглядит как рывок или не происходит совсем.
 *
 *  Здесь анимация считается сама через requestAnimationFrame, поэтому
 *  результат одинаковый везде. При включённом «уменьшить движение»
 *  прокручиваем мгновенно — это осознанный выбор человека, а не поломка.
 */

const DURATION_MS = 480;

/** Плавное начало и мягкое торможение в конце. */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Скрытой вкладке браузер не выдаёт кадры анимации: requestAnimationFrame
 *  не вызывается вовсе, и анимированная прокрутка просто не состоялась бы.
 *  Такое бывает при переходе по ссылке в фоновой вкладке и в автотестах. */
function isHidden(): boolean {
  return document.visibilityState === 'hidden';
}

interface Options {
  /** Что прокручиваем. Пусто — страница целиком. */
  element?: HTMLElement;
  /** Ось: страница прокручивается вертикально, лента слайдов — горизонтально. */
  axis?: 'y' | 'x';
  duration?: number;
  /** Вызовется, когда анимация закончилась. Нужен там, где на время
   *  прокрутки что-то временно отключено (например, scroll-snap). */
  onDone?: () => void;
}

/** Прокручивает к позиции `to` (в пикселях от начала). */
export function smoothScrollTo(to: number, options: Options = {}): void {
  const { element, axis = 'y', duration = DURATION_MS, onDone } = options;

  const read = () => {
    if (element) return axis === 'x' ? element.scrollLeft : element.scrollTop;
    return axis === 'x' ? window.scrollX : window.scrollY;
  };

  const write = (value: number) => {
    if (element) {
      if (axis === 'x') element.scrollLeft = value;
      else element.scrollTop = value;
      return;
    }
    // Для окна — 'instant', а не 'auto': 'auto' означает «как задано в CSS»,
    // и при scroll-behavior: smooth браузер начал бы поверх нашей анимации
    // ещё и свою.
    window.scrollTo(
      axis === 'x'
        ? { left: value, behavior: 'instant' }
        : { top: value, behavior: 'instant' },
    );
  };

  const from = read();
  const distance = to - from;

  if (Math.abs(distance) < 2) {
    onDone?.();
    return;
  }

  if (prefersReducedMotion() || isHidden()) {
    write(to);
    onDone?.();
    return;
  }

  const start = performance.now();

  const step = (now: number) => {
    const progress = Math.min((now - start) / duration, 1);
    write(from + distance * easeInOutCubic(progress));
    if (progress < 1) requestAnimationFrame(step);
    else onDone?.();
  };

  requestAnimationFrame(step);
}
