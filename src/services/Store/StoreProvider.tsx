'use client';

import React, { FC, ReactNode } from 'react';
import { Provider } from 'react-redux';

import { configureStore, RootStore } from './store';

interface Props {
  /** Данные, собранные на сервере (см. preload.ts). Стор поднимается
   *  сразу с ними, поэтому серверная разметка приходит уже заполненной —
   *  для поиска и для превью в мессенджере это обязательно. */
  preloadedState?: Partial<RootStore>;
  children: ReactNode;
}

/** Стор на дерево страницы.
 *
 *  Стор создаём здесь, а не в модуле: модульный синглтон на сервере был бы
 *  общим на всех посетителей сразу. Ленивый инициализатор `useState` даёт
 *  ровно один стор на жизнь компонента — на сервере это запрос, в браузере
 *  вкладка; пересоздание на каждый рендер обнуляло бы открытое окно заявки.
 */
export const StoreProvider: FC<Props> = ({ preloadedState, children }) => {
  const [store] = React.useState(() => configureStore(preloadedState));

  return <Provider store={store}>{children}</Provider>;
};
