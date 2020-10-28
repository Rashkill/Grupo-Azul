import React from 'react';
import { Menu, Dropdown, Divider, Row, Col, Input, Modal } from 'antd';
import { EllipsisOutlined, EditFilled, DeleteFilled } from '@ant-design/icons';
import JornadaImg from '../../../images/image5.png'


function JornadaCard (props) {

    const dropClick = ({ key }) => {
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
                    <img src={JornadaImg} alt=""/>
                </div>
                <div className="card-mid-col">
                    <Row>
                        <div className="card-title-container">
                            <h1 className="name-title-hoverless">
                                {props.title}
                            </h1>
                        </div>
                    </Row>
                        <div className="card-contents cols">
                            <div className="card-content-col">
                                <h3 className="card-subtitle">AGD: {props.agd}</h3>
                                <h3 className="card-subtitle">UCD: {props.ucd}</h3>
                            </div>
                            <div className="card-content-col">
                                <h3 className="card-subtitle">Ingreso: {props.ingreso}</h3>
                                <h3 className="card-subtitle">Egreso: {props.egreso}</h3>
                            </div>
                        </div>
                </div>
                <div className="card-right-col">
                    <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
                        <EllipsisOutlined style={{fontSize: 20, color: '#9EA2A7'}}/>
                    </Dropdown>
                    <h4 style={{fontFamily: 'Inter'}}>
                    {props.horas}hs
                    </h4>
                </div>
            </div>
        </div>
    )
}

export default JornadaCard