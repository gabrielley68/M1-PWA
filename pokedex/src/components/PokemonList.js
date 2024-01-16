import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Spinner from './Spinner';
import { getImageSrcFromId, getIdFromUrl } from '../utils.js';

const API_URL = 'https://pokeapi.co/api/v2/generation/'

function PokemonList(props){
  const [pokemons, setPokemons] = useState([]);
  const [displayedPokemonsCount, setDiplayedPokemonsCount] = useState(5);
  const [extended, setExtended] = useState(false);

  async function fetchPokemons(){
    const response = await fetch(API_URL + props.generationId);
    const data = await response.json();
    setPokemons(data.pokemon_species);
  }

  useEffect(() => {
    fetchPokemons();
  }, []);

  function toggleExtended(){
    setExtended(!extended);
  }

  if(pokemons.length == 0){
    return <Spinner />
  }

  let displayedPokemon = pokemons;
  if(!extended){
    displayedPokemon = pokemons.slice(0, 6)
  }

  return (
    <div className="row">
      {displayedPokemon.map((pokemon, index) => {
        return (
          <Link to={"/" + pokemon.name} className="col-2" key={'pokemon-' + index}>
            <div className="card">
              <img src={getImageSrcFromId(getIdFromUrl(pokemon.url))} className="card-img-top"/>
              <div className="card-body">
                <h5 className="card-title text-center text-capitalize">{pokemon.name}</h5>
              </div>
            </div>
          </Link>
        )
      })}

      <div className="mt-2 col-12">
        <button className="btn btn-secondary" onClick={toggleExtended}>
          Voir {extended ? "moins" : "plus"}
        </button>
      </div>
    </div>
  )
}

export default PokemonList;