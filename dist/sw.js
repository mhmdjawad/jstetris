self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('your-cache-name').then(cache => {
            return cache.addAll([
                '/balance/',
                'index.html',
                // '/style.css',
                // '/script.js',
                // Add more files you want to cache
            ]);
        })
    );
});

// Activate Service Worker
self.addEventListener('activate', event => {
    // You can perform cleanup or version management here
});

// Fetch from cache or network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        }).catch(() => {
            // Handle the case when the asset is not in the cache and the network is also unavailable
        })
    );
});