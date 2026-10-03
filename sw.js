const CACHE_NAME = 'vaquinhas-v8-offline-v1';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    // Ignora requisições de gravação (POST) e requisições para a API do Google ou Imagens
    if (event.request.method !== 'GET') return;
    if (event.request.url.includes('script.google.com') || event.request.url.includes('cloudinary.com')) return;

    // Estratégia "Network First": Tenta ir à internet buscar a versão mais recente do HTML/CSS.
    // Se a internet falhar, entrega a versão que está guardada na memória do telemóvel.
    event.respondWith(
        fetch(event.request).then((response) => {
            let resClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, resClone);
            });
            return response;
        }).catch(() => {
            return caches.match(event.request);
        })
    );
});
