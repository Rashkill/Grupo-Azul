import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Row, Col, Menu, Dropdown } from 'antd';
import { EllipsisOutlined, EditFilled, DeleteFilled } from '@ant-design/icons';
import JornadaImg from '../../../images/image5.png'
import { createHashHistory } from 'history';
export const history = createHashHistory();

const dropClick = ({ key }) => {
    //Key de <Menu.Item>
    if (key === 'edit') {
        alert('edit')
    } else {
        alert('delete')
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

const JornadaCard = (props) =>{

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
                    8hs
                    </h4>
                </div>
            </div>
        </div>
    )
}


export default withRouter(JornadaCard)