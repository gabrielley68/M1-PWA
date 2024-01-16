import { useState, useEffect } from 'react';

import Spinner from '../components/Spinner';
import PokemonList from '../components/PokemonList';

import { getIdFromUrl } from '../utils.js';


const API_URL = "https://pokeapi.co/api/v2/generation"

function Generations(){
  const [generations, setGenerations] = useState([]);

  function fetchDataPromise(){
    fetch(API_URL).then(
      response => {
        return response.json()
      }
    ).then(
      data => {
        setGenerations(data.results);
      }
    )
  }

  async function fetchData(){
    const response = await fetch(API_URL);
    const data = await response.json();
    setGenerations(data.results);
  }

  useEffect(() => {
    fetchData()
  }, []);

  if(generations.length == 0){
    return (
      <Spinner />
    )
  } 

  return (
    <div>
      {generations.map((generation, index) => {
        return (
          <div className="my-3" key={'generation-' + index}>
            <h3>Génération {index + 1}</h3>
            <PokemonList generationId={getIdFromUrl(generation.url)} />
          </div>    
        )
      })}
    </div>
  );
}

export default Generations;