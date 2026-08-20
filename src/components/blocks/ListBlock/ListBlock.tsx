import React, { FC } from 'react';

import { Section } from '@/components/ui';
import { ListBlock as ListBlockModel,ListDisplay } from '@/services/Api';

import classes from './ListBlock.module.scss';

interface Props {
  block: ListBlockModel;
}

/** Список: характеристики, преимущества, этапы.
 *
 *  Один блок с тремя видами показа вместо трёх похожих блоков — так
 *  в админке не приходится выбирать между «Плитками» и «Таблицей»
 *  на уровне типа блока, когда содержимое одно и то же. */
export const ListBlock: FC<Props> = ({ block }) => (
  <Section
    id={block.anchor}
    title={block.title}
    intro={block.intro}
    background="secondary"
  >
    {block.display === ListDisplay.Rows ? (
      <dl className={classes.rows}>
        {block.entries.map((entry) => (
          <div key={entry.id} className={classes.row}>
            <dt className={classes.rowTitle}>
              {entry.title}
              {entry.text && <span className={classes.rowText}>{entry.text}</span>}
            </dt>
            <dd className={classes.rowValue}>{entry.value || '—'}</dd>
          </div>
        ))}
      </dl>
    ) : (
      <ol className={classes.cards}>
        {block.entries.map((entry, index) => (
          <li key={entry.id} className={classes.card}>
            {block.display === ListDisplay.Numbered && (
              <span className={classes.number}>{index + 1}</span>
            )}
            <h3 className={classes.cardTitle}>{entry.title}</h3>
            {entry.value && <p className={classes.cardValue}>{entry.value}</p>}
            {entry.text && <p className={classes.cardText}>{entry.text}</p>}
          </li>
        ))}
      </ol>
    )}
  </Section>
);
