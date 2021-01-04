import React, { useState, useEffect } from 'react'
import './inicio.css'
import Map from '../util/Map'
import Chart from './chart'
import { Divider } from 'antd'
import axios from 'axios'

const moment = require('moment');

let abortController = new AbortController();
class Inicio extends React.Component {  
    
    state = {
        benefs: 0,
        acomps: 0,
        coords: 0,
        liqs: 0,
        benefsEsteMes:0,
        acompsEsteMes:0,
        coordsEsteMes:0,
        liqsEsteMes: 0
    }

    setStateAddition = (event) => {

    }

    setNewAddition(array, _state) {

        array.forEach(a => {
            var d = new Date(moment(a.FechaEmision, "DD/MM/YYYY"));
            var m = d.getMonth() + 1;
            var y = d.getFullYear()
            var currentMonth = new Date().getMonth() + 1
            var currentYear = new Date().getFullYear()
            
            if (currentMonth == m && currentYear == y) {
                this.setState({ [_state]: this.state[_state] + 1 })
            }
        });

    }
    
    componentDidMount = async () => {

        const benefresult = await fetch('http://localhost:4000/getBenef/FechaEmision', {signal: abortController.signal});
        const benefdata = await benefresult.json();
        this.setState({ benefs: benefdata.length })
        
        console.log(benefdata)
        
        const acompresult = await fetch('http://localhost:4000/getAcomp/FechaEmision', {signal: abortController.signal});
        const acompdata = await acompresult.json();
        this.setState({ acomps: acompdata.length })
        
        const coordresult = await fetch('http://localhost:4000/getCoord/FechaEmision', {signal: abortController.signal});
        const coorddata = await coordresult.json();
        this.setState({ coords: coorddata.length })
        
        const res = await fetch('http://localhost:4000/getLiq/FechaEmision', {signal: abortController.signal});
        const liqsdata = await res.json();
        this.setState({ liqs: liqsdata.length })

        this.setNewAddition(benefdata, "benefsEsteMes")
        this.setNewAddition(acompdata, "acompsEsteMes")
        this.setNewAddition(coorddata, "coordsEsteMes")
        this.setNewAddition(liqsdata, "liqsEsteMes")

    }

    componentWillUnmount() {
        abortController.abort();
        abortController = new AbortController();
    }
    
    render() {
        
        return(
            <div className="inicio">
                <div className="inicio-banner" style={{padding: '0px 0px'}}>
                    <h1 className="banner-title">
                        Grupo Azul <span style={{fontWeight: 200}}>Gestión</span>
                    </h1>
                </div>

                <div className="inicio-card-group">
                    <div className="inicio-card" style={{ background: 'linear-gradient(45deg,#2ed8b6,#59e0c5)' }}>
                        <div>
                            <h1 className="name-title">
                                <span style={{ color: 'white', fontWeight: 500, fontSize: 20 }}>
                                    {this.state.benefs}
                                </span> Beneficiarios
                            </h1>
                            <h2 className="name-title">
                                {this.state.benefsEsteMes} Nuevos
                            </h2>
                        </div>
                    </div>
                    <div className="inicio-card" style={{ background: 'linear-gradient(45deg,#4099ff,#73b4ff)' }}>
                        <div>
                            <h1 className="name-title">
                                <span style={{ color: 'white', fontWeight: 500, fontSize: 20 }}>
                                    {this.state.acomps}
                                </span> Acompañantes
                            </h1>
                            <h2 className="name-title">
                                {this.state.acompsEsteMes} Nuevos
                            </h2>
                        </div>
                    </div>
                    <div className="inicio-card" style={{ background: 'linear-gradient(45deg,#FFB64D,#ffcb80)' }}>
                        <div>
                            <h1 className="name-title">
                                <span style={{ color: 'white', fontWeight: 500, fontSize: 20 }}>
                                    {this.state.coords}
                                </span> Coordinadores
                            </h1>
                            <h2 className="name-title">
                                {this.state.coordsEsteMes} Nuevos
                            </h2>
                        </div>
                    </div>
                    <div className="inicio-card" style={{ background: 'linear-gradient(45deg,#FF5370,#ff869a)' }}>
                        <div>
                            <h1 className="name-title">
                                <span style={{ color: 'white', fontWeight: 500, fontSize: 20 }}>
                                    {this.state.liqs}
                                </span> Liquidaciones
                            </h1>
                            <h2 className="name-title">
                                {this.state.liqsEsteMes} Generadas este mes
                            </h2>
                        </div>
                    </div>

                            
                </div>

                <div className="content-cont inicio-map" style={{width: '100%', padding: 0}}>
                    <div className="cont-div" style={{height: '100%', padding: 8}}>
                        <Map
                            coordPrincipal={[-31.63335, -60.72]}
                            coords={["a", "b", "c"]}
                            autoCentrar={true}
                            distanciaMax={12}
                            zoom={12}
                        />
                    </div>
                </div>

                <div className="content-cont inicio-chart" style={{padding: 36}}>
                    <Chart
                        data={[this.state.liqsEsteMes, this.state.benefs]}
                    />
                </div>
            </div>
        )
    }
}

export default Inicio