'use client';

import React, { FC } from 'react';
import { z } from 'zod';

import { Button, ConsentNotice, Modal } from '@/components/ui';
import { Goals, reachGoal } from '@/lib/analytics';
import {
  leadActions,
  selectIsLeadModalOpen,
  selectIsLeadSending,
  selectIsLeadSent,
  selectLeadError,
  useAppDispatch,
  useAppSelector,
} from '@/services/Store';
import { formatRuPhone, isCompleteRuPhone } from '@/utils/helpers';

import classes from './LeadModal.module.scss';

const schema = z.object({
  name: z.string().trim().min(2, 'Как к вам обращаться?'),
  phone: z.string().refine(isCompleteRuPhone, 'Введите номер телефона полностью'),
  // Почта необязательна, но если её начали вводить — проверим.
  email: z.union([z.literal(''), z.email('Проверьте адрес почты')]),
  comment: z.string().trim().optional(),
});

type Values = z.infer<typeof schema>;

const EMPTY: Values = { name: '', phone: '', email: '', comment: '' };

/** Сколько ждать перед сбросом формы: столько же длится анимация ухода
 *  окна. Сбросить раньше — поля мелькнут пустыми по дороге. */
const RESET_DELAY_MS = 200;

const SUBMIT_LABEL = 'Отправить';

interface Props {
  /** Со страницы какого объекта уйдёт заявка. На главной — undefined. */
  estateSlug?: string;
  /** Название объекта в подзаголовке окна: человеку видно, о чём заявка. */
  estateName?: string;
}

/** Окно с формой заявки: имя, телефон, почта, комментарий.
 *
 *  Открытие, отправка и результат живут в сторе (слайс `lead`): окно одно,
 *  а открывают его кнопка в углу экрана, кнопка в шапке и кнопка в блоке
 *  контактов. Значения полей — локальный стейт: черновик, который никому,
 *  кроме этой формы, не нужен.
 */
export const LeadModal: FC<Props> = ({ estateSlug, estateName }) => {
  const dispatch = useAppDispatch();

  const open = useAppSelector(selectIsLeadModalOpen);
  const submitting = useAppSelector(selectIsLeadSending);
  const done = useAppSelector(selectIsLeadSent);
  const formError = useAppSelector(selectLeadError);

  const [values, setValues] = React.useState<Values>(EMPTY);
  const [errors, setErrors] = React.useState<Partial<Record<keyof Values, string>>>({});
  // «Начали заполнять» — один раз на открытие окна: разница с отправкой
  // показывает брошенные формы.
  const startTracked = React.useRef(false);

  const close = () => {
    dispatch(leadActions.closeLeadModal());

    setTimeout(() => {
      dispatch(leadActions.resetLead());
      setValues(EMPTY);
      setErrors({});
      startTracked.current = false;
    }, RESET_DELAY_MS);
  };

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    if (!startTracked.current) {
      startTracked.current = true;
      reachGoal(Goals.LeadFormStart);
    }
    setValues((current) => ({ ...current, [key]: value }));
    // Ошибку поля снимаем на первом же исправлении, а не при отправке:
    // иначе человек правит телефон, а красное остаётся.
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof Values, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof Values;
        if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    dispatch(
      leadActions.sendLead({
        name: parsed.data.name,
        phone: parsed.data.phone,
        email: parsed.data.email,
        comment: parsed.data.comment,
        estate_slug: estateSlug,
        page_url: window.location.href,
      }),
    );
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title={done ? 'Заявка отправлена' : 'Оставить заявку'}
      description={
        done
          ? undefined
          : estateName
            ? `Ответим на вопросы по объекту «${estateName}» и договоримся о показе.`
            : 'Ответим на вопросы и подберём объект под задачу.'
      }
    >
      {done ? (
        <div className={classes.success} role="status">
          <p className={classes.successText}>
            Спасибо! Мы свяжемся с вами в ближайшее рабочее время.
          </p>
          <Button variant="outlined" fullWidth onClick={close}>
            Закрыть
          </Button>
        </div>
      ) : (
        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          <label className={classes.field}>
            <span className={classes.label}>Имя</span>
            <input
              className={classes.input}
              value={values.name}
              onChange={(event) => set('name', event.target.value)}
              placeholder="Как к вам обращаться"
              autoComplete="name"
            />
            {errors.name && <span className={classes.error}>{errors.name}</span>}
          </label>

          <label className={classes.field}>
            <span className={classes.label}>Номер телефона</span>
            <input
              className={classes.input}
              value={values.phone}
              onChange={(event) => set('phone', formatRuPhone(event.target.value))}
              placeholder="+7 (___) ___-__-__"
              inputMode="tel"
              autoComplete="tel"
            />
            {errors.phone && (
              <span className={classes.error}>{errors.phone}</span>
            )}
          </label>

          <label className={classes.field}>
            <span className={classes.label}>
              Почта
              <span className={classes.optional}> — необязательно</span>
            </span>
            <input
              className={classes.input}
              value={values.email}
              onChange={(event) => set('email', event.target.value)}
              placeholder="name@example.com"
              inputMode="email"
              autoComplete="email"
            />
            {errors.email && (
              <span className={classes.error}>{errors.email}</span>
            )}
          </label>

          <label className={classes.field}>
            <span className={classes.label}>
              Комментарий
              <span className={classes.optional}> — необязательно</span>
            </span>
            <textarea
              className={classes.textarea}
              value={values.comment}
              onChange={(event) => set('comment', event.target.value)}
              rows={3}
              placeholder="Что вас интересует"
            />
          </label>

          {formError && (
            <p className={classes.formError} role="alert">
              {formError}
            </p>
          )}

          <Button type="submit" fullWidth disabled={submitting}>
            {submitting ? 'Отправляем…' : SUBMIT_LABEL}
          </Button>

          <ConsentNotice action={SUBMIT_LABEL} />
        </form>
      )}
    </Modal>
  );
};
