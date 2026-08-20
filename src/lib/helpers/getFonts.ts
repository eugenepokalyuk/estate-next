import { Manrope, Prata } from 'next/font/google';

/** Шрифты грузит next/font: он кладёт файлы к себе, подставляет
 *  `font-display: swap` и не даёт странице моргнуть запросом к Google.
 *
 *  Переменные (--font-heading, --font-body) читают миксины типографики,
 *  поэтому сменить шрифт можно здесь одним местом. */

export const headingFont = Prata({
  weight: '400',
  subsets: ['cyrillic', 'latin'],
  variable: '--font-heading',
  display: 'swap',
});

export const bodyFont = Manrope({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-body',
  display: 'swap',
});

export const fontsClassName = `${headingFont.variable} ${bodyFont.variable}`;
