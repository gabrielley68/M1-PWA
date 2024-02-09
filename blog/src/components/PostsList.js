import { useState, useEffect } from 'react';
import { openDB } from 'idb';

import PostForm from './PostForm';

const API_URL = 'http://127.0.0.1:8000';

function Post(props){
  // Fonction marrante pour faire lire du texte
  // Attention, pas dispo sur tous les navigateurs !
  function textToSpeech(){
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(props.post.body);
    utter.lang = 'fr';
    synth.speak(utter);
  }

  return (
    <div className="my-3 border p-2 rounded">
      <h5>
        <strong>{props.post.title}</strong>
        <small className="text-body-secondary">&nbsp; - &nbsp;{props.post.date}</small>
      </h5>

      <p>
        {props.post.body}
      </p>

      {props.post.photo && <div>
        <img src={props.post.photo} className="img-fluid" crossOrigin="anonymous"/>
      </div>}
      <button type="button" onClick={textToSpeech} className="btn btn-info">Écouter</button>
    </div>
  )
}

function PostsList(props){
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchPosts(){
    const response = await fetch(API_URL);
    const data = await response.json();
    setPosts(data.results);
    setLoading(false);
  }

  useEffect(() => {
    fetchPosts();
  }, []);


  async function saveLater(post){
    // Ouverture la BDD intégrée (IDB)
    const database = await openDB(
      // Nom de la BDD,
      // Version qu'on utilise
      // options
      'offline-sync',
      1,
      {
        // On créé automatiquement la table lorsqu'on accède à la base
        // (si elle n'existe pas déjà)
        upgrade(db){
          // On lui spécifie ici qu'un champ ID doit être auto-généré, et sera utilisé comme clé
          db.createObjectStore('posts', {keyPath: 'id', autoIncrement: true})
        }
      }
    );

    // J'ajoute mon post à la base
    await database.add('posts', post);

    // J'informe mon SW qu'il devra faire une synchronisation dès que possible
    const serviceWorker = await navigator.serviceWorker.ready;
    await serviceWorker.sync.register('sync-new-posts');
  }


  async function onAddedPost(post){
    try {
      const response = await fetch(
        API_URL, {
          'method': "POST",
          'body': JSON.stringify(post),
          'headers': {
            'Content-Type': "application/json"
          }
        }
      );
      if(response.ok){
        setPosts([post, ...posts]);
      } else {
        console.error("Erreur ", response);
      }
    } catch(error) {
      if('serviceWorker' in navigator && 'SyncManager' in window){
        alert(
          "Impossible de poster le message sans connexion. "
          + "Votre tweet sera posté dès que possible"
        );

        // Si on arrive dans ce catch c'est que la requête n'a pas pu être faite
        // On a certainement pas d'accès à internet
        saveLater(post);
      } else {
        alert("Impossible de poster hors connexion");
      }
    }
  }

  if(loading){
    return (
      <div className="text-center">
        <div className="spinner-border">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PostForm onAddedPost={onAddedPost}/>
      {posts.map((post, index) => (
        <Post
          key={"post-" + index}
          post={post}
        />
      ))}
    </div>
  );
}

export default PostsList;