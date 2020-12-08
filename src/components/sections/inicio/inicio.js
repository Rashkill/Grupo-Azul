import React from 'react'
import axios from 'axios'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'


const getLoc = async(direc, callback) => {
    const response = await axios('http://dev.virtualearth.net/REST/v1/Locations?q=candido%20pujato%203360%20santa%20fe%203000%20argentina&maxResults=1&key=Arn6kit_Moqpx-2p7jWVKy1h-TlLyYESkqc1cHzP1JkEAm1A_86T8o3FtDcKqnVV')
    // const coords = response.data.resourceSets[0].resources[0].geocodePoints[0].coordinates
    // console.log(typeof(coords[1]))
    console.log(response.data)

    return response.data.resourceSets[0].resources[0].geocodePoints[0].coordinates
}


const Inicio = () => {

    const promise1 = getLoc().then(coords => {
        return coords
    });
    console.log(promise1)

    return(
        <div style={{width: '100%', height: '80vh'}}>
            <h1 style={{textAlign: "center"}}>
                Si estás leyendo esto, es porque sabes leer
                <br/>
                <br/>
                No sé leer no sé qué dice 😭😭
            </h1>

            <div id="mapid" style={{width: '100%', height: '100%'}}>
                <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true} style={{height:'100%'}}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {/* <Marker position={[-31.63176, -60.71262]}> */}
                    <Marker position={[-31.63176, -60.71262]}>
                        <Popup>
                        Mi casa <br /> jeje
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>

        </div>
    )
}

export default Inicio