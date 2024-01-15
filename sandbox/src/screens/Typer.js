import { useState, useEffect } from 'react';

const LOREM_IPSUM = `Lorem ipsum dolor sit amet, consectetur adipiscing elit`;

function Typer(props){
  const [started, setStarted] = useState(false);
  const [text, setText] = useState("");
  const [timer, setTimer] = useState(0);
  const [finalTime, setFinalTime] = useState(null);


  function startTimer(){
    if(started){
      // Je lance la fonction incrementTimer toutes les 1000 ms (1s)
      setInterval(incrementTimer, 1000);
    }
  }

  function incrementTimer(){
    // Je met à jour en utilisant la variable au sein de React
    // (et pas celle au moment de fournir la fonction à setInterval)
    setTimer(currentTimer => currentTimer + 1);
  }

  function didWin(){
    if(text == LOREM_IPSUM){
      setFinalTime(timer);
    }
  }

  // Lorsque start passe à true, je lance le timer
  useEffect(startTimer, [started])

  // Dès que le texte change, je vérifie si il est égal au lorem ipsum
  useEffect(didWin, [text]);

  // Si le temps final est enregistré, plus besoin de rendre tout le reste !  
  if(finalTime){
    return <h1>{finalTime.s} secondes !</h1>
  }

  return (
    <div className="m-5 d-flex">
      <div className="p-2 flex-grow-1 border">
        {LOREM_IPSUM}
      </div>

      <div className="p-2 flex-grow-1 d-flex justify-content-center">
        {started ? (
          <textarea
            value={text}
            onChange={ev => setText(ev.target.value)}
            autoFocus
          />
        ) : (
          <button
            className="btn btn-primary"
            onClick={() => setStarted(true)}
          >
            Start !
          </button>
        )}
      </div>

      {started && <h2 className="text-center flex-grow-1">{timer.s} secondes</h2>}
    </div>
  )
}

export default Typer;