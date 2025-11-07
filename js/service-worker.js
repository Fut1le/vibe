var version = '3.2'; // Версия Vibe-PWA
const CACHE_NAME = 'vibe-cache-v' + version;

const urlsToCache = [
  // Основные страницы и стили
  '/',
  '/index.html',
  '/index-lite.html',
  '/css/style.css', // добавьте все необходимые CSS файлы
  
  // JavaScript файлы
  '/js/script.js',
  '/js/fullscreen.js',
  '/js/show-container.js',
  '/js/loader.js',
  '/js/snow.js',
  'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js',
  'https://www.youtube.com/iframe_api',
  
  // Аудиофайлы
  '/sounds/vinyl.mp3',
  '/sounds/heartbeat.mp3',
  '/sounds/seagulls.mp3',
  '/sounds/crickets.mp3',
  '/sounds/cat.mp3',
  '/sounds/wolf.mp3',
  '/sounds/conversation.mp3',
  '/sounds/coffee_shop.mp3',
  '/sounds/office.mp3',
  '/sounds/creaking_ship.mp3',
  '/sounds/airplane.mp3',
  '/sounds/train.mp3',
  '/sounds/car.mp3',
  '/sounds/wind.mp3',
  '/sounds/thunder.mp3',
  '/sounds/water.mp3',
  '/sounds/seaside.mp3',
  '/sounds/rain.mp3',
  '/sounds/snow.mp3',
  '/sounds/fire.mp3',
  '/sounds/night.mp3',
  '/sounds/forest.mp3',
  '/sounds/chimes.mp3',
  '/sounds/lamp.mp3',
  '/sounds/owl.mp3',
  '/sounds/ocean.mp3',
  '/sounds/clock.mp3',
  '/sounds/birds.mp3',
  '/sounds/leaves.mp3',
  
  // Изображения
  '/art/ic/icon-1.png',
  '/art/ic/icon-2.png',
  '/art/ic/icon-3.png',
  '/art/ic/icon-4.png',
  '/art/alb/alb-1.png',
  '/art/alb/alb-2.png',
  '/art/alb/alb-3.png',
  '/art/alb/alb-4.png',
];

self.addEventListener('install', event => {
  console.log('[SW]: Install event');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW]: Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
  console.log('[SW]: Skip waiting');
});

self.addEventListener('fetch', event => {
  console.log(`[SW]: Fetch event for ${event.request.url}`);
  event.respondWith(
    caches.match(event.request)
    .then(response => {
      if (response) {
        console.log(`[SW]: Cache hit for ${event.request.url}`);
        return response;
      }
      
      console.log(`[SW]: Cache miss for ${event.request.url}. Fetching from network.`);
      return fetch(event.request).catch(error => {
        console.error(`[SW]: Network fetch failed for ${event.request.url}: `, error);
        throw error; // Пробрасываем ошибку дальше, чтобы ее можно было отследить
      });
    })
  );
});

self.addEventListener('activate', event => {
  console.log('[SW]: Activate event');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log(`[SW]: Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
  console.log('[SW]: Clients claimed');
});

caches.open(CACHE_NAME)
.then(cache => {
  console.log('[SW]: Opened cache');
  return cache.addAll(urlsToCache.map(url => {
    console.log(`[SW]: Caching ${url}`);
    return url;
  }));
})
.catch(error => {
  console.error('[SW]: Failed to cache resources', error);
});
