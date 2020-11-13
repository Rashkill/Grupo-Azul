import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Row, Col, Menu, Dropdown } from 'antd';
import { EllipsisOutlined, EditFilled, DeleteFilled } from '@ant-design/icons';
import UserImg from '../../../images/image4.png'
import { createHashHistory } from 'history';
export const history = createHashHistory();

const BenefCard = (props) =>{

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
            <Menu.Item key="edit"> 
                        <div className="drop-btn">
                            <EditFilled />
                            <p>Editar</p>
                        </div>
            </Menu.Item>
            <Menu.Item key="delete">
                <div className="drop-btn" style={{ color: 'red' }}>
                    <DeleteFilled />
                    <p>Eliminar</p>
                </div>
            </Menu.Item>
        </Menu>
    );

    var info = [];
    const getDatos = async () =>{
        const fields = "Id, Nombre, Apellido, DNI, CUIL, FechaNacimiento, Domicilio, Localidad, CodigoPostal, Email, Telefono, Enfermedades, IdCoordinador"
        const res = await fetch('http://localhost:4000/getBenefOnly/' + props.id + '/' + fields);
        const datos = await res.json();
        info = datos[0];
        info.Seguimientos = [];
    }
    
    const titleClick = () => {
        getDatos().then(() =>
            props.history.push({
                pathname: props.linkto,
                state: info
            }))
    }
    

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
                                {props.title}
                            </h1>
                        </div>
                    </Row>
                        <div className="card-contents">
                            <h3 className="card-subtitle">{props.domicilio}</h3>
                            <h3 className="card-subtitle">{props.telefono}</h3>
                        </div>
                </div>
                <div className="card-right-col">
                    <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
                        <EllipsisOutlined style={{fontSize: 20, color: '#9EA2A7'}}/>
                    </Dropdown>
                    <h4 style={{fontFamily: 'Inter'}}>
                    {/* ids: {this.props.id}  */}
                    </h4>
                </div>
            </div>
        </div>
    )
}


export default withRouter(BenefCard)