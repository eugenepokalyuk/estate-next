'use client';

import React, { FC } from 'react';
import Image from 'next/image';

import {
  ClockIcon,
  GlobeIcon,
  LegalLink,
  MailIcon,
  PhoneIcon,
  PinIcon,
  TelegramIcon,
  VkIcon,
  WhatsappIcon,
  YoutubeIcon,
} from '@/components/ui';
import { Goals, reachGoal } from '@/lib/analytics';
import { SocialLinkKind } from '@/services/Api';
import { selectAppSettings, useAppSelector } from '@/services/Store';
import { phoneHref } from '@/utils/helpers';

import classes from './Footer.module.scss';

const SOCIAL_ICONS: Record<SocialLinkKind, FC<{ className?: string }>> = {
  [SocialLinkKind.Telegram]: TelegramIcon,
  [SocialLinkKind.Whatsapp]: WhatsappIcon,
  [SocialLinkKind.Vk]: VkIcon,
  [SocialLinkKind.Youtube]: YoutubeIcon,
  // У MAX своего логотипа в наборе нет — до появления рисуем нейтральный
  // значок, ссылка от этого работать не перестаёт.
  [SocialLinkKind.Max]: GlobeIcon,
  [SocialLinkKind.Site]: GlobeIcon,
};

/** Футер, общий для главной и всех страниц объектов.
 *
 *  Содержимое целиком из админки (раздел «Настройки сайта»): компания,
 *  контакты, соцсети, правовые документы. Настроек нет (API не ответил) —
 *  футер не рисуем вовсе: пустая рамка с одним копирайтом выглядит хуже,
 *  чем её отсутствие. */
export const Footer: FC = () => {
  const site = useAppSelector(selectAppSettings);

  if (!site) return null;

  return (
    <footer className={classes.footer}>
      <div className={classes.inner}>
        <div className={classes.about}>
          {site.logo ? (
            <Image
              src={site.logo}
              alt={site.company_name}
              width={180}
              height={44}
              className={classes.logo}
            />
          ) : (
            <p className={classes.company}>{site.company_name}</p>
          )}

          {site.description && (
            <p className={classes.description}>{site.description}</p>
          )}

          {site.socials.length > 0 && (
            <ul className={classes.socials}>
              {site.socials.map((social) => {
                const Icon = SOCIAL_ICONS[social.kind] ?? GlobeIcon;
                return (
                  <li key={social.id}>
                    <a
                      href={social.url}
                      className={classes.social}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.title}
                      onClick={() =>
                        reachGoal(Goals.SocialClick, { kind: social.kind })
                      }
                    >
                      <Icon />
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className={classes.column}>
          <h2 className={classes.columnTitle}>Контакты</h2>
          <ul className={classes.contacts}>
            {site.phone && (
              <li className={classes.contact}>
                <PhoneIcon className={classes.contactIcon} />
                <a
                  href={phoneHref(site.phone)}
                  onClick={() => reachGoal(Goals.PhoneClick, { place: 'footer' })}
                >
                  {site.phone}
                </a>
              </li>
            )}
            {site.email && (
              <li className={classes.contact}>
                <MailIcon className={classes.contactIcon} />
                <a
                  href={`mailto:${site.email}`}
                  onClick={() => reachGoal(Goals.EmailClick, { place: 'footer' })}
                >
                  {site.email}
                </a>
              </li>
            )}
            {site.address && (
              <li className={classes.contact}>
                <PinIcon className={classes.contactIcon} />
                <span>{site.address}</span>
              </li>
            )}
            {site.working_hours && (
              <li className={classes.contact}>
                <ClockIcon className={classes.contactIcon} />
                <span>{site.working_hours}</span>
              </li>
            )}
          </ul>
        </div>

        {site.legal_documents.length > 0 && (
          <div className={classes.column}>
            <h2 className={classes.columnTitle}>Документы</h2>
            <ul className={classes.legal}>
              {site.legal_documents.map((document) => (
                <li key={document.id}>
                  <LegalLink
                    href={document.url}
                    title={document.title}
                    className={classes.legalLink}
                    onClick={() =>
                      reachGoal(Goals.LegalOpen, { title: document.title })
                    }
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className={classes.bottom}>
        <div className={classes.bottomInner}>
          <p>{site.copyright_note}</p>
          {site.legal_name && (
            <p className={classes.legalName}>{site.legal_name}</p>
          )}
        </div>
      </div>
    </footer>
  );
};
