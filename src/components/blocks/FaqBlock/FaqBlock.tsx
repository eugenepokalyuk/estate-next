'use client';

import React, { FC } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { MinusIcon, PlusIcon, Section } from '@/components/ui';
import { Goals, reachGoal } from '@/lib/analytics';
import { FaqBlock as FaqBlockModel } from '@/services/Api';

import classes from './FaqBlock.module.scss';

interface Props {
  block: FaqBlockModel;
}

/** Вопросы и ответы: вопрос виден сразу, ответ раскрывается по клику. */
export const FaqBlock: FC<Props> = ({ block }) => {
  // Открыт максимум один вопрос: так список остаётся обозримым, а не
  // превращается в стену текста после нескольких кликов.
  const [openId, setOpenId] = React.useState<number | null>(null);

  if (block.entries.length === 0) return null;

  return (
    <Section id={block.anchor} title={block.title} intro={block.intro}>
      <ul className={classes.list}>
        {block.entries.map((entry) => {
          const isOpen = openId === entry.id;

          return (
            <li key={entry.id} className={classes.item}>
              <button
                type="button"
                className={classes.question}
                aria-expanded={isOpen}
                onClick={() => {
                  // Цель только на раскрытии: закрытие вопроса ничего
                  // не говорит об интересе.
                  if (!isOpen) {
                    reachGoal(Goals.FaqOpen, { question: entry.question });
                  }
                  setOpenId(isOpen ? null : entry.id);
                }}
              >
                <span>{entry.question}</span>
                {isOpen ? (
                  <MinusIcon className={classes.icon} />
                ) : (
                  <PlusIcon className={classes.icon} />
                )}
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    className={classes.answerWrap}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                  >
                    <p className={classes.answer}>{entry.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </Section>
  );
};
