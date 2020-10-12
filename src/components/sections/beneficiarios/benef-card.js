import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Row, Col, Menu, Dropdown } from 'antd';
import { EllipsisOutlined, EditFilled, DeleteFilled } from '@ant-design/icons';
import UserImg from '../../../images/image4.png'
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
        <Menu.Item key="delete">
            <div className="drop-btn" style={{ color: 'red' }}>
                <DeleteFilled />
                <p>Eliminar</p>
            </div>
        </Menu.Item>
    </Menu>
);

const BenefCard = (props) =>{

    var datos;
    const getDatos = async () =>{
            const res = await fetch('http://localhost:4000/benefOnly/' + props.id);
            datos = await res.json();
    }
    
    const titleClick = () => {
        getDatos().then(() =>
            props.history.push({
                pathname: props.linkto,
                state: datos[0]
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