import Button from '../components/Button.js';

function Home(props){
  function onButtonPressed(){
    console.log("button was pressed");
  }

  const myButtonName = "Mon autre bouton";

  return (
    <div>
      Hello world !!!

      <br/>
      <Button
        name="Mon bouton trop cool"
        className="btn-primary"
        onClick={onButtonPressed}
        yelling
      />

      <br/>
      <Button
        className="btn-secondary"
        link="https://www.google.fr/"
      />
    </div>
  )
}

export default Home;