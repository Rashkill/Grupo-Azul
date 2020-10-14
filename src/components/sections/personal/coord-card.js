import React,{ useState, useEffect } from 'react';
import { Row, Col, Menu, Dropdown } from 'antd';
import { EllipsisOutlined, EditFilled, DeleteFilled } from '@ant-design/icons';
import UserImg from '../../../images/image3.png'
import '../../layout/cards.css'
import Axios from 'axios';


function CoordCard(props) {
    const [state, setState] = useState({
        ucd: { 
            Nombre: "...",
            Apellido: "..."
        }
    })

    const edit = () =>{
        const id = props.id
        props.edit(id);
    }
    const dropClick = ({ key }) => {
        //Key de <Menu.Item>
        if (key === 'edit') {
            const id = props.id
            props.edit(id);
        } else {
            var opcion = window.confirm('¿Estás seguro que deseas borrar al acompañante '+ props.title + '?');
            if(opcion){
                Axios.delete('http://localhost:4000/acomp/'+props.id ,{
                    headers: {
                        Accept: 'application/json'
                    }
                }).then(res=>{
                    console.log("auch");
                    props.refresh();
                })
            }
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
                <div className="drop-btn">
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
                            <h1 className="name-title">
                            {props.Nombre + " " + props.Apellido}
                            </h1>
                        </div>
                    </Row>
                </div>
                <div className="card-right-col">
                    <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
                        <EllipsisOutlined style={{fontSize: 20, color: '#9EA2A7'}}/>
                    </Dropdown>
                    <h4 style={{fontFamily: 'Inter'}}>
                    {/* ids: {this.props.id}  */}
                    ${props.PrecioMensual} / mes
                    </h4>
                </div>
            </div>
        </div>
    )
}


export default CoordCard