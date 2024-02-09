### Cours de PWA pour les M1 MDS Annecy

## Sandbox
Un simple projet afin d'expérimenter avec React et faire quelques exercices

## Pokedex
Une première PWA implémentant une mise en cache (statique + dynamique) se basant sur [l'api pokeapi](https://pokeapi.co/)

## Blog-back
Un serveur NodeJS + Express stockant à l'aide BDD Sqlite des tweets
Ce site permet également de stocker des fichiers uploadés et d'émettre des notifications push

## Blog
PWA client allant de pair avec Blog-back. Elle implémente
- Un pré-cache
- Un cache dynamique des requêtes HTTP et des images statiques (uploads)
- Une synchronisation offline afin d'émettre des requêtes sans connexion internet
- Un système de notification push
Le service worker est présent sous deux formes : le fichier `public/serviceWorker.js` et le fichier `src/service-worker.js` qui repose sur l'utilisation de Workbox pour le cache.
On peut switcher d'un SW à l'autre en changeant :
1. La variable `useWorkbox` dans `public/index.html`
2. En changeant la fonction `register` en `unregister` dans `src/index.js`

En espérant que ça vous sera utile :) !
