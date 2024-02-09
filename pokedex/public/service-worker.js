const PRECACHE_NAME = 'app-shell';


self.addEventListener('install', function(event){
    console.log("Installation...");

    caches.open(PRECACHE_NAME).then(function(cache){
        cache.add('/');
    })
});

self.addEventListener('activate', function(event){
    console.log("Activation ...");
});

self.addEventListener('fetch', function(event){
    event.respondWith(
        caches.match(event.request.url).then(
            function(response){
                if(response){
                    return response;
                }
                else {
                    return fetch(event.request);
                }
            }
        )
    );
});