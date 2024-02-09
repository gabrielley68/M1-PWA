import React, { useEffect, useState } from 'react';

import PostsList from './components/PostsList';
import InstallPrompt from './components/InstallPrompt';
import NotificationsManager from './components/NotificationsManager';

function App() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const displayNotificationManager = 'Notification' in window;

  useEffect(() => {
    // Si le navigateur permet l'installation (et si ce n'est pas déjà installé)
    // cet événement sera appelé, et on peut court-circuiter le comportement
    // par défaut pour afficher notre propre bouton d'installation
    window.addEventListener('beforeinstallprompt', event => {
      event.preventDefault();
      setInstallPrompt(event);
    });

    window.addEventListener('offline', event => {
      setIsOnline(false);
    });

    window.addEventListener('online', event => {
      setIsOnline(true);
    });
  }, []);

  async function install(){
    // Affiche manuellement la fenêtre d'invitation à l'installation
    if(installPrompt){
      installPrompt.prompt();
      const choice = await installPrompt.userChoice;

      if(choice.outcome === 'dismissed'){
        console.log("dommage");
      } else {
        setInstallPrompt(null);
        console.log("thank you! ");
      }
    } 
  }

  return (
    <div className="container">
      <div className="col-12 col-md-8 offset-md-2">
        <h1 className="text-center mt-3 mb-5">
          Le blog de Gabriel
        </h1>
        <PostsList />

        {!isOnline && (
          <div className="fixed-top start-0">
            <div className="toast show fade">
              <div className="d-flex">
                <div className="toast-body">
                  Mode hors ligne
                </div>
              </div>
            </div>
          </div>
        )}

        {displayNotificationManager && <NotificationsManager/>}

        {!!installPrompt && <InstallPrompt onInstall={install} />}
      </div>
    </div>
  );
}

export default App;
