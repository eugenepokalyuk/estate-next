'use client';

import React, { FC } from 'react';
import { motion } from 'framer-motion';

import { ChatIcon } from '@/components/ui';
import { leadActions, useAppDispatch } from '@/services/Store';

import classes from './LeadFab.module.scss';

/** Кнопка «Оставить заявку» в правом нижнем углу.
 *
 *  Висит поверх страницы на всех экранах объекта: посетитель может
 *  захотеть связаться на любом блоке, и возвращаться за этим наверх
 *  он не станет. Подпись видна на широком экране, на телефоне остаётся
 *  один кружок с иконкой — иначе кнопка закрывает пол-страницы. */
export const LeadFab: FC = () => {
  const dispatch = useAppDispatch();

  return (
    <motion.button
      type="button"
      className={classes.fab}
      onClick={() => dispatch(leadActions.openLeadModal())}
      aria-label="Оставить заявку"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
    >
      <ChatIcon className={classes.icon} />
      <span className={classes.label}>Оставить заявку</span>
    </motion.button>
  );
};
