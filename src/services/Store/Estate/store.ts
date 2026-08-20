import { Estate, EstateDetail } from '@/services/Api';

/** Каталог объектов на главной. */
export interface IEstateListState {
  items: Estate[];
  isLoading: boolean;
  error?: string;
}

export const initialEstateListState: IEstateListState = {
  items: [],
  isLoading: false,
};

/** Открытая страница объекта. */
export interface IEstateState {
  data?: EstateDetail;
  isLoading: boolean;
  error?: string;
}

export const initialEstateState: IEstateState = {
  isLoading: false,
};
