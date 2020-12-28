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
        liqsEsteMes: 0
    }
    
    componentDidMount = async () => {
        const benefresult = await fetch('http://localhost:4000/getBenef/', {signal: abortController.signal});
        const benefdata = await benefresult.json();
        this.setState({ benefs: benefdata.length })
        
        const acompresult = await fetch('http://localhost:4000/getAcomp/', {signal: abortController.signal});
        const acompdata = await acompresult.json();
        this.setState({ acomps: acompdata.length })
        
        const coordresult = await fetch('http://localhost:4000/getCoord/', {signal: abortController.signal});
        const coorddata = await coordresult.json();
        this.setState({ coords: coorddata.length })
        

        const res = await fetch('http://localhost:4000/getLiq/FechaEmision', {signal: abortController.signal});
        const datos = await res.json();
        this.setState({ liqs: datos.length })

        datos.map((f) => {
            var d = new Date(moment(datos[0].FechaEmision, "DD/MM/YYYY"));
            var n = d.getMonth() + 1;
            var today = new Date().getMonth() + 1
            // console.log(today)
            // console.log(n)
            if (today == n) {
                this.setState({liqsEsteMes: this.state.liqsEsteMes + 1})
            }
        })
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
                        Grupo Azul <span style={{fontWeight: 200}}>Administración</span>
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
                                0 Nuevos
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
                                0 Nuevos
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
                                0 Nuevos
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

                <div className="content-cont prot-shadow inicio-map" style={{width: '100%', padding: 0}}>
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

                <div className="content-cont prot-shadow inicio-chart" style={{padding: 12}}>
                    <Chart
                        data={[this.state.liqsEsteMes, this.state.benefs]}
                        height="100%"
                    />
                </div>
                        





            </div>
        )
    }
}

export default Inicio