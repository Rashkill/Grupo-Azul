import React from 'react';
import { withRouter } from 'react-router-dom';
import { Tabs, PageHeader, Menu, Dropdown, Divider } from 'antd';
import { SettingFilled, EditFilled, DeleteFilled } from '@ant-design/icons';
import UserImg from '../../../images/image4-5.png'

const { TabPane } = Tabs;
const TabStyles = {
    background: 'white', 
    marginTop: -16, 
    borderLeft: '1px solid #f0f0f0', 
    borderRight: '1px solid #f0f0f0', 
    borderBottom: '1px solid #f0f0f0',
}

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
            <div className="drop-btn" style={{color: '#fa8c16'}}>
                <EditFilled />
                <p>Editar</p>
            </div>
        </Menu.Item>
        <Menu.Item key="delete">
            <div className="drop-btn" style={{color: '#8c8c8c'}}>
                <DeleteFilled />
                <p>Eliminar</p>
            </div>
        </Menu.Item>
    </Menu>
);


const BenefCard = (props) =>{

    const goBack = () =>{
        props.history.goBack()
    }

    return(
        <React.Fragment>
            <div className="header-bg prot-shadow">
                <PageHeader
                    className="site-page-header"
                    onBack={goBack}
                    title="Celina Melamedoff"
                    subTitle="Beneficiario n° 1"
                    style={{padding: 8}}
                />
                <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
                    <SettingFilled style={{fontSize: 20, color: '#9EA2A7'}}/>
                </Dropdown>
            </div>

            <div className="prot-shadow" style={{paddingLeft: 16, paddingRight: 16, paddingBottom: 16}}>
                <Tabs>
                    <TabPane tab="Perfil" key="1" style={TabStyles}>
                        <div className="profile-banner">
                            <img src={UserImg} style={{height: 125}}/>
                            <h1 className="profile-name">Celina Melamedoff</h1>
                            <p className="card-subtitle" style={{fontSize: 16}}>27-06320624-0</p>
                        </div>
                        
                        <Divider/>

                        <Divider orientation="left" plain>
                            <h1 className="big-title">
                                Datos Personales
                            </h1>
                        </Divider>

                        <div className="data">
                            <div className="data-col-wrap">
                                <div className="data-col">
                                    <p className="data-attr">Domicilio</p>
                                    <p className="data-attr">Fecha de Nacimiento</p>
                                    <p className="data-attr">Edad</p>
                                    <p className="data-attr">Teléfono</p>
                                    <p className="data-attr">E-Mail</p>
                                </div>
                                <div className="data-col">
                                    <p className="card-subtitle">Castellanos 1445</p>
                                    <p className="card-subtitle">XX / XX / XXXX</p>
                                    <p className="card-subtitle">XX</p>
                                    <p className="card-subtitle">+543483402494</p>
                                    <p className="card-subtitle">carloschiaruli@gmail.com</p>
                                </div>
                            </div>

                            <div className="data-col-wrap">
                                <div className="data-col">
                                    <p className="data-attr">Localidad</p>
                                    <p className="data-attr">Código Postal</p>
                                    <p className="data-attr">Enfermedades y Comorbilidades</p>

                                </div>
                                <div className="data-col">
                                    <p className="card-subtitle">Santa Fe</p>
                                    <p className="card-subtitle">3000</p>

                                </div>
                            </div>
                        </div>

                        <Divider/>

                        <Divider orientation="left" plain>
                            <h1 className="big-title">
                                Notas
                            </h1>
                        </Divider>
                            
                    </TabPane>
                    <TabPane tab="Seguimientos" key="2" style={TabStyles}>
                        
                    </TabPane>
                    <TabPane tab="Mapa" key="3" style={TabStyles}>
                        
                    </TabPane>
                </Tabs>

            </div>

        </React.Fragment>
    )
}

export default withRouter(BenefCard)