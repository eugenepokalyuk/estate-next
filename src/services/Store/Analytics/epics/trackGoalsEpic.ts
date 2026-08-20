import { Epic } from 'redux-observable';
import { EMPTY } from 'rxjs';
import { filter, mergeMap, tap } from 'rxjs/operators';

import { Goals, reachGoal } from '@/lib/analytics';

import { leadActions } from '../../Lead/slice';
import { RootActions, RootStore } from '../../store';

/** Цели, которые следуют из жизненного цикла заявки.
 *
 *  Держим таблицей, а не вызовами по месту: окно заявки открывают три
 *  разные кнопки, и в каждой пришлось бы помнить про цель, а результат
 *  отправки вообще известен только эпику.
 *
 *  Первый элемент — проверка действия, второй — цель, третий собирает
 *  параметры (нужен только там, где есть что развернуть в отчёте). */
const GOALS: Array<
  [(action: RootActions) => boolean, string, ((action: never) => Record<string, unknown>)?]
> = [
  [leadActions.openLeadModal.match, Goals.LeadFormOpen],
  [leadActions.sendLeadSuccess.match, Goals.LeadSent],
  [
    leadActions.sendLeadFailure.match,
    Goals.LeadError,
    (action: ReturnType<typeof leadActions.sendLeadFailure>) => ({
      reason: action.payload,
    }),
  ],
];

/** Отправляет цели Метрики по действиям стора.
 *
 *  Побочный эффект живёт здесь, а не в редьюсерах: редьюсер обязан быть
 *  чистым, его повторно прогоняет devtools при перемотке — цели ушли бы
 *  по второму разу. Эпик ничего не диспатчит в ответ (EMPTY): это
 *  конечная точка, а не звено цепочки.
 */
export const trackGoalsEpic: Epic<RootActions, RootActions, RootStore> = (
  action$,
) =>
  action$.pipe(
    filter((action) => GOALS.some(([matches]) => matches(action))),
    tap((action) => {
      const found = GOALS.find(([matches]) => matches(action));
      if (!found) return;

      const [, goal, getParams] = found;
      reachGoal(goal, getParams?.(action as never));
    }),
    mergeMap(() => EMPTY),
  );
