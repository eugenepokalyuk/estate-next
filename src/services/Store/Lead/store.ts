/** Заявка из окна «Оставить заявку». */
export interface ILeadState {
  /** Открыто ли окно. Окно одно на страницу, открыть его могут кнопка в
   *  углу экрана, кнопка в шапке и кнопка в блоке контактов — поэтому
   *  состояние общее, а не своё у каждой кнопки. */
  isModalOpen: boolean;
  isLoading: boolean;
  /** Заявка ушла — вместо формы показываем «спасибо». */
  isSent: boolean;
  error?: string;
}

export const initialLeadState: ILeadState = {
  isModalOpen: false,
  isLoading: false,
  isSent: false,
};
