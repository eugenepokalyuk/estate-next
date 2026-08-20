import type { NextConfig } from 'next';

/** Хост бэкенда для next/image. Картинки объектов и блоков лежат на Django,
 *  и без явного разрешения next/image откажется их грузить. Берём из того же
 *  адреса API, чтобы не держать домен в двух переменных. */
const apiUrl = new URL(
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1/',
);

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Статического экспорта здесь нет намеренно: страница объекта целиком
  // собирается в админке, и правка блока должна быть видна сразу, а не
  // после пересборки сайта. Отсюда сервер — Node (или Vercel).
  images: {
    // Next 16 не оптимизирует картинки с приватных адресов — защита от SSRF,
    // когда адрес приходит извне. У нас источник один и задан переменной,
    // но локальный Django живёт как раз на 127.0.0.1, поэтому в разработке
    // запрет снимаем. В проде API на публичном домене, и он остаётся в силе.
    dangerouslyAllowLocalIP: process.env.NODE_ENV === 'development',
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
