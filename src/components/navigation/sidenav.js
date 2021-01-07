import React from 'react';
import './sidenav.css'
import NavItem from './nav-item.js'
import Logo from '../../images/Logo1.png'
import Home from '../../images/home.png'
import UserGroup from '../../images/personal.png'
import UserWithHouse from '../../images/beneficiario.png'
import Clock from '../../images/clock.png'
import Document from '../../images/document.png'

const Sidenav = (props) => {
    return(
        <nav className="sidenav">
            <div className="sidenav-imgwrap">
                <img src="https://github.com/Rashkill/Grupo-Azul-React/blob/master/src/images/Logo1.png?raw=true" className="sidenav-img" alt=""/>
            </div>
            <NavItem title="Inicio" to="/inicio" icon={Home}/>
            <NavItem title="Personal" to="/personal" or="acompprofile" or2="coordprofile" icon={UserGroup}/>
            <NavItem title="Beneficiarios" to="/beneficiarios" or="benefprofile" icon={UserWithHouse}/>
            <NavItem title="Jornadas" to="/jornadas" icon={Clock}/>
            <NavItem title="Liquidaciones" to="/liquidaciones" or="liq-preview" icon={Document}/>
        </nav>
    )
}

export default Sidenav