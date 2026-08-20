import React from 'react';
import Link from 'next/link';

import { Routes } from '@/utils/consts/routes';

import classes from './not-found.module.scss';

export default function NotFound() {
  return (
    <main className={classes.main}>
      <p className={classes.code}>404</p>
      <h1 className={classes.title}>Страница не найдена</h1>
      <p className={classes.text}>
        Объект мог быть снят с продажи или ссылка устарела. Посмотрите, что есть
        сейчас.
      </p>
      <Link href={Routes.Home} className={classes.link}>
        Ко всем объектам
      </Link>
    </main>
  );
}
