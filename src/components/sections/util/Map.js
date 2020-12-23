import React from 'react'
import {Divider} from 'antd'
import { NavLink, withRouter } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, MapConsumer } from 'react-leaflet'
import { Typography, Space } from 'antd';
import { createHashHistory } from 'history';
import { marker } from 'leaflet';
import markerGreen from '../../../images/marker-icon-green.png'
import markerBlue from '../../../images/marker-icon-blue.png'
import markerYellow from '../../../images/marker-icon-yellow.png'
import markerGrey from '../../../images/marker-icon-grey.png'
import markerShadow from '../../../images/marker-shadow.png'
import imgBenef from '../../../images/image4-5.png'
import imgAcomp from '../../../images/image3.png'
import imgCoord from '../../../images/image3_1.png'


const { Text } = Typography;

export const history = createHashHistory();

var L = window.L;

class Mapa extends React.Component {

    
    state = {
        info: [],
        mainMarkerIcon: new L.Icon({
            iconUrl: markerGrey,
            shadowUrl: markerShadow,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        })
    }
    componentDidMount(){
        if (this.props.coords) {
            this.props.coords.map(async(c) => {
                let fields = "*", table = "", linkto = "";
                let markerIcon, cardImg;
                switch (c) {
                    //ACOMPAÑANTE
                    case "a":
                        fields = "Id, Nombre, Apellido, DNI, CUIL, EntidadBancaria, CBU, Domicilio, Localidad, CodigoPostal, Email, Telefono, ValorHora, NumeroPoliza, NombreSeguros, Latitud, Longitud";
                        table = "Acompañante";
                        linkto = "/acompprofile";
                        cardImg = imgAcomp;
                        markerIcon = new L.Icon({
                            iconUrl: markerBlue,
                            shadowUrl: markerShadow,
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                            shadowSize: [41, 41]
                        });
                        break;
                    //BENEFICIARIO
                    case "b":
                        fields = "Id, Nombre, Apellido, DNI, CUIL, FechaNacimiento, Domicilio, Localidad, CodigoPostal, Email, Telefono, Enfermedades, IdCoordinador, Latitud, Longitud";
                        table = "Beneficiario";
                        linkto = "/benefprofile";
                        cardImg = imgBenef;
                        markerIcon = new L.Icon({
                            iconUrl: markerGreen,
                            shadowUrl: markerShadow,
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                            shadowSize: [41, 41]
                        });
                        break;
                    //COORDINADOR
                    case "c":
                        fields = "Id, Nombre, Apellido, DNI, CUIL, EntidadBancaria, CBU, Domicilio, Localidad, CodigoPostal, ValorMes, Latitud, Longitud";
                        table = "Coordinador";
                        linkto = "/coordprofile";
                        cardImg = imgCoord;
                        markerIcon = new L.Icon({
                            iconUrl: markerYellow,
                            shadowUrl: markerShadow,
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                            shadowSize: [41, 41]
                        });
                        break;
                }
                const result = await fetch('http://localhost:4000/getTable/' + fields + "/" + table);
                const info = await result.json();

                let arr = this.state.info;
                await info.forEach(i => {
                    i.cardImg = cardImg;
                    i.markerIcon = markerIcon;
                    i.tipo = table;
                    i.linkto = linkto;
                    arr.push(i);
                });
                this.setState({ info: arr });

            })
        }
        //Color del marker principal
        switch (this.props.markerPrincipal) {
            case "a":
                this.setState(
                    {
                        mainMarkerIcon: new L.Icon({
                            iconUrl: markerBlue,
                            shadowUrl: markerShadow,
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                            shadowSize: [41, 41]
                        })
                    })
                break;
            case "b":
                this.setState(
                    {
                        mainMarkerIcon: new L.Icon({
                            iconUrl: markerGreen,
                            shadowUrl: markerShadow,
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                            shadowSize: [41, 41]
                        })
                    })
                break;
            case "c":
                this.setState(
                    {
                        mainMarkerIcon: new L.Icon({
                            iconUrl: markerYellow,
                            shadowUrl: markerShadow,
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                            shadowSize: [41, 41]
                        })
                    })
                break;
        }
    }

    render(){
        return(
            <div id="mapid" style={{width: '100%', height: '100%'}}>
                <MapContainer center={this.props.coordPrincipal} zoom={this.props.zoom?this.props.zoom:16} scrollWheelZoom={true} style={{height:'100%'}}>
                    <MapConsumer>
                        {(map) => {
                            if (this.props.autoCentrar) {
                                let arr = [this.props.coordPrincipal];
                                this.state.info.forEach(p => {
                                    let distanciaMax = this.props.distanciaMax ? this.props.distanciaMax : 3;
                                    //Calculo de distancia
                                    let x1 = p.Latitud, y1 = p.Longitud;
                                    let x2 = this.props.coordPrincipal[0], y2 = this.props.coordPrincipal[1];
                                    let d = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) * 100;
                                    //Comparar distancia
                                    if (d.toFixed(3) <= distanciaMax)
                                        arr.push(L.latLng(p.Latitud, p.Longitud));
                                });
                                if (arr.length > 0)
                                    map.fitBounds(new L.latLngBounds(arr));
                            }
                            return null
                        }}
                    </MapConsumer>
                    <TileLayer
                        // attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {this.props.markerPrincipal ?
                        <Marker
                        icon ={this.state.mainMarkerIcon}
                        position={this.props.coordPrincipal}
                    />:<div></div>}

                    {this.state.info.map((p,index) => {
                        
                        return(
                            <Marker 
                                icon={p.markerIcon}
                                position={[p.Latitud, p.Longitud]} 
                                key={`Marker N°${index+1}`}
                            >
                                <Popup style={{width: 'max-content'}}>
                                    <div className="popup">
                                        <img src={p.cardImg} style={{width:80, marginTop:4}}/>
                                        <div>
                                            <Divider>
                                                <Text mark>{p.tipo}</Text><br/>
                                                <NavLink style={{fontWeight: "bolder"}} to={{
                                                    pathname: p.linkto,
                                                    state: p
                                                }}>
                                                    {p.Nombre + " " + p.Apellido}
                                                </NavLink>
                                                <br/>
                                                <p style={{fontSize: 12, margin: 0}}>
                                                    {p.CUIL.split('-')[0] +'-'+ p.DNI +'-'+ p.CUIL.split('-')[1]}
                                                </p>
                                            </Divider>
                                            <div style={{textAlign: "center"}}>
                                                {p.Domicilio} <br/>
                                                <div style={{fontSize: 10}}>{p.Localidad + " " + p.CodigoPostal}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        )
                    })}
                </MapContainer>
            </div>
        )
    }

}


export default Mapa