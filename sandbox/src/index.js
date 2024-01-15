import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';
import App from './screens/App';

import Counter from './screens/Counter.js';
import Agenda from './screens/Agenda.js';
import Home from './screens/Home.js';
import Typer from './screens/Typer.js';
import Weather from './screens/Weather.js';

const routerConfig = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/agenda",
        element: <Agenda day="lundi" /> 
      },
      {
        path: "/counter",
        element: <Counter />,
      },
      {
        path: "/typer",
        element: <Typer />,
      },
      {
        path: "/weather/",
        element: <Weather />,
      },
      {
        path: "/weather/:city",
        element: <Weather />,
      }
    ]
  },
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={routerConfig}>
      <App />
    </RouterProvider>
  </React.StrictMode>
);
