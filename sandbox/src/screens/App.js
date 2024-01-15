import { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

import './App.css';
import Footer from '../components/Footer.js';
import Button from '../components/Button.js';

function App() {
  const navigate = useNavigate();

  return (
    <div className="App m-3">
      <ul className="nav">
        <li className="nav-item">
          <a 
            className={"nav-link"}
            href="#"
            onClick={() => navigate('/')}
          >
            Accueil
          </a>
        </li>
        <li className="nav-item">
          <a 
            className={"nav-link"}
            href="#"
            onClick={() => navigate('/agenda')}
          >
            Agenda
          </a>
        </li>
        <li className="nav-item">
          <a 
            className={"nav-link"}
            href="#"
            onClick={() => navigate('/counter')}
          >
            Counter
          </a>
        </li>

        <li className="nav-item">
          <a 
            className={"nav-link"}
            href="#"
            onClick={() => navigate('/typer')}
          >
            Typer
          </a>
        </li>

        <li className="nav-item">
          <a 
            className={"nav-link"}
            href="#"
            onClick={() => navigate('/weather')}
          >
            Météo
          </a>
        </li>
      </ul>

      <Outlet/>

      <Footer />
    </div>
  );
}

export default App;
