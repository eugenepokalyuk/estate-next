import React, { FC } from 'react';
import clsx from 'clsx';

import { Section } from '@/components/ui';
import { VideoBlock as VideoBlockModel } from '@/services/Api';
import { toVideoEmbedUrl } from '@/utils/helpers';

import classes from './VideoBlock.module.scss';

interface Props {
  block: VideoBlockModel;
}

/** Видео во всю ширину: наш файл в `<video>` или чужой плеер в `<iframe>`.
 *
 *  Какой из двух — решил бэкенд, здесь только `is_file`. Компонент
 *  серверный: ни состояния, ни эффектов ему не нужно, воспроизведением
 *  занимается сам браузер.
 *
 *  Файл не грузим заранее (`preload="metadata"`): облёт с дрона весит
 *  больше сотни мегабайт, и качать его посетителю, который до блока
 *  не долистал, — значит потратить его трафик впустую. Исключение —
 *  автозапуск: там видео начинает играть сразу, ждать нечего.
 */
export const VideoBlock: FC<Props> = ({ block }) => {
  if (!block.video) return null;

  return (
    <Section id={block.anchor} title={block.title} bleed>
      <div className={clsx(classes.frame, classes[block.height])}>
        {block.is_file ? (
          // Субтитров у роликов нет и не будет: это облёты с дрона и
          // проходы по объекту — картинка без речи, расшифровывать нечего.
          // Появится ролик с закадровым текстом — под него понадобится
          // поле для файла субтитров в админке, тогда и снимем правило.
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video
            className={classes.video}
            src={block.video}
            poster={block.poster ?? undefined}
            controls
            playsInline
            preload={block.autoplay ? 'auto' : 'metadata'}
            autoPlay={block.autoplay}
            // Автозапуск со звуком браузеры блокируют, и видео просто
            // не тронется с места. Зацикливаем заодно: фоновый ролик,
            // замирающий на последнем кадре, выглядит как ошибка.
            muted={block.autoplay}
            loop={block.autoplay}
          />
        ) : (
          <iframe
            className={classes.video}
            src={toVideoEmbedUrl(block.video)}
            title={block.title || block.caption || 'Видео объекта'}
            // Развернуть плеер на весь экран посетитель ждёт от любого видео.
            allowFullScreen
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            loading="lazy"
          />
        )}
      </div>

      {block.caption && <p className={classes.caption}>{block.caption}</p>}
    </Section>
  );
};
