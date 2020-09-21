import React from 'react';
import { withRouter } from 'react-router-dom';
import { Tabs, PageHeader, Menu, Dropdown, Divider, Table, Timeline, Row, Col, Button } from 'antd';
import { SettingFilled, EditFilled, DeleteFilled, PlusOutlined } from '@ant-design/icons';
import UserImg from '../../../images/image4-5.png'

const alertRow = (fecha) =>{
    alert(fecha)
}




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

    const columns = [
        {
            title: 'Fecha',
            dataIndex: 'fecha',
            key: 'fecha'
        },
    
        {
            title: 'PDF',
            dataIndex: 'pdf',
            key: 'pdf'
        },
    
        {
            title: 'Acciones',
            dataIndex: 'acciones',
            key: 'acciones',
            render: (text, record) => (
                <div>
                    <a>Abrir </a>
                    <a>Editar </a>
                    <a>Eliminar </a>
                </div>
            )
        }
    ];
    
    const data = [
        {
            fecha: "15/5",
            pdf: "archivo1.pdf"
        },
        {
            fecha: "16/5",
            pdf: "archivo2.pdf"
        },
        {
            fecha: "15/5",
            pdf: "archivo1.pdf"
        },
        {
            fecha: "16/5",
            pdf: "archivo2.pdf"
        },
        {
            fecha: "15/5",
            pdf: "archivo1.pdf"
        },
        {
            fecha: "16/5",
            pdf: "archivo2.pdf"
        }
    ]

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
                        <div className="tablewrap">
                            <Table dataSource={data} columns={columns} bordered/>
                        </div>
                            
                    </TabPane>
                    <TabPane tab="Seguimientos" key="2" style={TabStyles}>
                        <div className="buttons">
                            <Button block type="secondary" icon={<EditFilled/>}>Editar</Button>
                            <Button block type="primary" icon={<PlusOutlined/>}>Nuevo</Button>
                        </div>
                        <div 
                        style={{marginTop: 24, padding: 32, marginLeft: '-25%', width: '100%'}}
                        >
                            <Timeline mode='left' reverse>
                                <Timeline.Item label="2015-09-01">Seguimiento n°1</Timeline.Item>
                                <Timeline.Item label="2015-09-03">Lorem Ipsum es un texto de marcador de posición comúnmente utilizado en las industrias gráficas, gráficas 
                                y editoriales para previsualizar diseños y maquetas visuales.</Timeline.Item>
                                <Timeline.Item label="2015-09-04">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Timeline.Item>
                            </Timeline>

                        </div>
                    </TabPane>
                    <TabPane tab="Mapa" key="3" style={TabStyles}>
                        
                    </TabPane>
                </Tabs>

            </div>

        </React.Fragment>
    )
}

export default withRouter(BenefCard)