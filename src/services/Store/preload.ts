import {
  ApiError,
  getAppSettingsApi,
  getEstateApi,
  getEstateListApi,
} from '@/services/Api';

import { initialAppState } from './App/store';
import { initialEstateListState, initialEstateState } from './Estate/store';
import { toErrorMessage } from './helpers/toErrorMessage';
import { RootStore } from './store';

import 'server-only';

/** Сборка начального состояния стора на сервере.
 *
 *  Почему не эпиками: эпики живут в браузере, а страницу объекта нужно
 *  отдать поисковику и мессенджеру уже заполненной. Поэтому первый заход
 *  за данными делает сервер, кладёт их в стор через StoreProvider, а
 *  дальше страница работает как обычное redux-приложение — эпики
 *  обслуживают всё, что происходит после загрузки.
 *
 *  Ошибка API страницу не роняет: она уезжает в стор тем же полем `error`,
 *  что заполняют эпики, — компоненту без разницы, откуда оно взялось.
 */

/** Настройки нужны каждой странице: из них собирается футер. */
async function preloadApp(): Promise<RootStore['app']> {
  try {
    return { ...initialAppState, settings: await getAppSettingsApi() };
  } catch (error) {
    return { ...initialAppState, error: toErrorMessage(error) };
  }
}

async function preloadEstateList(): Promise<RootStore['estateList']> {
  try {
    return { ...initialEstateListState, items: await getEstateListApi() };
  } catch (error) {
    return { ...initialEstateListState, error: toErrorMessage(error) };
  }
}

/** Правовая страница: из общего нужен только футер и реквизиты компании. */
export async function preloadLegalState(): Promise<Partial<RootStore>> {
  return { app: await preloadApp() };
}

/** Главная: каталог и футер. Запросы параллельны — они не зависят друг от
 *  друга, а последовательные ожидания складывали бы задержку. */
export async function preloadHomeState(): Promise<Partial<RootStore>> {
  const [estateList, app] = await Promise.all([
    preloadEstateList(),
    preloadApp(),
  ]);

  return { estateList, app };
}

/** Страница объекта. `null` — объекта нет, он снят с публикации или API
 *  недоступен: страница на это отвечает 404, и собирать состояние
 *  дальше незачем. */
export async function preloadEstateState(
  slug: string,
): Promise<Partial<RootStore> | null> {
  const [estate, app] = await Promise.all([getEstate(slug), preloadApp()]);

  if (!estate) return null;

  return { estate: { ...initialEstateState, data: estate }, app };
}

async function getEstate(slug: string) {
  try {
    return await getEstateApi({ slug });
  } catch (error) {
    // 404 — объекта нет или он снят с публикации, это штатный ответ.
    // Любая другая ошибка (сеть, 500) здесь тоже означает «показать не
    // можем»: рисовать шапку с пустой страницей хуже, чем честный 404.
    if (error instanceof ApiError) return null;
    throw error;
  }
}
