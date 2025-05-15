import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import App from './App.tsx'
import './index.css'
import Ejemplo1 from './examples/Ejemplo1/App'
import Ejemplo2 from './examples/Ejemplo2/App'
import Ejemplo3 from './examples/Ejemplo3/App'
import Ejemplo4 from './examples/Ejemplo4/App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/Ejemplo1" element={<Ejemplo1 />} />
        <Route path="/Ejemplo2" element={<Ejemplo2 />} />
        <Route path="/Ejemplo3" element={<Ejemplo3 />} />
        <Route path="/Ejemplo4" element={<Ejemplo4 />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
