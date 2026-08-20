'use client';

import React, { FC } from 'react';

import {
  Button,
  ClockIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  Section,
} from '@/components/ui';
import { Goals, reachGoal } from '@/lib/analytics';
import { ContactsBlock as ContactsBlockModel } from '@/services/Api';
import { leadActions, useAppDispatch } from '@/services/Store';
import { phoneHref } from '@/utils/helpers';

import classes from './ContactsBlock.module.scss';

interface Props {
  block: ContactsBlockModel;
}

/** Контакты по объекту. Пустые поля бэкенд уже закрыл общими контактами
 *  компании, поэтому здесь просто рисуем то, что пришло. */
export const ContactsBlock: FC<Props> = ({ block }) => {
  const dispatch = useAppDispatch();

  return (
    <Section
      id={block.anchor}
      title={block.title}
      intro={block.intro}
      background="secondary"
    >
      <div className={classes.card}>
        <ul className={classes.contacts}>
          {block.manager_name && (
            <li className={classes.manager}>{block.manager_name}</li>
          )}
          {block.phone && (
            <li className={classes.contact}>
              <PhoneIcon className={classes.icon} />
              <a
                href={phoneHref(block.phone)}
                className={classes.phone}
                onClick={() => reachGoal(Goals.PhoneClick, { place: 'contacts' })}
              >
                {block.phone}
              </a>
            </li>
          )}
          {block.email && (
            <li className={classes.contact}>
              <MailIcon className={classes.icon} />
              <a
                href={`mailto:${block.email}`}
                onClick={() => reachGoal(Goals.EmailClick, { place: 'contacts' })}
              >
                {block.email}
              </a>
            </li>
          )}
          {block.address && (
            <li className={classes.contact}>
              <PinIcon className={classes.icon} />
              <span>{block.address}</span>
            </li>
          )}
          {block.working_hours && (
            <li className={classes.contact}>
              <ClockIcon className={classes.icon} />
              <span>{block.working_hours}</span>
            </li>
          )}
        </ul>

        {block.show_form_button && (
          <Button
            size="lg"
            className={classes.button}
            onClick={() => dispatch(leadActions.openLeadModal())}
          >
            Оставить заявку
          </Button>
        )}
      </div>
    </Section>
  );
};
