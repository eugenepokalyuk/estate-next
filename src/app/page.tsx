import React from 'react';

import { Footer, LeadFab, LeadModal } from '@/components/units';
import { StoreProvider } from '@/services/Store';
import { preloadHomeState } from '@/services/Store/preload';

import { CatalogHeader } from './home/_components/CatalogHeader';
import { CatalogView } from './home/_components/CatalogView';

/** Главная — витрина объектов.
 *
 *  Данные собирает сервер и кладёт в стор (см. preload): каталог должен
 *  быть в разметке сразу, а не появляться после запроса из браузера.
 *  Дальше страница живёт как обычное redux-приложение. */
export default async function HomePage() {
  const preloadedState = await preloadHomeState();

  return (
    <StoreProvider preloadedState={preloadedState}>
      <CatalogHeader />

      <CatalogView />

      <Footer />

      <LeadModal />
      <LeadFab />
    </StoreProvider>
  );
}
