import { useState } from 'react';

import { urlB64ToUint8Array } from '../utils.js';

const publicPushKey = 'BDBygkzwIYk2dPeN2Kl5R9BfrPrm3kHWIRzCnfAcxOVU1rYY4BdaBmUJtEaeeCfic9wgqRA3nbHmP9buypKcAd8';

function NotificationsManager(props){
  const [subscribed, setSubscribed] = useState(
    Notification.permission === 'granted'
  );

  async function subscribe(){
    // On demande l'utilisateur veut bien avoir des notifs
    const result = await Notification.requestPermission();

    // Si c'est le cas :
    if(result === 'granted'){
      const serviceWorker = await navigator.serviceWorker.ready;

      // On regarde si un abonnement push existe déjà
      // (un abonnement = un couple navigateur + machine)
      let subscription = await serviceWorker.pushManager.getSubscription();
      // Si besoin on la créé
      if(subscription === null){
        const subscriptionOptions = {
          userVisibleOnly: true,
          // Obligation d'appeler cette fonction, pourquoi ? jsp, pushManager le demande
          applicationServerKey: urlB64ToUint8Array(publicPushKey),
        }

        // On appelle pushManager qui fera le lien avec le serveur du navigateur en cours
        // (mozilla, google, etc...)
        subscription = await serviceWorker.pushManager.subscribe(subscriptionOptions);
      }

      // Enregistrement de l'abonnement dans la BDD de mon back-end
      const response = await fetch('http://127.0.0.1:8000/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {'Content-Type' : 'application/json'}
      });

      if(response.ok){
        new Notification('Merci', {
          'body': 'Vous êtes bien abonnés :)'
        });
      } else {
        alert("Erreur lors de l'enregistrement de l'abonnement");
      }
    }
  }

  async function testNotification(){
    const options = {
      body: "Le corps de ma notif",
      icon: '/logo192.png'
    }

    new Notification('test', options);
  }

  if(subscribed){
    return (
      <div className="p-3 fixed-bottom end-0">
        <button onClick={testNotification} className="btn btn-info">
          Test notif
        </button>
      </div>
    );
  }


  return (
    <div className="p-3 fixed-bottom end-0">
      <button onClick={subscribe} className="btn btn-info">
        S'abonner aux notifications
      </button>
    </div>
  );
}

export default NotificationsManager;