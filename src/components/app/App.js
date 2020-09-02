import React from 'react';
import "antd/dist/antd.css";
import './App.css';
import { BrowserRouter, Route } from 'react-router-dom'
import Sidenav from '../navigation/sidenav.js'
import Inicio from '../sections/inicio/inicio.js'
import Personal from '../sections/personal/personal.js'
import Beneficiarios from '../sections/beneficiarios/beneficiarios.js'
import Jornadas from '../sections/jornadas/jornadas.js'
import Liquidaciones from '../sections/liquidaciones/liquidaciones.js'

function App() {
  return (
    <BrowserRouter>
      <React.Fragment>
        <div className="layout">
          <div className="nav-col">
            <Sidenav/>
          </div>
          <div className="content-col">
            <Route path="/inicio" component={Inicio} />
            <Route path="/personal" component={Personal} />
            <Route path="/beneficiarios" component={Beneficiarios} />
            <Route path="/jornadas" component={Jornadas} />
            <Route path="/liquidaciones" component={Liquidaciones} />
          </div>
        </div>
      </React.Fragment>
    </BrowserRouter>
  );
}

export default App;
