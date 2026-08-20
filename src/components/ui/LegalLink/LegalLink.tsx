import React, { FC } from 'react';
import Link from 'next/link';

interface Props {
  /** Наш путь (`/privacy`), внешняя ссылка (`https://…`) или ссылка на
   *  загруженный в админке файл. */
  href: string;
  title: string;
  className?: string;
  onClick?: () => void;
}

/** Ссылка на правовой документ.
 *
 *  Документ может быть нашей страницей, чужой страницей или файлом — в
 *  админке это одно поле. Разбираем здесь: свой путь открываем в той же
 *  вкладке через next/link (переход без перезагрузки), чужой адрес и файл —
 *  в новой, чтобы не уводить посетителя со страницы объекта.
 */
export const LegalLink: FC<Props> = ({ href, title, className, onClick }) => {
  const isInternal = href.startsWith('/') && !href.startsWith('//');

  if (isInternal) {
    return (
      <Link href={href} className={className} onClick={onClick}>
        {title}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noreferrer"
      onClick={onClick}
    >
      {title}
    </a>
  );
};
