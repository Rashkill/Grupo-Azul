import React, { useState, useEffect } from 'react'
import { NavLink, withRouter } from 'react-router-dom';
import axios from 'axios'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import Map from '../util/Map'


const getLoc = async(direc, callback) => {
    // const response = 
    let r;
    let coords = []
    await axios('http://dev.virtualearth.net/REST/v1/Locations?q=candido%20pujato%203360%20santa%20fe%203000%20argentina&maxResults=1&key=Arn6kit_Moqpx-2p7jWVKy1h-TlLyYESkqc1cHzP1JkEAm1A_86T8o3FtDcKqnVV').then(response => {
        r = response.data.resourceSets[0].resources[0].geocodePoints[0].coordinates
        console.log(r)
    })
    coords = [r[0], r[1]]
    console.log(coords)
    return coords
}

const Inicio = () => {

    // const [coords, setCoords] = useState([])

    // useEffect(()=>{
    //     getLoc().then(val => {
    //         setCoords(val)
    //     });
    // }, [])

    // console.log(coords)
    // let map = <div/>
    // if (coords != []) {
    //     // const coords = [-31.63176, -60.71262]
    //     console.log(coords)
    //     map =   <div id="mapid" style={{width: '100%', height: '100%'}}>
    //                 <MapContainer center={[-31.63176, -60.71262]} zoom={14} scrollWheelZoom={true} style={{height:'100%'}}>
    //                     <TileLayer
    //                         attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    //                         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    //                     />
    //                     {/* <Marker position={[-31.63176, -60.71262]}> */}
    //                     <Marker position={coords}>
    //                         <Popup>
    //                         Mi casa <br/> 
    //                         jeje<br/>
    //                         <NavLink to="/personal">
    //                             <a>personal</a>
    //                         </NavLink>
    //                         </Popup>
    //                     </Marker>
    //                 </MapContainer>
    //             </div>
    // }

    

    return(
        <div style={{width: '100%', height: '80vh'}}>
            <h1 style={{textAlign: "center"}}>
                Si estás leyendo esto, es porque sabes leer
                <br/>
                <br/>
                No sé leer no sé qué dice 😭😭
            </h1>

            {/* {map} */}
            <Map/>

        </div>
    )
}

export default Inicio