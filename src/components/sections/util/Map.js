import React from 'react'
import {Divider} from 'antd'
import { NavLink, withRouter } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Typography, Space } from 'antd';
import { createHashHistory } from 'history';

const { Text } = Typography;

export const history = createHashHistory();

var L = window.L;
var markerIcon;

class Map extends React.Component {
 
    state = {
        info: [],
        linkto: ""
    }

    componentDidMount = async() =>{
        if(this.props.buscarCoords){
            try {
                let fields = "*";
                switch(this.props.buscarCoords){
                    case "Acompañante": 
                        fields = "Id, Nombre, Apellido, DNI, CUIL, EntidadBancaria, CBU, Domicilio, Localidad, CodigoPostal, Email, Telefono, ValorHora, NumeroPoliza, NombreSeguros, Latitud, Longitud"
                        markerIcon = new L.Icon({
                            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
                            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                            shadowSize: [41, 41]
                        });
                        this.setState({linkto:"/acompprofile"}); 
                        break;
                    case "Beneficiario":
                        fields = "Id, Nombre, Apellido, DNI, CUIL, FechaNacimiento, Domicilio, Localidad, CodigoPostal, Email, Telefono, Enfermedades, IdCoordinador, Latitud, Longitud"
                        markerIcon = new L.Icon({
                            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
                            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                            shadowSize: [41, 41]
                        });
                        this.setState({linkto:"/benefprofile"}); 
                        break;
                    case "Coordinador": 
                        fields = "Id, Nombre, Apellido, DNI, CUIL, EntidadBancaria, CBU, Domicilio, Localidad, CodigoPostal, ValorMes, Latitud, Longitud"
                        markerIcon = new L.Icon({
                            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
                            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                            shadowSize: [41, 41]
                        });
                        this.setState({linkto:"/coordprofile"}); 
                        break;
                }

                const result = await fetch('http://localhost:4000/getTable/' + fields + "/" + this.props.buscarCoords);
                const info = await result.json();
                this.setState({info: await info})
                
            } catch (error) {console.log(error);}
        }

    }

    render(){
        return(
            <div id="mapid" style={{width: '100%', height: '100%'}}>
                <MapContainer center={this.props.coordPrincipal} zoom={16} scrollWheelZoom={true} style={{height:'100%'}}>
                    <TileLayer
                        // attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker
                        icon ={new L.Icon({
                            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                            shadowSize: [41, 41]
                        })}
                        position={this.props.coordPrincipal}
                    >
                    </Marker>

                    {this.state.info.map((p,index) => {
                        return(
                            <Marker 
                                icon={markerIcon}
                                position={[p.Latitud, p.Longitud]} 
                                key={`Marker N°${index+1}`}
                            >
                                <Popup>
                                    <Divider>
                                        <Text mark>{this.props.buscarCoords}</Text><br/>
                                        <NavLink style={{fontWeight: "bolder"}} to={{
                                            pathname: this.state.linkto,
                                            state: p
                                        }}>
                                            {p.Nombre + " " + p.Apellido}
                                        </NavLink>
                                    </Divider>
                                    <div style={{textAlign: "center"}}>
                                        {p.Domicilio} <br/>
                                        <div style={{fontSize: 10}}>{p.Localidad + " " + p.CodigoPostal}</div>
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


export default Map