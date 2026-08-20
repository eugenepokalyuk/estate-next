'use client';

import React, { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';

import { Button, CloseIcon, MenuIcon } from '@/components/ui';
import { Goals, reachGoal } from '@/lib/analytics';
import {
  leadActions,
  selectEstate,
  selectEstateMenu,
  useAppDispatch,
  useAppSelector,
} from '@/services/Store';
import { Routes } from '@/utils/consts/routes';
import { keepOrdinalsWhole, scrollToAnchor } from '@/utils/helpers';

import classes from './Header.module.scss';

/** Шапка страницы объекта: логотип, ссылки на блоки, кнопка заявки.
 *
 *  Универсальная — одна на все объекты. Что попадёт в меню, решает
 *  админка: у блока заполняют «Пункт в шапке», и он появляется ссылкой
 *  с прокруткой к своему якорю. Логотип берётся из объекта, а без файла
 *  показывается название проекта текстом. */
export const Header: FC = () => {
  const dispatch = useAppDispatch();
  const estate = useAppSelector(selectEstate);
  const menu = useAppSelector(selectEstateMenu);

  const [menuOpen, setMenuOpen] = React.useState(false);

  if (!estate) return null;

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={classes.header}>
      <div className={classes.inner}>
        <Link href={Routes.Home} className={classes.logo} onClick={closeMenu}>
          {estate.logo ? (
            <Image
              src={estate.logo}
              alt={estate.name}
              width={160}
              height={40}
              className={classes.logoImage}
              // Логотип виден сразу — грузим его в первую очередь, иначе
              // шапка на секунду остаётся пустой.
              priority
            />
          ) : (
            <span className={classes.logoText}>{keepOrdinalsWhole(estate.name)}</span>
          )}
        </Link>

        {menu.length > 0 && (
          <nav className={classes.nav} aria-label="Разделы страницы">
            {menu.map((item) => (
              <a
                key={item.anchor}
                href={`#${item.anchor}`}
                className={classes.navLink}
                onClick={(event) => {
                  event.preventDefault();
                  reachGoal(Goals.MenuClick, { anchor: item.anchor });
                  scrollToAnchor(item.anchor);
                }}
              >
                {item.title}
              </a>
            ))}
          </nav>
        )}

        <div className={classes.actions}>
          <Button
            size="sm"
            className={classes.cta}
            onClick={() => dispatch(leadActions.openLeadModal())}
          >
            Оставить заявку
          </Button>

          {menu.length > 0 && (
            <button
              type="button"
              className={classes.burger}
              aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {/* Обе иконки лежат друг на друге и меняются поворотом —
                  без подмены элемента, поэтому нечему дёргаться. */}
              <span className={classes.burgerIcons}>
                <MenuIcon className={classes.burgerIcon} />
                <CloseIcon className={clsx(classes.burgerIcon, classes.burgerIconClose)} />
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Выпадающее меню на узком экране. Раскрывается через
          grid-template-rows: 0fr → 1fr — чистый CSS, без измерения высоты
          в JS, поэтому анимация не зависит от того, успела ли библиотека
          снять размеры содержимого. */}
      {menu.length > 0 && (
        <nav
          className={clsx(classes.mobileNav, menuOpen && classes.mobileNavOpen)}
          aria-label="Разделы страницы"
          aria-hidden={!menuOpen}
        >
          <div className={classes.mobileNavInner}>
            {menu.map((item, index) => (
              <a
                key={item.anchor}
                href={`#${item.anchor}`}
                className={classes.mobileNavLink}
                // Ссылки подъезжают по очереди: задержку задаёт индекс.
                style={{ '--index': index } as React.CSSProperties}
                tabIndex={menuOpen ? undefined : -1}
                onClick={(event) => {
                  event.preventDefault();
                  reachGoal(Goals.MenuClick, { anchor: item.anchor });
                  closeMenu();
                  scrollToAnchor(item.anchor);
                }}
              >
                {item.title}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};
