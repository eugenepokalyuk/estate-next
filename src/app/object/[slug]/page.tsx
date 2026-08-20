import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { BlockRenderer } from '@/components/blocks';
import { Footer, Header, LeadFab, LeadModal } from '@/components/units';
import { ApiError, getEstateApi } from '@/services/Api';
import { StoreProvider } from '@/services/Store';
import { preloadEstateState } from '@/services/Store/preload';

interface Params {
  params: Promise<{ slug: string }>;
}

/** Заголовок, описание и превью для шеринга — на каждый объект свои.
 *  Ссылка на объект чаще всего живёт в мессенджере, и карточка там важнее,
 *  чем позиция в поиске. */
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;

  let estate;
  try {
    // Тот же запрос, что и на странице: ответ кэширован, второго похода
    // в Django не будет.
    estate = await getEstateApi({ slug });
  } catch (error) {
    if (error instanceof ApiError) return { title: 'Объект не найден' };
    throw error;
  }

  const canonical = `/object/${slug}`;

  return {
    title: estate.meta_title,
    description: estate.meta_description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      title: estate.meta_title,
      description: estate.meta_description,
      url: canonical,
      images: estate.cover ? [{ url: estate.cover }] : undefined,
    },
  };
}

/** Страница объекта: шапка, блоки из админки, футер, виджет заявки.
 *
 *  Содержимое собирает сервер и кладёт в стор — блоки должны быть в
 *  разметке сразу. Страница не пререндерится на сборке: правку блока в
 *  админке видно без пересборки (данные кэшируются на минуту). */
export default async function ObjectPage({ params }: Params) {
  const { slug } = await params;

  const preloadedState = await preloadEstateState(slug);

  // Объекта нет, он снят с публикации или API недоступен — во всех случаях
  // честный 404 лучше пустой страницы с шапкой.
  if (!preloadedState) notFound();

  return (
    <StoreProvider preloadedState={preloadedState}>
      <Header />

      <main>
        <BlockRenderer />
      </main>

      <Footer />

      <LeadModal
        estateSlug={preloadedState.estate?.data?.slug}
        estateName={preloadedState.estate?.data?.name}
      />
      <LeadFab />
    </StoreProvider>
  );
}
