import { RootStore } from '../../store';

export const selectEstateList = (state: RootStore) => state.estateList.items;
export const selectEstateListLoading = (state: RootStore) => state.estateList.isLoading;
export const selectEstateListError = (state: RootStore) => state.estateList.error;

export const selectEstate = (state: RootStore) => state.estate.data;
export const selectEstateLoading = (state: RootStore) => state.estate.isLoading;
export const selectEstateError = (state: RootStore) => state.estate.error;

/** Пункты меню шапки. Пустой массив, пока объект не загружен, — шапка
 *  тогда рисует только логотип и кнопку. */
export const selectEstateMenu = (state: RootStore) => state.estate.data?.menu ?? [];

export const selectEstateBlocks = (state: RootStore) => state.estate.data?.blocks ?? [];
