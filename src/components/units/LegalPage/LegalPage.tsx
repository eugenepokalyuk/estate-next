'use client';

import React, { FC } from 'react';
import Link from 'next/link';

import { ArrowLeftIcon } from '@/components/ui';
import { selectAppSettings, useAppSelector } from '@/services/Store';
import { Routes } from '@/utils/consts/routes';

import classes from './LegalPage.module.scss';

export interface LegalSection {
  title: string;
  /** Абзацы раздела. Списки задаются отдельным полем ниже. */
  paragraphs?: string[];
  /** Маркированный список после абзацев. */
  items?: string[];
}

interface Props {
  title: string;
  /** Дата последней редакции — её спрашивают в первую очередь. */
  updatedAt: string;
  intro?: string;
  sections: LegalSection[];
}

/** Единый каркас правовой страницы: заголовок, дата, разделы, реквизиты.
 *
 *  Реквизиты и контакты подставляются из настроек сайта, а не вписаны в
 *  текст: сменился телефон или юрлицо — правится в админке, а не в трёх
 *  документах сразу.
 */
export const LegalPage: FC<Props> = ({ title, updatedAt, intro, sections }) => {
  const settings = useAppSelector(selectAppSettings);
  const operator = settings?.legal_name || settings?.company_name;

  return (
    <main className={classes.main}>
      <Link href={Routes.Home} className={classes.back}>
        <ArrowLeftIcon className={classes.backIcon} />
        На главную
      </Link>

      <h1 className={classes.title}>{title}</h1>
      <p className={classes.updated}>Редакция от {updatedAt}</p>

      {intro && <p className={classes.intro}>{intro}</p>}

      {sections.map((section, index) => (
        <section key={section.title} className={classes.section}>
          <h2 className={classes.sectionTitle}>
            {index + 1}. {section.title}
          </h2>

          {section.paragraphs?.map((paragraph, paragraphIndex) => (
            // Абзацы статичны и не переставляются — индекс в ключе безопасен.
            <p key={paragraphIndex} className={classes.paragraph}>
              {paragraph}
            </p>
          ))}

          {section.items && (
            <ul className={classes.list}>
              {section.items.map((item) => (
                <li key={item} className={classes.listItem}>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      {(operator || settings?.email || settings?.address) && (
        <section className={classes.section}>
          <h2 className={classes.sectionTitle}>Реквизиты и контакты</h2>
          {operator && <p className={classes.paragraph}>{operator}</p>}
          {settings?.address && (
            <p className={classes.paragraph}>{settings.address}</p>
          )}
          {settings?.email && (
            <p className={classes.paragraph}>
              <a className={classes.link} href={`mailto:${settings.email}`}>
                {settings.email}
              </a>
            </p>
          )}
        </section>
      )}
    </main>
  );
};
