import React, { FC, ReactNode } from 'react';
import clsx from 'clsx';

import classes from './Section.module.scss';

interface Props {
  /** Якорь блока: по нему прокручивает ссылка из шапки. */
  id?: string;
  /** Рубрика над заголовком: «О проекте», «Характеристики». */
  overline?: string;
  title?: string;
  intro?: string;
  /** Содержимое во всю ширину окна, мимо контейнера: карта, слайдер.
   *  Заголовок при этом всё равно остаётся в контейнере — иначе он
   *  съезжает относительно заголовков соседних блоков. */
  bleed?: boolean;
  background?: 'default' | 'secondary';
  className?: string;
  children?: ReactNode;
}

/** Обёртка блока страницы: якорь, отступы, заголовок.
 *
 *  Контейнер у всех блоков **один и тот же** — заголовки и содержимое
 *  выстраиваются по общей левой границе сверху донизу. Разной ширины по
 *  блокам быть не должно: страница из блоков разной ширины читается как
 *  набор случайных кусков, а не как одна страница. Длина строки текста,
 *  где она важна, ограничивается уже внутри самого блока.
 */
export const Section: FC<Props> = ({
  id,
  overline,
  title,
  intro,
  bleed = false,
  background = 'default',
  className,
  children,
}) => {
  const hasHeader = Boolean(overline || title || intro);

  return (
    <section
      id={id}
      className={clsx(classes.section, classes[`bg_${background}`], className)}
    >
      {hasHeader && (
        <div className={classes.container}>
          <header className={clsx(classes.header, !children && classes.headerLast)}>
            {overline && <p className={classes.overline}>{overline}</p>}
            {title && <h2 className={classes.title}>{title}</h2>}
            {intro && <p className={classes.intro}>{intro}</p>}
          </header>
        </div>
      )}

      {children &&
        (bleed ? children : <div className={classes.container}>{children}</div>)}
    </section>
  );
};
