import { apiRequest, HttpMethod } from '../../request';

/** Тип объекта. Значения — те же строки, что отдаёт Django
 *  (`Estate.Kind` в estates/models.py): списки должны совпадать. */
export enum EstateKind {
  Building = 'building',
  House = 'house',
  Land = 'land',
  Apartment = 'apartment',
  Office = 'office',
  Retail = 'retail',
  Warehouse = 'warehouse',
  Other = 'other',
}

/** Статус объекта, `Estate.Status` на бэкенде. */
export enum EstateStatus {
  Selling = 'selling',
  Building = 'building',
  Done = 'done',
  Reserved = 'reserved',
  Sold = 'sold',
}

/** Карточка объекта в каталоге.
 *
 *  Поля в snake_case — это чужой контракт, переименовывать его на нашей
 *  стороне не будем: при расхождении потом не найти концов.
 */
export interface Estate {
  id: number;
  name: string;
  slug: string;
  kind: EstateKind;
  /** Тип по-русски, готовый к показу: «Земельный участок». Приходит с
   *  бэкенда, чтобы словарь переводов не жил в двух местах. */
  kind_display: string;
  status: EstateStatus;
  status_display: string;
  short_description: string;
  /** Абсолютная ссылка. null — обложку не загрузили. */
  cover: string | null;
  city: string;
  address: string;
  /** null — цену не задали, показываем «Цена по запросу». */
  price: number | null;
  price_note: string;
  area: string;
}

type Result = Estate[];

/** Каталог объектов для главной. */
export function getEstateListApi(): Promise<Result> {
  return apiRequest({
    method: HttpMethod.Get,
    url: 'objects/',
  });
}
