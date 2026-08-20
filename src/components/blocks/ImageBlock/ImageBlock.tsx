import React, { FC } from 'react';
import Image from 'next/image';
import clsx from 'clsx';

import { ImageBlock as ImageBlockModel,ImageBlockHeight } from '@/services/Api';
import { keepOrdinalsWhole } from '@/utils/helpers';

import classes from './ImageBlock.module.scss';

interface Props {
  block: ImageBlockModel;
  /** Первый блок страницы грузим в приоритете: обычно это картинка
   *  на весь экран, и она же — самый заметный элемент при открытии. */
  priority?: boolean;
}

/** Картинка во всю ширину, при желании с надписью поверх. */
export const ImageBlock: FC<Props> = ({ block, priority = false }) => {
  if (!block.image) return null;

  return (
    <section id={block.anchor} className={clsx(classes.block, classes[block.height])}>
      <div className={classes.frame}>
        <Image
          src={block.image}
          alt={block.alt || block.overlay_text || ''}
          fill={block.height !== ImageBlockHeight.Auto}
          width={block.height === ImageBlockHeight.Auto ? 1600 : undefined}
          height={block.height === ImageBlockHeight.Auto ? 900 : undefined}
          className={classes.image}
          sizes="100vw"
          priority={priority}
        />

        {block.overlay_text && (
          <div className={classes.overlay}>
            <h1 className={classes.overlayText}>
              {keepOrdinalsWhole(block.overlay_text)}
            </h1>
          </div>
        )}
      </div>

      {block.caption && <p className={classes.caption}>{block.caption}</p>}
    </section>
  );
};
