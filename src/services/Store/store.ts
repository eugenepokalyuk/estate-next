import {
  configureStore as rtkConfigureStore,
  Middleware,
} from '@reduxjs/toolkit';
import { createEpicMiddleware } from 'redux-observable';

import { AppActions } from './App/slice';
import { initialAppState } from './App/store';
import { EstateActions, EstateListActions } from './Estate/slice';
import { initialEstateListState, initialEstateState } from './Estate/store';
import { LeadActions } from './Lead/slice';
import { initialLeadState } from './Lead/store';
import { rootEpic } from './rootEpic';
import { rootReducer } from './rootReducer';

// Единый источник правды выводим из rootReducer, чтобы тип стора не
// приходилось поддерживать вручную параллельно со слайсами.
export type RootStore = ReturnType<typeof rootReducer>;

export type RootActions =
  | AppActions
  | EstateListActions
  | EstateActions
  | LeadActions;

const defaultValue: RootStore = {
  app: initialAppState,
  estateList: initialEstateListState,
  estate: initialEstateState,
  lead: initialLeadState,
};

/** Создаёт стор. Вызывается на каждый рендер: на сервере это запрос
 *  посетителя, в браузере — один раз за жизнь вкладки (см. StoreProvider).
 *
 *  Синглтона здесь нет намеренно: на сервере он означал бы, что данные
 *  одного посетителя протекают к другому. */
export const configureStore = (initialStore?: Partial<RootStore>) => {
  const epicMiddleware = createEpicMiddleware<
    RootActions,
    RootActions,
    RootStore
  >();

  const preloadedState: RootStore = { ...defaultValue, ...initialStore };

  const store = rtkConfigureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      // Обе проверки активны только в dev (в проде RTK их выключает сам).
      // immutableCheck ловит мутации стейта мимо Immer, serializableCheck —
      // несериализуемые значения в сторе и экшенах (важно для гидрации).
      getDefaultMiddleware({
        immutableCheck: { warnAfter: 128 },
        serializableCheck: { warnAfter: 128 },
      }).concat(epicMiddleware as Middleware),
    devTools: process.env.NODE_ENV !== 'production',
  });

  epicMiddleware.run(rootEpic);
  return store;
};

export type AppStore = ReturnType<typeof configureStore>;
export type AppDispatch = AppStore['dispatch'];
