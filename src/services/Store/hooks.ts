'use client';

import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootStore } from './store';

/** Типизированные хуки стора.
 *
 *  Директива обязательна: react-redux отдаёт серверным компонентам урезанную
 *  сборку (условие `react-server` в package.json), где у `useDispatch` нет
 *  `withTypes`. Без «use client» баррель `@/services/Store` затягивал бы этот
 *  файл в серверный граф, и сборка падала бы на `withTypes is not a function`.
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootStore>();
