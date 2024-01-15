import { useState, useEffect } from 'react';

import Button from '../components/Button.js';

function Counter(props){
  const [number, setNumber] = useState(0);
  const [switched, setSwitched] = useState(false);

  function increment(){
    setNumber(number + 1);
  }

  function changementBord(){
    console.log("changement de bord")
    setSwitched(!switched)
  }

  function initialRender(){
    console.log("here !!")
  }
  
  useEffect(changementBord, [number]);

  useEffect(initialRender, []);

  return (
    <div>
      <h3 className="text-center">Compteur</h3>

      <div className="d-flex justify-content-center">
        <Button 
          className="btn-secondary mx-5"
          onClick={increment}
          name="incrémenter"
        />

        <Button
          className="btn-secondary mx-5"
          onClick={() => setNumber(number.value - 1)}
          name="décrémenter"
        />

      </div>

      <h1 className="text-center mt-5">{number}</h1>
      <h2 className="text-center mt-5">{switched ? "vrai" : "faux"}</h2>
    </div>
  )
}

export default Counter;