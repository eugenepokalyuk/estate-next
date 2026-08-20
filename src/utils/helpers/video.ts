/** Ссылка на видео → адрес плеера, который можно вставить в `<iframe>`.
 *
 *  Менеджер копирует ссылку из адресной строки, а она у всех хостингов
 *  ведёт на страницу с шапкой, комментариями и рекомендациями — в iframe
 *  такая страница либо не откроется вовсе (X-Frame-Options), либо покажет
 *  сайт целиком вместо ролика. Просить вставлять «код для встраивания»
 *  бессмысленно: его находят не с первого раза, а ошибаются с ним всегда.
 *
 *  Незнакомый адрес возвращаем как есть: если это уже готовая ссылка на
 *  плеер, она заработает, а если нет — блок покажет ссылку текстом,
 *  и это лучше, чем пустое место.
 */
export function toVideoEmbedUrl(url: string): string {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return url;
  }

  const host = parsed.hostname.replace(/^www\./, '');

  // VK Видео: ссылка со страницы несёт id владельца и ролика двумя
  // числами через подчёркивание — плееру они нужны разными параметрами.
  if (host === 'vk.com' || host === 'vkvideo.ru' || host === 'm.vk.com') {
    const fromPath = parsed.pathname.match(/video(-?\d+)_(\d+)/);
    const fromQuery = parsed.searchParams.get('z')?.match(/video(-?\d+)_(\d+)/);
    const match = fromPath ?? fromQuery;

    if (match) {
      const params = new URLSearchParams({ oid: match[1], id: match[2] });
      // hash нужен только приватным роликам, но у публичных он безвреден.
      const hash = parsed.searchParams.get('hash');
      if (hash) params.set('hash', hash);

      return `https://vk.com/video_ext.php?${params}`;
    }
  }

  if (host === 'rutube.ru') {
    const match = parsed.pathname.match(/\/video\/(?:private\/)?([\w-]+)/);
    if (match) return `https://rutube.ru/play/embed/${match[1]}/`;
  }

  if (host === 'youtu.be') {
    return `https://www.youtube.com/embed${parsed.pathname}`;
  }

  if (host === 'youtube.com' || host === 'm.youtube.com') {
    const id = parsed.searchParams.get('v');
    if (id) return `https://www.youtube.com/embed/${id}`;
    // Ссылка на шорт или уже на плеер — путь у них подходит как есть.
    const match = parsed.pathname.match(/\/(?:shorts|embed)\/([\w-]+)/);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
  }

  return url;
}
