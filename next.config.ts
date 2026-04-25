// next.config.mjs
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
    dest: "public",         // Где будет лежать sw.js
    cacheOnFrontEndNav: true, // Кешировать страницы при переходах
    aggressiveFrontEndNavCaching: true,
    reloadOnOnline: true,    // Обновить страницу при появлении сети
    disable: process.env.NODE_ENV === "development", // Отключаем в деве
});

export default withPWA({
    // Твои обычные настройки Next.js 16
});



/* import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig; */
