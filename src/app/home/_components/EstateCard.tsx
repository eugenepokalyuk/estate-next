import React, { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Goals, reachGoal } from '@/lib/analytics';
import { Estate } from '@/services/Api';
import { Routes } from '@/utils/consts/routes';
import { formatPriceWithNote, keepOrdinalsWhole } from '@/utils/helpers';

import classes from './EstateCard.module.scss';

interface Props {
  estate: Estate;
}

/** Карточка объекта в каталоге. Вся карточка — одна ссылка на страницу
 *  объекта: попасть по ней проще, чем в отдельную кнопку. */
export const EstateCard: FC<Props> = ({ estate }) => (
  <Link
    href={Routes.Object(estate.slug)}
    className={classes.card}
    onClick={() => reachGoal(Goals.EstateOpen, { slug: estate.slug })}
  >
    <div className={classes.cover}>
      {estate.cover ? (
        <Image
          src={estate.cover}
          alt={estate.name}
          width={800}
          height={600}
          className={classes.image}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
      ) : (
        // Обложку могли не загрузить — плашка держит высоту карточки,
        // иначе сетка съезжает.
        <div className={classes.placeholder} aria-hidden />
      )}

      <span className={classes.status}>{estate.status_display}</span>
    </div>

    <div className={classes.body}>
      <p className={classes.kind}>
        {estate.kind_display}
        {estate.city && ` · ${estate.city}`}
      </p>

      <h2 className={classes.name}>{keepOrdinalsWhole(estate.name)}</h2>

      {estate.short_description && (
        <p className={classes.description}>{estate.short_description}</p>
      )}

      <div className={classes.footer}>
        <span className={classes.price}>
          {formatPriceWithNote(estate.price, estate.price_note)}
        </span>
        {estate.area && <span className={classes.area}>{estate.area}</span>}
      </div>
    </div>
  </Link>
);
