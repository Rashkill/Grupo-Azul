import React from 'react';
import { Row, Col, Menu, Dropdown } from 'antd';
import { SettingFilled, EditFilled, DeleteFilled } from '@ant-design/icons';
import UserImg from '../../../images/image3.png'
import './cards.css'

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

class AcompCard extends React.Component{
    
    render(){
        return(
            <div className="card">
                <Row>
                    <Col span={5} className="flex-center">
                        <img src={UserImg} alt=""/>
                    </Col>
                    <Col span={15}>
                        <Row>
                            <div className="card-title-container">
                                <h1 className="name-title">
                                    {this.props.title}
                                </h1>
                                <h3 className="card-subtitle">
                                    UDC Asignada: {this.props.udc}
                                </h3>
                            </div>
                        </Row>
                            <div className="card-contents">
                                <h3 className="card-subtitle">{this.props.domicilio}</h3>
                                <h3 className="card-subtitle">{this.props.email}</h3>
                                <h3 className="card-subtitle">{this.props.telefono}</h3>
                            </div>
                    </Col>
                    <Col span={4}>
                        <div className="card-r-col">
                            <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
                                <SettingFilled style={{fontSize: 20, color: '#9EA2A7'}}/>
                            </Dropdown>
                            <h4 style={{fontFamily: 'Inter'}}>
                            {/* ids: {this.props.id}  */}
                            Hora: ${this.props.price}
                            </h4>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}


export default AcompCard