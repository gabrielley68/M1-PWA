import { Link, Outlet } from 'react-router-dom'; 

function App() {
  return (
    <div className="container mt-3">
      <Link to="/">
        <h1 className="text-center">Pokedex en React</h1>
      </Link>

      <Outlet />

      <div className="text-center fixed-bottom">
        <div
          className="rounded-pill px-3 py-1 mb-2 bg-info-subtle d-inline-block"
        >
          Créé par Gabriel LEY
        </div>
      </div>
    </div>
  );
}

export default App;
