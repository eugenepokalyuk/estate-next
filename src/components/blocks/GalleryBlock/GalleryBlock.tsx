'use client';

import React, { FC } from 'react';
import Image from 'next/image';

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Lightbox,
  LightboxItem,
  Section,
} from '@/components/ui';
import { Goals, reachGoal } from '@/lib/analytics';
import {
  GalleryBlock as GalleryBlockModel,
  GalleryDisplay,
  GallerySlide,
} from '@/services/Api';
import { smoothScrollTo } from '@/utils/helpers';

import classes from './GalleryBlock.module.scss';

interface Props {
  block: GalleryBlockModel;
}

/** Слайд с гарантированно непустой картинкой: пустые отфильтрованы выше,
 *  и незачем тащить проверку на null во все дочерние компоненты. */
type Slide = GallerySlide & { image: string };

/** Галерея: слайдер или сетка — как выбрано в админке.
 *
 *  По клику картинка открывается во весь экран, оттуда же листается вся
 *  галерея (см. `Lightbox`). Состояние просмотра локальное: открыть его
 *  может только сама галерея, выносить его в стор незачем.
 */
export const GalleryBlock: FC<Props> = ({ block }) => {
  const slides = block.slides.filter((slide): slide is Slide =>
    Boolean(slide.image),
  );
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  if (slides.length === 0) return null;

  const openLightbox = (index: number) => {
    reachGoal(Goals.GalleryOpen, { block: block.anchor });
    setOpenIndex(index);
  };

  const items: LightboxItem[] = slides.map((slide) => ({
    id: slide.id,
    image: slide.image,
    caption: slide.caption || undefined,
  }));

  return (
    <>
      <Section
        id={block.anchor}
        title={block.title}
        intro={block.intro}
        // Лента прокрутки — во всю ширину окна; слайды выравниваются по
        // контейнеру отступами самой ленты (см. --slider-inset).
        bleed={block.display === GalleryDisplay.Slider}
      >
        {block.display === GalleryDisplay.Grid ? (
          <ul className={classes.grid}>
            {slides.map((slide, index) => (
              <li key={slide.id}>
                <SlideButton slide={slide} onOpen={() => openLightbox(index)}>
                  <Image
                    src={slide.image}
                    alt={slide.caption}
                    width={800}
                    height={600}
                    className={classes.gridImage}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </SlideButton>
                {slide.caption && (
                  <p className={classes.caption}>{slide.caption}</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <Slider slides={slides} onOpen={openLightbox} />
        )}
      </Section>

      <Lightbox
        items={items}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onChange={setOpenIndex}
      />
    </>
  );
};

const SlideButton: FC<{
  slide: Slide;
  onOpen: () => void;
  children: React.ReactNode;
}> = ({ slide, onOpen, children }) => (
  <button
    type="button"
    className={classes.slideButton}
    onClick={onOpen}
    aria-label={
      slide.caption ? `Открыть: ${slide.caption}` : 'Открыть изображение'
    }
  >
    {children}
  </button>
);

/** Лента фотографий на нативной прокрутке со scroll-snap.
 *
 *  Своя прокрутка, а не карусельная библиотека: лента идёт во всю ширину
 *  окна, а слайды должны вставать по границам контейнера страницы. У
 *  библиотеки ширина слайда считалась от ВНУТРЕННЕЙ ширины ленты, то есть
 *  за вычетом боковых отступов, и от этого ломался её расчёт прокрутки —
 *  кнопка «вперёд» гасла раньше, чем последний слайд доезжал до экрана.
 *
 *  Нативная прокрутка про отступы знает сама: `padding-inline` даёт поля
 *  слева и справа, `scroll-padding-inline` притягивает слайды к границам
 *  контейнера. Плюс бесплатно работают свайп на телефоне, трекпад,
 *  клавиатура и полоса прокрутки.
 */
const Slider: FC<{ slides: Slide[]; onOpen: (index: number) => void }> = ({
  slides,
  onOpen,
}) => {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);
  // Цель «листали галерею» шлём один раз за визит на блок: важно, что
  // листали вообще, а не сколько раз дёрнули ленту.
  const swipeTracked = React.useRef(false);

  const syncArrows = React.useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    // Запас в пиксель: браузеры округляют scrollLeft, и без него кнопка
    // «вперёд» остаётся активной на самом конце ленты.
    const maxScroll = track.scrollWidth - track.clientWidth - 1;
    setCanScrollPrev(track.scrollLeft > 1);
    setCanScrollNext(track.scrollLeft < maxScroll);
  }, []);

  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    syncArrows();

    const handleScroll = () => {
      syncArrows();
      if (!swipeTracked.current) {
        swipeTracked.current = true;
        reachGoal(Goals.GallerySwipe);
      }
    };

    track.addEventListener('scroll', handleScroll, { passive: true });
    // Ширина слайда зависит от ширины окна — на повороте телефона и при
    // изменении размера состояние кнопок нужно пересчитать.
    window.addEventListener('resize', syncArrows);

    return () => {
      track.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', syncArrows);
    };
  }, [syncArrows]);

  /** Листает на один слайд. Шаг берём с самого слайда, а не из констант:
   *  ширина задана в CSS и меняется на брейкпоинтах. */
  const scrollBySlide = (direction: 1 | -1) => {
    const track = trackRef.current;
    const slide = track?.firstElementChild as HTMLElement | null;
    if (!track || !slide) return;

    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const step = slide.getBoundingClientRect().width + gap;

    // scroll-snap-type: mandatory возвращает ленту к ближайшей точке
    // прилипания на каждом кадре и гасит нашу анимацию — на время
    // прокрутки прилипание выключаем. Для свайпа пальцем оно остаётся.
    track.style.scrollSnapType = 'none';

    smoothScrollTo(track.scrollLeft + step * direction, {
      element: track,
      axis: 'x',
      onDone: () => {
        track.style.scrollSnapType = '';
        // Состояние кнопок обновляем сами, а не ждём события прокрутки:
        // событие приходит с задержкой, а в фоновой вкладке браузер его
        // и вовсе не шлёт — кнопки залипали бы в прежнем состоянии.
        syncArrows();
      },
    });
  };

  return (
    <div className={classes.slider}>
      <div className={classes.track} ref={trackRef}>
        {slides.map((slide, index) => (
          <div key={slide.id} className={classes.slide}>
            <SlideButton slide={slide} onOpen={() => onOpen(index)}>
              <Image
                src={slide.image}
                alt={slide.caption}
                width={1200}
                height={800}
                className={classes.slideImage}
                sizes="(max-width: 768px) 92vw, 46vw"
                // Первый слайд виден сразу — остальные подождут прокрутки.
                priority={index === 0}
              />
            </SlideButton>
            {slide.caption && (
              <p className={classes.caption}>{slide.caption}</p>
            )}
          </div>
        ))}
      </div>

      <div className={classes.controls}>
        <button
          type="button"
          className={classes.arrow}
          aria-label="Предыдущий слайд"
          disabled={!canScrollPrev}
          onClick={() => scrollBySlide(-1)}
        >
          <ArrowLeftIcon />
        </button>
        <button
          type="button"
          className={classes.arrow}
          aria-label="Следующий слайд"
          disabled={!canScrollNext}
          onClick={() => scrollBySlide(1)}
        >
          <ArrowRightIcon />
        </button>
      </div>
    </div>
  );
};
