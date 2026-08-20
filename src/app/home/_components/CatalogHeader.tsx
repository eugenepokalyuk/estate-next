'use client';

import React, { FC } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui';
import { Goals, reachGoal } from '@/lib/analytics';
import {
  leadActions,
  selectCompanyName,
  selectCompanyPhone,
  useAppDispatch,
  useAppSelector,
} from '@/services/Store';
import { Routes } from '@/utils/consts/routes';
import { phoneHref } from '@/utils/helpers';

import classes from './CatalogHeader.module.scss';

/** Шапка главной: название компании, телефон, кнопка заявки.
 *
 *  Отдельная от шапки объекта: там логотип и меню блоков конкретного
 *  проекта, здесь — компания целиком. Общего между ними ровно кнопка,
 *  сводить их в один компонент с флагами было бы хуже. */
export const CatalogHeader: FC = () => {
  const dispatch = useAppDispatch();
  const companyName = useAppSelector(selectCompanyName);
  const phone = useAppSelector(selectCompanyPhone);

  return (
    <header className={classes.header}>
      <div className={classes.inner}>
        <Link href={Routes.Home} className={classes.logo}>
          {companyName ?? 'Коммерческая недвижимость'}
        </Link>

        <div className={classes.actions}>
          {phone && (
            <a
              href={phoneHref(phone)}
              className={classes.phone}
              onClick={() => reachGoal(Goals.PhoneClick, { place: 'header' })}
            >
              {phone}
            </a>
          )}
          <Button size="sm" onClick={() => dispatch(leadActions.openLeadModal())}>
            Оставить заявку
          </Button>
        </div>
      </div>
    </header>
  );
};
