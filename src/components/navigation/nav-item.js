import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import './sidenav.css'

const NavItem = (props) => {
    
    if(window.location.href.includes(props.to)){
        return(
            <NavLink to={props.to}>
                <div className='nav-btn active-nav-btn'>
                    <div className="nav-imgwrap">
                        <img src={props.icon} alt="" className="nav-item-img"/>
                    </div>
                    <p>{props.title}</p>
                </div>
            </NavLink>
        )
    } else {
        return(
            <NavLink to={props.to}>
                <div className='nav-btn'>
                    <div className="nav-imgwrap">
                        <img src={props.icon} alt="" className="nav-item-img"/>
                    </div>
                    <p>{props.title}</p>
                </div>
            </NavLink>
        )
    }

    
}

export default withRouter(NavItem)