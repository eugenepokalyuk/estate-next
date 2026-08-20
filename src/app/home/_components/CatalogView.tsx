'use client';

import React, { FC } from 'react';

import {
  selectEstateList,
  selectEstateListError,
  useAppSelector,
} from '@/services/Store';

import { EstateCard } from './EstateCard';
import classes from '../home.module.scss';

/** Каталог объектов на главной. */
export const CatalogView: FC = () => {
  const estates = useAppSelector(selectEstateList);
  const error = useAppSelector(selectEstateListError);

  return (
    <main className={classes.main}>
      <div className={classes.intro}>
        <h1 className={classes.title}>Коммерческая недвижимость</h1>
        <p className={classes.subtitle}>
          Объекты в продаже и аренде: бизнес-центры, помещения, участки.
        </p>
      </div>

      {estates.length > 0 ? (
        <ul className={classes.grid}>
          {estates.map((estate) => (
            <li key={estate.id}>
              <EstateCard estate={estate} />
            </li>
          ))}
        </ul>
      ) : (
        <p className={classes.empty}>
          {error ?? 'Объекты появятся здесь, как только их добавят в админке.'}
        </p>
      )}
    </main>
  );
};
