'use client';

import React, { FC } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';

import { YM_COUNTER_ID, ymHit } from './metrika';

/** Счётчик Яндекс.Метрики и отслеживание переходов между страницами.
 *
 *  Код — стандартный сниппет Метрики, только номер счётчика из окружения.
 *  `defer:true`: показы страниц шлём сами, потому что переходы между
 *  объектами идут без перезагрузки и штатный автозамер увидел бы только
 *  первую страницу.
 *
 *  Пусто в NEXT_PUBLIC_YM_COUNTER_ID — компонент ничего не рендерит и
 *  ничего не грузит: ни скрипта, ни кук. Это рабочий режим для локали и
 *  стенда, отдельного флага «выключить аналитику» не нужно.
 *
 *  Следим только за путём, без query: `useSearchParams` в общем макете
 *  увёл бы весь сайт в динамический рендер. Рекламные метки Метрика и так
 *  разбирает сама на своей стороне.
 */
export const YandexMetrika: FC = () => {
  const pathname = usePathname();

  React.useEffect(() => {
    ymHit(pathname);
  }, [pathname]);

  if (!YM_COUNTER_ID) return null;

  return (
    <Script id="yandex-metrika" strategy="afterInteractive">
      {`
        (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
        (window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
        ym(${YM_COUNTER_ID}, "init", {defer:true, clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true});
      `}
    </Script>
  );
};
