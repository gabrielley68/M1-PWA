import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function getUrl(city){
  return 'http://api.weatherapi.com/v1/current.json?key=72361dc0de984631970174354230208&q=' + city
}
function Weather(props){
  const [temperature, setTemperature] = useState(null);

  const params = useParams();
  const city = params.city || 'Annecy';

  // Promesse
  function loadData(){
    fetch(URL).then(
      response => response.json().then(
          data => setTemperature(data)
        )
    );
  }

  // useEffect(loadData, []);

  // Asynchrone
  async function asyncLoadData(){
    const response = await fetch(getUrl(city));
    const data = await response.json();
    setTemperature(data);
  }
  useEffect(() => {
    asyncLoadData()
  }, []);

  if(temperature){
    return (
      <div>
        Il fait {temperature.current.temp_c}°c à {city}
      </div>
    );
  } else {
    <div>Chargement...</div>
  }
}

export default Weather;