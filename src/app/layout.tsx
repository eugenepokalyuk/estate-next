import React, { ReactNode } from 'react';
import type { Metadata } from 'next';

import { YandexMetrika } from '@/lib/analytics';
import { fontsClassName } from '@/lib/helpers/getFonts';

import 'normalize.css';
import '@/styles/globals.scss';

export const metadata: Metadata = {
  title: {
    default: 'Коммерческая недвижимость',
    // Страница объекта подставляет своё название вместо %s.
    template: '%s',
  },
  description: 'Продажа и аренда коммерческой недвижимости.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className={fontsClassName}>
      {/* Футер прижимается к низу коротких страниц: на теле включён flex,
          а у футера margin-top: auto. */}
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
        {children}

        <YandexMetrika />
      </body>
    </html>
  );
}
