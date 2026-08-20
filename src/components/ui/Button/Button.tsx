import React, { ButtonHTMLAttributes, FC } from 'react';
import clsx from 'clsx';

import classes from './Button.module.scss';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'outlined' | 'ghost';
  color?: 'primary' | 'accent' | 'contrast';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: FC<Props> = ({
  variant = 'filled',
  color = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  type = 'button',
  children,
  ...rest
}) => (
  <button
    type={type}
    className={clsx(
      classes.button,
      classes[variant],
      classes[color],
      classes[size],
      fullWidth && classes.fullWidth,
      className,
    )}
    {...rest}
  >
    {children}
  </button>
);
