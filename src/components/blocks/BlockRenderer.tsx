'use client';

import React, { FC } from 'react';

import { BlockType } from '@/services/Api';
import { selectEstateBlocks, useAppSelector } from '@/services/Store';

import { ContactsBlock } from './ContactsBlock/ContactsBlock';
import { FaqBlock } from './FaqBlock/FaqBlock';
import { GalleryBlock } from './GalleryBlock/GalleryBlock';
import { ImageBlock } from './ImageBlock/ImageBlock';
import { ListBlock } from './ListBlock/ListBlock';
import { MapBlock } from './MapBlock/MapBlock';
import { TextBlock } from './TextBlock/TextBlock';
import { VideoBlock } from './VideoBlock/VideoBlock';

/** Рисует страницу объекта по списку блоков из админки.
 *
 *  Порядок задан бэкендом (поле «Порядок» у блока) — здесь мы его не
 *  трогаем и ничего не сортируем.
 *
 *  Разбор по `type` — через switch, а не через объект-реестр: switch
 *  сужает тип, и внутри каждой ветки блок уже конкретный, без приведения
 *  типов руками. */
export const BlockRenderer: FC = () => {
  const blocks = useAppSelector(selectEstateBlocks);

  return (
    <>
      {blocks.map((block, index) => {
        const key = `${block.type}-${block.id}`;

        switch (block.type) {
          case BlockType.Image:
            // Первый блок страницы обычно картинка на весь экран, и она же
            // самый заметный элемент при открытии — грузим в приоритете.
            return <ImageBlock key={key} block={block} priority={index === 0} />;
          case BlockType.Video:
            return <VideoBlock key={key} block={block} />;
          case BlockType.Text:
            return <TextBlock key={key} block={block} />;
          case BlockType.List:
            return <ListBlock key={key} block={block} />;
          case BlockType.Gallery:
            return <GalleryBlock key={key} block={block} />;
          case BlockType.Faq:
            return <FaqBlock key={key} block={block} />;
          case BlockType.Map:
            return <MapBlock key={key} block={block} />;
          case BlockType.Contacts:
            return <ContactsBlock key={key} block={block} />;
          default:
            // Бэкенд новее фронтенда: тип блока завели, компонент ещё не
            // выкатили. Пропускаем — лучше страница без одного блока, чем
            // упавшая страница.
            return null;
        }
      })}
    </>
  );
};
