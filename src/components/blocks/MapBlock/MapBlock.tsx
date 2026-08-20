'use client';

import React, {FC} from 'react';

import {MapServiceIcon, Modal, PinIcon} from '@/components/ui';
import {Goals, reachGoal} from '@/lib/analytics';
import {MapBlock as MapBlockModel, PinColor, RouteService} from '@/services/Api';
import {selectEstate, useAppSelector} from '@/services/Store';
import {formatPriceWithNote, keepOrdinalsWhole} from '@/utils/helpers';

import classes from './MapBlock.module.scss';

interface Props {
    block:MapBlockModel;
}

/** Подпись библиотеки в углу карты.
 *
 *  Leaflet с версии 1.8 подмешивает в свою подпись флаг Украины (зашит
 *  inline-svg в исходниках). Сайту это ни к чему — задаём подпись сами.
 *  Лицензия Leaflet (BSD-2) показывать ссылку не требует, поэтому оставляем
 *  её просто из вежливости; убрать совсем — заменить строку на пустую.
 *
 *  Указание на OpenStreetMap, наоборот, обязательно: этого требуют условия
 *  использования их тайлов. Оно задаётся отдельно, на слое тайлов. */
const LEAFLET_CREDIT =
    '<a href="https://leafletjs.com" title="Библиотека интерактивных карт">Leaflet</a>';

/** Фирменные цвета картографических служб — для значка на кнопке
 *  «Как доехать». Здесь, а не в стилях: значок рисуется inline-svg,
 *  и цвет ему передаётся свойством, а не классом. */
const SERVICE_COLORS:Record<RouteService, string> = {
    [RouteService.TwoGis]: '#19aa1e',
    [RouteService.Yandex]: '#fc3f1d',
    [RouteService.Google]: '#4285f4',
};

/** Класс метки под цвет, выбранный в админке. */
const PIN_CLASSES:Record<PinColor, string> = {
    [PinColor.Brand]: classes.pinBrand,
    [PinColor.Red]: classes.pinRed,
    [PinColor.Green]: classes.pinGreen,
    [PinColor.Blue]: classes.pinBlue,
    [PinColor.Dark]: classes.pinDark,
};

/** Экранирование текста из админки перед вставкой в HTML метки.
 *
 *  Метку Leaflet принимает строкой HTML, а не готовым узлом, поэтому
 *  реактовской защиты здесь нет: подпись вроде `Вход <главный>` без
 *  экранирования сломала бы разметку, а строка со скриптом — и того хуже. */
function escapeHtml(value:string):string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/** Карта во всю ширину с меткой объекта.
 *
 *  Leaflet поверх тайлов OpenStreetMap: ключ не нужен вообще и платить не
 *  за что. Яндекс.Карты и Google требуют ключ, а у бесплатных тарифов есть
 *  суточные лимиты — при их исчерпании карта на странице объекта просто
 *  гаснет, что для продающей страницы неприемлемо.
 *
 *  По метке открывается окно с выжимкой по объекту и кнопками «Как
 *  доехать» — там уже настоящие Яндекс, 2ГИС и Google, но по ссылке,
 *  без ключей и лимитов.
 *
 *  Библиотеку грузим по требованию (`import()` внутри эффекта): весит она
 *  заметно, карта есть не на каждой странице, и в серверный рендер Leaflet
 *  тащить нельзя — он обращается к `window` прямо при импорте.
 *
 *  Не поднялась — остаются адрес и те же кнопки маршрутов, страница
 *  не ломается.
 */
