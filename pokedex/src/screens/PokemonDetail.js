import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Spinner from '../components/Spinner';

const API_URL = "https://pokeapi.co/api/v2/pokemon/";

function PokemonDetail(props){
  const [pokemon, setPokemon] = useState(null);
  const params = useParams();

  async function fetchData(){
    const name = params.name;

    const response = await fetch(API_URL + name);
    const data = await response.json();

    setPokemon(data);
  }

  useEffect(() => {
    fetchData();
  }, []);

  if(!pokemon){
    return <Spinner />
  }

  return (
    <div>
      <h3 className="text-capitalize">{pokemon.name} - #{pokemon.id}</h3>
      <div className="row">
        <div className="col-md-6 col-sm-12">
          <img src={pokemon.sprites.other['official-artwork']['front_default']}/>
        </div>

        <div className="col-md-6 col-sm-12">
          <p>
            Types :
            {pokemon.types.map(type => (
              <span className="badge bg-secondary text-capitalize mx-1" key={type.slot}>{type.type.name}</span>
            ))}
          </p>

          <p>Poids : {pokemon.weight}</p>
          <p>Taille : {pokemon.height}</p>

          <div>
            Compétences : 
            <ul>
              {pokemon.abilities.map(ability => (
                <li key={ability.slot}>{ability.ability.name}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PokemonDetail;