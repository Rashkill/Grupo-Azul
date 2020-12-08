import React from 'react'
import { NavLink, withRouter } from 'react-router-dom';
import axios from 'axios'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { latLng } from 'leaflet';

// var coords = []

class Map extends React.Component {

    state = {
        coords: [-31.63276, -60.71262]
    }

    componentDidMount(){
        var latlong = []

        axios('http://dev.virtualearth.net/REST/v1/Locations?q=candido%20pujato%203360%20santa%20fe%203000%20argentina&maxResults=1&key=Arn6kit_Moqpx-2p7jWVKy1h-TlLyYESkqc1cHzP1JkEAm1A_86T8o3FtDcKqnVV')
            .then(response => {
                latlong = response.data.resourceSets[0].resources[0].geocodePoints[0].coordinates
            })
            .then(() => {
                // console.log(coords)
                this.setState({coords: latlong})
            })

        console.log(this.state.coords)
    }
    
    render(){
        return(
            <div id="mapid" style={{width: '100%', height: '100%'}}>
                <MapContainer center={[-31.63176, -60.71262]} zoom={16} scrollWheelZoom={true} style={{height:'100%'}}>
                    <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {/* <Marker position={[-31.63176, -60.71262]}>
                        <Popup>
                        Mi casa <br/> 
                        jeje<br/>
                        <NavLink to="/personal">
                            <a>personal</a>
                        </NavLink>
                        </Popup>
                    </Marker> */}
                    <Marker position={this.state.coords}>
                    {/* <Marker position={coords}> */}
                        <Popup>
                        otro marker <br/>
                        <NavLink to="/beneficiarios">
                            <a>beneficiarios</a>
                        </NavLink>
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>
        )
    }

}


export default Map