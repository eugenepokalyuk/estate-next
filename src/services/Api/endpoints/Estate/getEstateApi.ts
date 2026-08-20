import { Estate } from './getEstateListApi';
import { apiRequest, HttpMethod } from '../../request';

/** Тип блока страницы. Значения — атрибут `TYPE` у моделей блоков на
 *  бэкенде (blocks/models.py). По нему `BlockRenderer` выбирает компонент. */
export enum BlockType {
  Image = 'image',
  Video = 'video',
  Text = 'text',
  List = 'list',
  Gallery = 'gallery',
  Faq = 'faq',
  Map = 'map',
  Contacts = 'contacts',
}

/** Высота блока с картинкой, `ImageBlock.Height` на бэкенде. */
export enum ImageBlockHeight {
  Auto = 'auto',
  Screen = 'screen',
  Tall = 'tall',
  Short = 'short',
}

/** Высота блока с видео, `VideoBlock.Height` на бэкенде.
 *
 *  Похоже на `ImageBlockHeight`, но не совпадает: у картинки есть `auto`
 *  по размеру файла, а у видео размер кадра до загрузки метаданных
 *  неизвестен — вместо него обычные пропорции съёмки. */
export enum VideoBlockHeight {
  Wide = 'wide',
  Screen = 'screen',
  Tall = 'tall',
  Short = 'short',
}

/** Вёрстка текстового блока, `TextBlock.Layout`. */
export enum TextBlockLayout {
  Narrow = 'narrow',
  Wide = 'wide',
  Columns = 'columns',
}

/** Вид галереи, `GalleryBlock.Display`. */
export enum GalleryDisplay {
  Slider = 'slider',
  Grid = 'grid',
}

/** Вид списка, `ListBlock.Display`. */
export enum ListDisplay {
  Cards = 'cards',
  Rows = 'rows',
  Numbered = 'numbered',
}

export interface MenuItem {
  title: string;
  /** Якорь блока: ссылка в шапке ведёт на `#<anchor>`. */
  anchor: string;
}

/** Общая часть любого блока. */
interface BaseBlock {
  id: number;
  order: number;
  anchor: string;
  title: string;
  menu_title: string;
}

export interface ImageBlock extends BaseBlock {
  type: BlockType.Image;
  image: string | null;
  alt: string;
  caption: string;
  height: ImageBlockHeight;
  overlay_text: string;
}

export interface VideoBlock extends BaseBlock {
  type: BlockType.Video;
  /** Что играть: ссылка на наш `/media/`, если ролик залит файлом, иначе
   *  адрес на видеохостинге. null — блок пустой, рисовать нечего. */
  video: string | null;
  /** true — `video` ведёт на наш файл, его можно отдать в `<video>`.
   *  false — чужой хостинг, нужен его плеер в `<iframe>`. */
  is_file: boolean;
  poster: string | null;
  caption: string;
  /** Бэкенд уже погасил флаг для роликов с чужого хостинга. */
  autoplay: boolean;
  height: VideoBlockHeight;
}

export interface TextItem {
  id: number;
  title: string;
  text: string;
}

export interface TextBlock extends BaseBlock {
  type: BlockType.Text;
  subtitle: string;
  text: string;
  layout: TextBlockLayout;
  items: TextItem[];
}

export interface FaqEntry {
  id: number;
  question: string;
  answer: string;
}

export interface FaqBlock extends BaseBlock {
  type: BlockType.Faq;
  intro: string;
  entries: FaqEntry[];
}

/** Цвет метки на карте, `MapBlock.PinColor`. Конкретные значения цветов
 *  живут в стилях блока — бэкенд задаёт только выбор. */
export enum PinColor {
  Brand = 'brand',
  Red = 'red',
  Green = 'green',
  Blue = 'blue',
  Dark = 'dark',
}

/** Картографическая служба для кнопки «Как доехать». */
export enum RouteService {
  TwoGis = '2gis',
  Yandex = 'yandex',
  Google = 'google',
}

/** Одна кнопка «Как доехать». Бэкенд присылает только заполненные
 *  и уже в нужном порядке — фильтровать и сортировать здесь нечего. */
export interface MapRoute {
  service: RouteService;
  title: string;
  url: string;
}

export interface MapBlock extends BaseBlock {
  type: BlockType.Map;
  latitude: number;
  longitude: number;
  zoom: number;
  marker_title: string;
  address: string;
  note: string;
  pin_color: PinColor;
  pin_label: string;
  pin_pulse: boolean;
  routes: MapRoute[];
  height: number;
}

export interface GallerySlide {
  id: number;
  image: string | null;
  caption: string;
}

export interface GalleryBlock extends BaseBlock {
  type: BlockType.Gallery;
  intro: string;
  display: GalleryDisplay;
  slides: GallerySlide[];
}

export interface ListEntry {
  id: number;
  title: string;
  value: string;
  text: string;
}

export interface ListBlock extends BaseBlock {
  type: BlockType.List;
  intro: string;
  display: ListDisplay;
  entries: ListEntry[];
}

export interface ContactsBlock extends BaseBlock {
  type: BlockType.Contacts;
  intro: string;
  manager_name: string;
  phone: string;
  email: string;
  address: string;
  working_hours: string;
  show_form_button: boolean;
}

/** Любой блок страницы. Размеченное объединение по `type`: добавили тип
 *  на бэкенде — TypeScript сам потребует ветку в `BlockRenderer`. */
export type Block =
  | ImageBlock
  | VideoBlock
  | TextBlock
  | FaqBlock
  | MapBlock
  | GalleryBlock
  | ListBlock
  | ContactsBlock;

/** Страница объекта целиком: шапка, блоки и метаданные. */
export interface EstateDetail extends Estate {
  /** Логотип для шапки. null — покажем название текстом. */
  logo: string | null;
  menu: MenuItem[];
  blocks: Block[];
  meta_title: string;
  meta_description: string;
}

interface Params {
  slug: string;
}

/** Страница объекта по адресу из админки.
 *
 *  Всё одним ответом осознанно: страница не рисуется без любой из частей,
 *  а каждый лишний поход в API — задержка ответа посетителю.
 */
export function getEstateApi({ slug }: Params): Promise<EstateDetail> {
  return apiRequest({
    method: HttpMethod.Get,
    url: `objects/${encodeURIComponent(slug)}/`,
  });
}