export const MapBlock:FC<Props> = ({ block }) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [failed, setFailed] = React.useState(false);
    const [detailsOpen, setDetailsOpen] = React.useState(false);
    const estate = useAppSelector(selectEstate);

    const openDetails = React.useCallback(() => {
        reachGoal(Goals.MapPinOpen, { block: block.anchor });
        setDetailsOpen(true);
    }, [block.anchor]);

    React.useEffect(() => {
        let cancelled = false;
        // Карту нужно убрать за собой: без remove() при переходе между
        // объектами в памяти копятся экземпляры вместе со слушателями.
        let map:{ remove:() => void }|null = null;

        Promise.all([import('leaflet'), import('leaflet/dist/leaflet.css')])
            .then(([leaflet]) => {
                const L = leaflet.default;
                if (cancelled || !containerRef.current) return;

                const instance = L.map(containerRef.current, {
                    center: [block.latitude, block.longitude],
                    zoom: block.zoom,
                    // Колесо мыши оставляем странице: иначе карта перехватывает
                    // прокрутку, и посетитель залипает на ней посреди страницы.
                    scrollWheelZoom: false,
                    // Свою подпись добавляем ниже — со сдвигом влево и без флага.
                    attributionControl: false,
                });
                map = instance;

                // Подпись — слева внизу, а не справа, как по умолчанию: справа висит
                // плавающая кнопка заявки и накрывает её. Указание на OpenStreetMap
                // обязательно по условиям использования тайлов, значит, оно должно
                // быть видно, а не прятаться под кнопкой.
                L.control
                    .attribution({ position: 'bottomleft', prefix: LEAFLET_CREDIT })
                    .addTo(instance);

                L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    // Указание источника обязательно по условиям использования OSM.
                    attribution: '© Участники OpenStreetMap',
                }).addTo(instance);

                // Метку рисуем своим элементом: у стандартной иконки Leaflet
                // отдельные картинки, которые в сборке Next пришлось бы
                // раскладывать руками. Заодно она получает цвет, подпись и
                // пульсацию из админки — у стандартной иконки этого нет.
                const pinClass = PIN_CLASSES[block.pin_color] ?? classes.pinBrand;
                const pulse = block.pin_pulse
                    ? `<span class="${classes.pinPulse}"></span>`
                    : '';
                const label = block.pin_label
                    ? `<span class="${classes.pinLabel}">${escapeHtml(block.pin_label)}</span>`
                    : '';

                const icon = L.divIcon({
                    className: '',
                    html:
                        `<span class="${classes.pin} ${pinClass}">${pulse}` +
                        `<svg class="${classes.pinShape}" viewBox="0 0 28 38" aria-hidden="true">` +
                        '<path d="M14 .9C6.8.9 1 6.7 1 13.9c0 9.4 11.6 22 12.1 22.5a1.2 1.2 0 0 0 1.8 0C15.4 35.9 27 23.3 27 13.9 27 6.7 21.2.9 14 .9z"/>' +
                        '<circle cx="14" cy="13.9" r="4.8"/>' +
                        `</svg>${label}</span>`,
                    // Якорь — в остриё метки, снизу по центру: иначе она указывает
                    // не туда, куда нарисована.
                    iconSize: [28, 38],
                    iconAnchor: [14, 38],
                });

                L.marker([block.latitude, block.longitude], {
                    icon,
                    title: block.marker_title,
                    alt: block.marker_title,
                    // Метка здесь — кнопка, а не украшение: поднимаем её над
                    // соседними при наведении и оставляем доступной с клавиатуры.
                    riseOnHover: true,
                    keyboard: true,
                })
                    .addTo(instance)
                    // Штатный попап Leaflet не годится: в окно нужны выжимка по
                    // объекту и кнопки, а попап принимает только строку HTML —
                    // ни компонент, ни обработчик туда не передать.
                    .on('click', openDetails)
                    .on('keypress', openDetails);
            })
            .catch(() => {
                // Сеть не пустила или тайлы недоступны — показываем запасной вид.
                if (!cancelled) setFailed(true);
            });

        return () => {
            cancelled = true;
            map?.remove();
        };
    }, [
        block.latitude,
        block.longitude,
        block.zoom,
        block.marker_title,
        block.pin_color,
        block.pin_label,
        block.pin_pulse,
        openDetails,
    ]);

    const externalUrl = `https://www.openstreetmap.org/?mlat=${block.latitude}&mlon=${block.longitude}#map=${block.zoom}/${block.latitude}/${block.longitude}`;

    /** Кнопки «Как доехать». Бэкенд прислал только заполненные службы,
     *  поэтому пустого блока здесь быть не может. */
    const routes = block.routes.length > 0 && (
        <div className={classes.routes}>
            <p className={classes.routesTitle}>
                Как доехать
            </p>
            <ul className={classes.routesList}>
                {block.routes.map((route) => (
                    <li key={route.service}>
                        <a
                            className={classes.route}
                            href={route.url}
                            // Уводить со страницы объекта нельзя: человек пошёл смотреть
                            // дорогу и должен вернуться к ней же, а не жать «назад».
                            target="_blank"
                            // noreferrer вместе с noopener: без него чужая вкладка
                            // получает доступ к нашей через window.opener.
                            rel="noreferrer"
                            onClick={() =>
                                reachGoal(Goals.MapOpen, {
                                    block: block.anchor,
                                    service: route.service,
                                })
                            }
                        >
                            <MapServiceIcon color={SERVICE_COLORS[route.service]}/>
                            <span className={classes.routeTitle}>{route.title}</span>
                            <span className={classes.routeHint}>в новой вкладке</span>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );

    const externalLink = (
        <a
            className={classes.fallbackLink}
            href={externalUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => reachGoal(Goals.MapOpen, { block: block.anchor })}
        >
            Открыть на карте
        </a>
    );

    /** Выжимка по объекту: то же, что на карточке в каталоге. Дублируется
     *  намеренно — окно метки открывают, докрутив до карты, и возвращаться
     *  наверх за площадью и ценой посетитель не станет. */
    const facts: { label:string; value:string }[] = [
        { label: 'Адрес', value: block.address },
        { label: 'Тип', value: estate?.kind_display },
        { label: 'Статус', value: estate?.status_display },
        { label: 'Площадь', value: estate?.area },
        {
            label: 'Цена',
            value: estate ? formatPriceWithNote(estate.price, estate.price_note) : undefined,
        },
    ]
        // Предикат, а не просто Boolean: без него TypeScript оставляет
        // value как string | undefined и после фильтра.
        .filter((fact):fact is { label:string; value:string } => Boolean(fact.value))
        .map((fact) => ({ ...fact, value: keepOrdinalsWhole(fact.value) }));

    return (
        <section id={block.anchor} className={classes.block}>
            {(block.title || block.address || block.note) && (
                <div className={classes.header}>
                    {block.title && <h2 className={classes.title}>{block.title}</h2>}
                    {block.address && (
                        <p className={classes.address}>
                            <PinIcon className={classes.addressIcon}/>
                            {keepOrdinalsWhole(block.address)}
                        </p>
                    )}
                    {block.note && <p className={classes.note}>{block.note}</p>}
                </div>
            )}

            {failed ? (
                <div
                    className={classes.fallback}
                    style={{ minHeight: `${block.height / 2}px` }}
                >
                    <PinIcon className={classes.fallbackIcon}/>
                    <p className={classes.fallbackTitle}>{keepOrdinalsWhole(block.marker_title)}</p>
                    {block.address && (
                        <p className={classes.fallbackAddress}>
                            {keepOrdinalsWhole(block.address)}
                        </p>
                    )}
                    {routes || externalLink}
                </div>
            ) : (
                <div
                    ref={containerRef}
                    className={classes.map}
                    style={{ height: `${block.height}px` }}
                    aria-label={`Карта: ${block.marker_title}`}
                />
            )}

            <Modal
                open={detailsOpen}
                onClose={() => setDetailsOpen(false)}
                title={keepOrdinalsWhole(block.marker_title)}
                description={estate?.short_description}
            >
                {facts.length > 0 && (
                    <dl className={classes.facts}>
                        {facts.map((fact) => (
                            <div key={fact.label} className={classes.fact}>
                                <dt className={classes.factLabel}>{fact.label}</dt>
                                <dd className={classes.factValue}>{fact.value}</dd>
                            </div>
                        ))}
                    </dl>
                )}

                {block.note && <p className={classes.modalNote}>{block.note}</p>}

                {routes || externalLink}
            </Modal>
        </section>
    );
};
