import type { NextConfig } from 'next';

/** Хост бэкенда для next/image. Картинки объектов и блоков лежат на Django,
 *  и без явного разрешения next/image откажется их грузить. Берём из того же
 *  адреса API, чтобы не держать домен в двух переменных. */
const apiUrl = new URL(
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1/',
);

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Сайт раздаётся как статика с GitHub Pages, поэтому собираем экспорт в out/.
  // Правка блока в админке не теряется: Django после сохранения дёргает
  // repository_dispatch, и Actions пересобирают сайт (см. core/redeploy.py
  // в estate-api). Задержка — время сборки, около двух минут.
  output: 'export',
  // Без слеша на конце Pages отдаёт 404 на /object/severny: он ищет
  // severny.html, а экспорт кладёт severny/index.html.
  trailingSlash: true,
  images: {
    // На Pages оптимизатора нет — картинки уезжают как есть. Django жмёт их
    // сам при загрузке в админку и кладёт webp (см. core/images.py).
    unoptimized: true,
    // Проверка источника работает и при выключенной оптимизации, так что
    // список хостов нужен по-прежнему.
    remotePatterns: [
      {
        protocol: apiUrl.protocol.replace(':', '') as 'http' | 'https',
        hostname: apiUrl.hostname,
        port: apiUrl.port,
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;
