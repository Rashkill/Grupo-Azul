import React, { useState, useEffect } from 'react'
import { NavLink, withRouter } from 'react-router-dom';
import axios from 'axios'

const Inicio = () => {  

    return(
        <div style={{width: '100%', height: '80vh'}}>
            <h1 style={{textAlign: "center"}}>
                Si estás leyendo esto, es porque sabes leer
                <br/>
                <br/>
                No sé leer no sé qué dice 😭😭
            </h1>
        </div>
    )
}

export default Inicio