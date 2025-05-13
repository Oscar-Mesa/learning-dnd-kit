import { Outlet } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div className="App">
      <header>
        <h1>Mis Ejemplos de Aprendizaje</h1>
        <nav>
          <ul>
            <li><a href="/Ejemplo1">Drag & Drop Básico</a></li>
            <li><a href="/Ejemplo2">Persistencia de posición</a></li>
            <li><a href="/Ejemplo3">Columnas kanban y cambio de lugar</a></li>
          </ul>
        </nav>  
      </header>
      <main>
        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default App;
