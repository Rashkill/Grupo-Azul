import React from 'react';
import "antd/dist/antd.css";
import './App.css';
import { BrowserRouter, Route } from 'react-router-dom'
import Sidenav from '../navigation/sidenav.js'
import Inicio from '../sections/inicio/inicio.js'
import Personal from '../sections/personal/personal.js'
import AcompProfile from '../sections/personal/acomp-profile.js'
import CoordProfile from '../sections/personal/coord-profile.js'
import Beneficiarios from '../sections/beneficiarios/beneficiarios.js'
import BenefProfile from '../sections/beneficiarios/benef-profile.js'
import Jornadas from '../sections/jornadas/jornadas.js'
import Liquidaciones from '../sections/liquidaciones/liquidaciones.js'
import LiqPreview from '../sections/liquidaciones/liq-preview.js'

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
            <Route path="/acompprofile" component={AcompProfile} />
            <Route path="/coordprofile" component={CoordProfile} />
            <Route path="/beneficiarios" component={Beneficiarios} />
            <Route path="/benefprofile" component={BenefProfile} />
            <Route path="/jornadas" component={Jornadas} />
            <Route path="/liquidaciones" component={Liquidaciones} />
            <Route path="/liq-preview" component={LiqPreview} />
          </div>
        </div>
      </React.Fragment>
    </BrowserRouter>
  );
}

export default App;
