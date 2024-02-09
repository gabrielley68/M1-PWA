import { useState } from 'react';

import PhotoManager from './PhotoManager';

const API_URL = 'http://127.0.0.1:8000';

function PostForm(props){
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  function onSubmit(ev){
    ev.preventDefault();

    // J'envoi l'URL de la photo et pas le fichier lui-même.
    // Il faut qu'elle ait déjà été stockée par le back-end
    props.onAddedPost({
      'title': title,
      'body': body,
      'date': new Date().toLocaleString('fr'),
      'photo': photoUrl
    });

    setTitle('');
    setBody('');
  }

  async function onPhoto(blob){
    // On utilise l'équivalent d'un formulaire HTML version JS avec FormData
    const formData = new FormData();
    // On peut directement y inclure un blob, il sera intégré comme un fichier à la requête
    formData.append('photo', blob);

    // On ne spécifie pas le header Content-Type, il est déduit graĉe à la présence du blob
    // Je peux ainsi envoyer la photo à mon back-end qui se chargera de la stocker
    const response = await fetch(API_URL + '/uploadPhoto', {
      method: 'POST',
      body: formData,
    });

    // Je récupère le lien vers la photo une fois uploadée
    if(response.ok){
      const uploadedFileUrl = await response.text();
      setPhotoUrl(API_URL + '/' + uploadedFileUrl);
    }
  }

  // On affiche le composant responsable des photos que si on peut accéder
  // à une caméra sur la plateforme actuelle
  const displayPhotoManager = (
    'mediaDevices' in navigator
    && 'getUserMedia' in navigator.mediaDevices
  );

  return (
    <div className="mb-5">
      <form onSubmit={onSubmit}>
        <div className="mb-2 form-floating">
          <input 
            className="form-control" id="title"
            value={title} onChange={ev => setTitle(ev.target.value)}
          />
          <label htmlFor="title">Titre</label>
        </div>
        <div className="mb-2 form-floating">
          <textarea
            className="form-control" style={{height: '100px'}}
            value={body} onChange={ev => setBody(ev.target.value)}>    
          </textarea>
          <label>Contenu</label>
        </div>

        {displayPhotoManager && <div>
          {photoUrl ?
            <img
              src={photoUrl}
              className="img-thumbnail mx-auto d-block"
              style={{maxWidth: '200px', maxHeight: '200px'}}
              crossOrigin="anonymous"
            />
          : 
            <PhotoManager onPhoto={onPhoto}/>
          }
          </div>
        }

        <button type="submit" className="btn btn-primary">Ajouter un post</button>
      </form>
    </div>
  );
}

export default PostForm;