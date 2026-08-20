'use client';

import React, { FC, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { CloseIcon } from '../Icons';
import classes from './Modal.module.scss';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
}

/** Модальное окно: затемнение, карточка по центру, закрытие по Esc,
 *  клику по фону и крестику.
 *
 *  Рисуется порталом в `body`, а не на месте вызова: иначе `overflow`
 *  или `transform` у любого родителя обрежет окно или сломает его
 *  позиционирование. */
export const Modal: FC<Props> = ({ open, onClose, title, description, children }) => {
  React.useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    // Фон не должен прокручиваться под открытым окном — на телефоне это
    // самый заметный дефект: страница уезжает, окно остаётся.
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [open, onClose]);

  // На сервере портала нет: DOM появляется только в браузере.
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className={classes.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className={classes.card}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.2 }}
            // Клик внутри карточки не должен закрывать окно — всплытие
            // до подложки останавливаем здесь.
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className={classes.close}
              aria-label="Закрыть"
              onClick={onClose}
            >
              <CloseIcon />
            </button>

            <h2 className={classes.title}>{title}</h2>
            {description && <p className={classes.description}>{description}</p>}

            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};
