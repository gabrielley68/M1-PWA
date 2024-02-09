// Pour importer un script dans un service worker on utilise cette fonction
// Il faut que le script soit accessible dans les statics
importScripts('/idb.js');

// À remplacer par votre backend
const BACKEND_URL = 'http://127.0.0.1:8000';


self.addEventListener('install', (event) => {
  console.log("installed");

  // Population du pré-cache lors de l'installation
  event.waitUntil(
    caches.open('app-shell').then(function(cache){
      cache.addAll([
        '/',
        '/idb.js',
        '/favicon.ico',
        '/logo192.png',
        '/logo512.png',
        '/static/js/main.91f51bb2.js',
        '/static/js/main.91f51bb2.js.map',
        '/manifest.json',
        'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
        'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js',
      ]);
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('activated');
});


// Stratégie de cache 1 : on lit uniquement depuis le cache
function getFromCache(cacheName, request){
  return caches.open(cacheName).then(function(cache){
    return cache.match(request).then(function(cachedResponse){
      if(cachedResponse){
        return cachedResponse
      }

      return fetch(request);
    })
  });
}

// Stratégie de cache 2 : On priorise les données du réseau
// Sinon on utilise le cache
function getFromNetworkOrCache(cacheName, request){
  return caches.open(cacheName).then(function(cache){
    return fetch(request).then(function(networkResponse){
      console.log("Got from network");
      cache.put(request, networkResponse.clone());
      console.log("Update cache");
      return networkResponse;
    }).catch(function(error){
      return cache.match(request).then(function(cachedResponse){
        if(cachedResponse){
          console.log("Got from cache");
          return cachedResponse;
        } else {
          console.error("Couldn't fetch posts");
        }
      });
    });
  })
}

// Stratégie 3 : On priorise le cache, sinon on utilise le réseau
function getFromCacheOrNetwork(cacheName, request){
  return caches.open(cacheName).then(function(cache){
    return cache.match(request).then(function(cachedResponse){
      if(cachedResponse){
        return cachedResponse;
      }
      else {
        return fetch(request).then(function(networkResponse){
          cache.put(request.url, networkResponse.clone());
          return networkResponse;
        });
      }
    });
  })
}


// Routing du cache
self.addEventListener('fetch', (event) => {
  // On ne veut mettre en cache que les requête GET
  if(event.request.method !== 'GET'){
    return;
  }

  // Photos uploadées => je priorise le cache puisqu'elle ne seront pas modifiées
  if(event.request.url.startsWith(BACKEND_URL + '/uploads')){
    event.respondWith(getFromCacheOrNetwork('uploads', event.request));
  }
  // Posts => je priorise le réseau pour avoir des données fraîches
  else if(event.request.url.startsWith(BACKEND_URL)){
    event.respondWith(getFromNetworkOrCache('dynamic', event.request));
  }
  // Pré-cache => on utilise uniquement le cache
  else {
    event.respondWith(getFromCache('app-shell', event.request));
  }
});


// Événement appelé lorsqu'on accède à internet
// + si un événement de synchronisation a été émis par le client
self.addEventListener('sync', function(event){
  console.log("[SW] Got a new event", event);

  // Envoi des posts qui n'a pas pu être fait au moment de la création
  if(event.tag === 'sync-new-posts'){
    // Ouverture de la BDD indexée (version 1)
    idb.openDB('offline-sync', 1).then(function(database){
      // On récupère tous les posts qui n'ont pas pu être envoyés
      database.getAll('posts').then(function(posts){
        for(const post of posts){
          // Pour chaque post, je fais ma requête HTTP
          fetch(
            BACKEND_URL + '/',
            {
              method: 'POST',
              body: JSON.stringify({
                'title': post.title,
                'body': post.body,
              }),
              headers: { 'Content-Type': 'application/json' }
            }
          ).then(function(response){
            if(response.ok){
              database.delete('posts', post.id);
              console.log(
                "[SW] Got internet, synced the post " + post.title
              );
            } else {
              console.log("[SW] Couldn't sync a post, try again later")
            }
          })
        }
      });
    });
  }
});


// Événement appelé lors de la réception d'une notification
self.addEventListener('push', function(event){
  console.log("Received push notification", event);

  const notificationData = event.data.json();

  self.registration.showNotification(
    notificationData.title,
    {
      body: notificationData.body,
      icon: '/logo512.png',
      actions: [
        {'title': 'Consulter', 'action': 'open'},
        {'title': 'Ignorer', 'action': 'ignore'},
      ] 
    }
  );
})


// Événement appelé lors du click sur une notification
self.addEventListener('notificationclick', function(event){
  switch(event.action){
    case 'ignore':
      // Ici on ne fait rien mais on pourrait remplir des analytics
      // pour tracker la pertinence de nos notifs
      break;
    case 'open':
    default:
      event.waitUntil(
        // Je regarde les fenêtres actuellement ouvertes
        clients.matchAll().then(function(tabs){
          // Si mon site est ouvert quelque part, je switch dessus
          if(tabs.length){
            tabs[0].focus();
          } else {
            // Sinon j'ouvre une nouvelle fenêtre sur mon site
            clients.openWindow('http://127.0.0.1:3000');
          }
        })
      );
      break;
  }

  // Dans tous les cas je ferme la notification
  event.notification.close();
});
