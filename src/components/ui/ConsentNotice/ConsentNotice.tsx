'use client';

import React, { FC } from 'react';

import { selectLegalDocuments, useAppSelector } from '@/services/Store';

import { LegalLink } from '../LegalLink/LegalLink';
import classes from './ConsentNotice.module.scss';

interface Props {
  /** Текст на кнопке, под которой стоит уведомление. */
  action: string;
}

/** Строчка под кнопкой отправки: нажимая, посетитель соглашается на
 *  обработку данных.
 *
 *  Список документов берём из стора — он приходит из админки и меняется
 *  без разработчика. Пустой список не беда: согласие всё равно берём,
 *  а ссылки юрист заведёт позже. */
export const ConsentNotice: FC<Props> = ({ action }) => {
  const documents = useAppSelector(selectLegalDocuments);

  return (
    <p className={classes.notice}>
      Нажимая «{action}», вы соглашаетесь на обработку персональных данных
      {documents.length > 0 && (
        <>
          {' '}
          в соответствии с{' '}
          {documents.map((document, index) => (
            <React.Fragment key={document.id}>
              {index > 0 && (index === documents.length - 1 ? ' и ' : ', ')}
              <LegalLink
                href={document.url}
                className={classes.link}
                title={document.title.toLowerCase()}
              />
            </React.Fragment>
          ))}
        </>
      )}
      .
    </p>
  );
};
