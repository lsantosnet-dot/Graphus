import { defaultCache } from "@serwist/next/worker";
import { type PrecacheEntry, Serwist, NetworkFirst, StaleWhileRevalidate, ExpirationPlugin } from "serwist";

declare const self: ServiceWorkerGlobalScope & {
  __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
};

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      // Cache para a API de notas - prioriza rede, mas funciona offline
      matcher: ({ url }) => url.pathname.startsWith("/api/notes"),
      handler: new NetworkFirst({
        cacheName: "notes-data",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 50,
            maxAgeSeconds: 24 * 60 * 60, // 24 horas
          }),
        ],
      }),
    },
    {
      // Cache de imagens e assets estáticos
      matcher: ({ request }) => request.destination === "image",
      handler: new StaleWhileRevalidate({
        cacheName: "images",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 60,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 dias
          }),
        ],
      }),
    },
    {
      // Cache de fontes
      matcher: ({ request }) => request.destination === "font",
      handler: new StaleWhileRevalidate({
        cacheName: "fonts",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 10,
            maxAgeSeconds: 30 * 24 * 60 * 60,
          }),
        ],
      }),
    },
  ],
});

serwist.addEventListeners();

export type {};

