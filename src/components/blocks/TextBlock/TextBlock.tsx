import React, { FC } from 'react';
import clsx from 'clsx';

import { Section } from '@/components/ui';
import { TextBlock as TextBlockModel,TextBlockLayout } from '@/services/Api';
import { toParagraphs } from '@/utils/helpers';

import classes from './TextBlock.module.scss';

interface Props {
  block: TextBlockModel;
}

/** Текстовый блок: рубрика, заголовок, абзацы и пункты под ними. */
export const TextBlock: FC<Props> = ({ block }) => {
  const paragraphs = toParagraphs(block.text);

  return (
    <Section
      id={block.anchor}
      overline={block.subtitle}
      title={block.title}
    >
      {paragraphs.length > 0 && (
        <div
          className={clsx(
            classes.text,
            block.layout === TextBlockLayout.Narrow && classes.narrow,
            block.layout === TextBlockLayout.Columns && classes.columns,
          )}
        >
          {paragraphs.map((paragraph, index) => (
            // Абзацы приходят строкой и своих идентификаторов не имеют;
            // список статичный и не переставляется, поэтому индекс здесь
            // безопасен.
            <p key={index} className={classes.paragraph}>
              {paragraph}
            </p>
          ))}
        </div>
      )}

      {block.items.length > 0 && (
        <ul className={classes.items}>
          {block.items.map((item) => (
            <li key={item.id} className={classes.item}>
              <h3 className={classes.itemTitle}>{item.title}</h3>
              {item.text && <p className={classes.itemText}>{item.text}</p>}
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
};
