import React from 'react';
import { withRouter } from 'react-router-dom';
import { Tabs, PageHeader, Menu, Dropdown, Divider, Table, Row, Col, Button } from 'antd';
import { SettingFilled, EditFilled, DeleteFilled, PlusOutlined } from '@ant-design/icons';
import UserImg from '../../../images/image3.png'
import DataRow from  '../../layout/data-row'


const { TabPane } = Tabs;
const TabStyles = {
    background: 'white', 
    marginTop: -16, 
    borderLeft: '1px solid #f0f0f0', 
    borderRight: '1px solid #f0f0f0', 
    borderBottom: '1px solid #f0f0f0',
}

//click dropdown
const dropClick = ({ key }) => {
    //Key de <Menu.Item>
    if (key === 'edit') {
        alert('edit')
    } else {
        alert('delete')
    }
}

//dropdown
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

const AcompProfile = (props) =>{

    const info = props.location.state;
    //console.log(info);


    //COLUMNAS TABLA MONOTRIBUTO
    const compCols = [
        {
            title: 'N°',
            dataIndex: 'id',
            key: 'id'
        },
    
        {
            title: 'Comprobante',
            dataIndex: 'comprobante',
            key: 'comprobante'
        },

        {
            title: 'Fecha',
            dataIndex: 'fecha',
            key: 'fecha'
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
    
    //DATOS O VALORES EN TABLA MONOTRIBUTO
    const compData = [
        {
            id: '1',
            comprobante: 'comp1.pdf',
            fecha: "15/5/2020"
        },
        {
            id: '2',
            comprobante: 'comp2.pdf',
            fecha: "2/6/2020"
        },
        {
            id: '3',
            comprobante: 'comp-3.pdf',
            fecha: "3/7/2020"
        },
    ]


    //COLUMNAS TABLA CONTRATOS
    const contCols = [
        {
            title: 'N°',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: 'Contrato',
            dataIndex: 'contrato',
            key: 'contrato'
        },
        {
            title: 'Fecha',
            dataIndex: 'fecha',
            key: 'fecha'
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
    ]

    //VALORES TABLA CONTRATOS
    const contData = [
        {
            id: '2',
            contrato: 'contrato1.pdf',
            fecha: '1/10/2020'
        }
    ] 

    //Atrás
    const goBack = () =>{
        props.history.goBack()
    }
    if(!info){
        props.history.goBack();
        return(<div></div>)
    }
    else
    return(
        <React.Fragment>
            <div className="header-bg prot-shadow">
                <PageHeader
                    className="site-page-header"
                    onBack={goBack}
                    title={info.Nombre + " " + info.Apellido}
                    subTitle={"Acompañante n° " + info.Id}
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
                            <h1 className="profile-name">{info.Nombre + " " + info.Apellido}</h1>
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
                                <DataRow 
                                    title="Domicilio"
                                    value={info.Domicilio}
                                />
                                
                                <DataRow 
                                    title="Teléfono"
                                    value={info.Telefono}
                                />
                                
                                <DataRow 
                                    title="E-mail"
                                    value="asd"
                                />
                                
                                <DataRow 
                                    title="Valor Hora"
                                    value="asd"
                                />
                                
                                <DataRow 
                                    title="Unidad de cuidado actual"
                                    value="asd"
                                />
                            </div>


                            <div className="data-col-wrap">
                                <DataRow 
                                    title="Comp. de seguros"
                                    value="Nombre"
                                />

                                <DataRow 
                                    title="N° Póliza"
                                    value="asd"
                                />
                                
                                <DataRow 
                                    title="Banco"
                                    value="asd"
                                />

                                <DataRow 
                                    title="CBU / Alias"
                                    value="asd"
                                />
                                
                                <DataRow 
                                    title="Enfermedades y comorbilidades"
                                    value="asd"
                                />
                            </div>
                            
                        </div>

                        <Divider/>

                        {/* Tabla Pagos Monotributo */}
                        <Divider orientation="left" plain>
                            <h1 className="big-title">
                                Pagos Monotributo
                            </h1>
                        </Divider>
                        <div className="tablewrap">
                            <Table dataSource={compData} columns={compCols} bordered/>
                        </div>

                        <Divider/>

                        {/* Tabla Contratos */}
                        <Divider orientation="left" plain>
                            <h1 className="big-title">
                                Contratos
                            </h1>
                        </Divider>
                        <div className="tablewrap">
                            <Table dataSource={contData} columns={contCols} bordered/>
                        </div>
                            
                    </TabPane>
                    <TabPane tab="Mapa" key="2" style={TabStyles}>
                        
                    </TabPane>
                </Tabs>

            </div>

        </React.Fragment>
    )
}

export default withRouter(AcompProfile)