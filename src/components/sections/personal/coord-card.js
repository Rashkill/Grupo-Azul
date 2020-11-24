import React,{ useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col, Menu, Dropdown } from 'antd';
import { EllipsisOutlined, EditFilled, DeleteFilled } from '@ant-design/icons';
import UserImg from '../../../images/image3.png'
import '../../layout/cards.css'
import Axios from 'axios';
import { createHashHistory } from 'history';
export const history = createHashHistory();

function CoordCard(props) {

    var datos;
    const getDatos = async () =>{
        const fields = "Id, Nombre, Apellido, DNI, CUIL, EntidadBancaria, CBU, Domicilio, ValorMes"
        const res = await fetch('http://localhost:4000/getCoordOnly/' + props.id + "/" + fields);
        datos = await res.json();
    }
    
    const titleClick = () => {
        getDatos().then(() =>
            props.history.push({
                pathname: props.linkto,
                state: datos[0]
            })
        )
    }


    const dropClick = ({ key }) => {
        //Key de <Menu.Item>
        if (key === 'edit') {
            props.OnEdit(props.id);
        } else {
            props.OnDelete(props.id);
        }
    }
    
    const menu = (
        <Menu onClick={dropClick}>
            {/* la key es como se diferencian las opciones del drop, en la funcion dropClick*/}
            <Menu.Item key="edit"> 
                <div className="drop-btn">
                    <EditFilled />
                    <p>Editar</p>
                </div>
            </Menu.Item>
            <Menu.Item key="delete">
                <div className="drop-btn" style={{color: "red"}}>
                    <DeleteFilled />
                    <p>Eliminar</p>
                </div>
            </Menu.Item>
        </Menu>
    );

    return(
        <div className="card">
            <div className="card-row">
                <div className="card-left-col">
                    <img src={UserImg} alt=""/>
                </div>
                <div className="card-mid-col">
                    <Row>
                        <div className="card-title-container">
                            <h1 className="name-title" onClick={titleClick}>
                            {props.Nombre + " " + props.Apellido}
                            </h1>
                        </div>
                    </Row>
                    <div className="card-contents">
                        <h3 className="card-subtitle">{props.Domicilio}</h3>
                    </div>
                </div>
                <div className="card-right-col">
                    <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
                        <EllipsisOutlined style={{fontSize: 20, color: '#9EA2A7'}}/>
                    </Dropdown>
                    <h4 style={{fontFamily: 'Inter'}}>
                    {/* ids: {this.props.id}  */}
                    ${props.ValorMes} / mes
                    </h4>
                </div>
            </div>
        </div>
    )
}


export default withRouter(CoordCard)