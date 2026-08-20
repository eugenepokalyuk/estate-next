'use client';

import React, { FC } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from '../Icons';
import classes from './Lightbox.module.scss';

export interface LightboxItem {
  id: number;
  image: string;
  caption?: string;
}

interface Props {
  items: LightboxItem[];
  /** Индекс открытой картинки. null — окно закрыто. */
  index: number | null;
  onClose: () => void;
  onChange: (index: number) => void;
}

/** Просмотр картинки во весь экран с листанием.
 *
 *  Отдельный компонент, а не `Modal`: у модалки светлая карточка с
 *  заголовком и отступами, а фотографии нужен тёмный фон во весь экран и
 *  максимум места. Общего между ними — только портал и закрытие по Esc.
 *
 *  Листается стрелками с клавиатуры и кнопками по бокам; по кругу, чтобы
 *  с последнего кадра можно было вернуться к первому не через всю ленту.
 */
export const Lightbox: FC<Props> = ({ items, index, onClose, onChange }) => {
  const isOpen = index !== null && items.length > 0;

  const showPrev = React.useCallback(() => {
    if (index === null) return;
    onChange((index - 1 + items.length) % items.length);
  }, [index, items.length, onChange]);

  const showNext = React.useCallback(() => {
    if (index === null) return;
    onChange((index + 1) % items.length);
  }, [index, items.length, onChange]);

  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') showPrev();
      if (event.key === 'ArrowRight') showNext();
    };

    document.addEventListener('keydown', handleKeyDown);
    // Страница под открытой картинкой прокручиваться не должна: на телефоне
    // это самый заметный дефект — фон уезжает, картинка остаётся.
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [isOpen, onClose, showPrev, showNext]);

  // На сервере портала нет: DOM появляется только в браузере.
  if (typeof document === 'undefined') return null;

  const current = index === null ? undefined : items[index];

  return createPortal(
    <AnimatePresence>
      {isOpen && current && (
        <motion.div
          className={classes.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label={current.caption || 'Просмотр изображения'}
          onClick={onClose}
        >
          <button
            type="button"
            className={classes.close}
            aria-label="Закрыть"
            onClick={onClose}
          >
            <CloseIcon />
          </button>

          {items.length > 1 && (
            <button
              type="button"
              className={clsx(classes.arrow, classes.arrowPrev)}
              aria-label="Предыдущее изображение"
              onClick={(event) => {
                // Клик по фону закрывает окно — на кнопках всплытие гасим.
                event.stopPropagation();
                showPrev();
              }}
            >
              <ArrowLeftIcon />
            </button>
          )}

          <motion.figure
            key={current.id}
            className={classes.figure}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={current.image}
              alt={current.caption || ''}
              width={1920}
              height={1280}
              className={classes.image}
              sizes="100vw"
              priority
            />

            {(current.caption || items.length > 1) && (
              <figcaption className={classes.caption}>
                {current.caption}
                {items.length > 1 && (
                  <span className={classes.counter}>
                    {index + 1} / {items.length}
                  </span>
                )}
              </figcaption>
            )}
          </motion.figure>

          {items.length > 1 && (
            <button
              type="button"
              className={clsx(classes.arrow, classes.arrowNext)}
              aria-label="Следующее изображение"
              onClick={(event) => {
                event.stopPropagation();
                showNext();
              }}
            >
              <ArrowRightIcon />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};