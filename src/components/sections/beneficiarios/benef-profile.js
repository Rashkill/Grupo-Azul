import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Tabs, PageHeader, Menu, Dropdown, Divider, Table, Timeline, Row, Col, Button, Typography, Input } from 'antd';
import { SettingFilled, EditFilled, DeleteFilled, DeleteOutlined, PlusOutlined, MinusCircleOutlined, MinusOutlined, SaveFilled } from '@ant-design/icons';
import UserImg from '../../../images/image4-5.png'
import DataRow from  '../../layout/data-row'
import Axios from 'axios';
const { Paragraph } = Typography;
const { TextArea } = Input;

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
var delInfo = [];

const BenefCard = (props) =>{

    const info = props.location.state;
    //console.log(info);

    const [getSeguimientos, setSeguimientos] = useState(info?info.Seguimientos?info.Seguimientos:[]:[]);
    const [newInfo, setNewInfo] = useState({visible: false})
    const [inputVal, setInputVal] = useState('')
    const [getDelInfo, setDelInfo] = useState(delInfo)


    useEffect(() => {
        setDel();
    },[])

    const setDel = () =>{
        if(getSeguimientos){
            delInfo = [];
            for (let i = 0; i < getSeguimientos.length; i++) {
                    delInfo.push({delete: false})   
            }
            setDelInfo([...delInfo]);
        }
    }

    const onEndCreate = () => {

        let f = new Date();
        let d = String(f.getDate()).padStart(2,0);
        let m = String(f.getMonth() + 1).padStart(2,0);
        let a = f.getFullYear();
        let fecha = `${d}-${m}-${a}`;

        var arraySeguimientos = getSeguimientos;
        arraySeguimientos.push({label: fecha, text: inputVal})
        setSeguimientos([...arraySeguimientos]);

        setNewInfo({visible: false});
        setInputVal('');
        setDel();
    }

    const seguimiento = (
        <div style={{marginTop: 24, padding: 32, marginLeft: '-25%', width: '100%'}}>
            <Timeline mode='left' reverse>
                {getSeguimientos.map((i, index) =>{
                    return(
                        <Timeline.Item label={i.label} key={index}>
                            <Paragraph 
                                editable={{
                                    onChange:(text) => {
                                            var arraySeguimientos = getSeguimientos;
                                            arraySeguimientos[index].text = text;
                                            setSeguimientos([...arraySeguimientos]);
                                    },
                                    tooltip: 'Modificar seguimiento'
                                }}
                                copyable={{
                                    icon:[<DeleteOutlined/>],
                                    tooltips: getDelInfo.length>0? [getDelInfo[index].delete?'Cancelar Eliminación':'Eliminar Seguimiento', 
                                              !getDelInfo[index].delete?'No se eliminará':'Se eliminará al guardar'] : ['',''],
                                    onCopy:()=>{
                                        var delInfo = getDelInfo;
                                        delInfo[index].delete = !delInfo[index].delete;
                                        setDelInfo([...delInfo]);
                                        setSeguimientos([...getSeguimientos]);
                                    }
                                }}
                                delete={getDelInfo.length>0?getDelInfo[index].delete:false}
                            >
                                    {i.text}
                            </Paragraph>
                        </Timeline.Item>
                    )
                })}
                {/* NUEVO SEGUIMIENTO */}
                <Timeline.Item style={{display: newInfo.visible ? "block" : "none"}} label="Nuevo Seguimiento" key="n">
                    <TextArea autoFocus={true}
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        onPressEnter={onEndCreate}
                    >
                    </TextArea>
                    <a onClick={onEndCreate}>Aceptar</a>
                </Timeline.Item>
            </Timeline>
        </div>
    );


    const saveToBD = () => {
        //const jsonArray = JSON.stringify(arraySeguimientos);
        
        var arraySeguimientos = getSeguimientos;
        for (let i = 0; i < getDelInfo.length; i++) {
            if(getDelInfo[i].delete){
                arraySeguimientos.splice(i,1);
                delInfo.splice(i,1);
            }
            setSeguimientos([...arraySeguimientos]);
            setDelInfo([...delInfo]);
        }

        Axios.post('http://localhost:4000/updBenefSeg/' + info.Id, getSeguimientos, {
                headers: {
                    Accept: 'application/json'
                }
        })
        info.Seguimientos = getSeguimientos;
        //console.log(jsonArray);
    }

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
                    subTitle={"Beneficiario n° " + info.Id}
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
                            <p className="card-subtitle" style={{fontSize: 16}}>{info.CUIL}</p>
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
                                    title="DNI / CUIL"
                                    value={info.CUIL}
                                />
                                <DataRow
                                    title="Domicilio"
                                    value={info.Domicilio}
                                />
                                <DataRow
                                    title="Fecha de Nacimiento"
                                    value={info.FechaNacimiento}
                                />
                                <DataRow
                                    title="Edad"
                                    value=""
                                />
                                <DataRow
                                    title="Teléfono"
                                    value={info.Telefono}
                                />
                                <DataRow
                                    title="E-mail"
                                    value={info.Email}
                                />

                            </div>

                            <div className="data-col-wrap">

                                <DataRow
                                    title="Localidad"
                                    value={info.Localidad}
                                />
                                <DataRow
                                    title="Código Postal"
                                    value={info.CodigoPostal}
                                />
                                <DataRow
                                    title="Enfermedades y comorbilidades"
                                    value={info.Enfermedades}
                                />

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
                            <Button 
                                hidden={info?info.Seguimientos===getSeguimientos?true:false:true} 
                                onClick={saveToBD} 
                                icon={<SaveFilled/>}
                            >
                                Guardar Cambios
                            </Button>
                            <Button 
                                block type="primary" 
                                style={{backgroundColor: newInfo.visible?'#FF4F33':'#33ACFF'}}
                                icon={newInfo.visible?<MinusOutlined/>:<PlusOutlined/>} 
                                onClick={()=>{
                                    setNewInfo({visible: !newInfo.visible});
                                    setInputVal('');
                                }}
                            >
                                {newInfo.visible?"Cancelar Nuevo":"Nuevo"}
                            </Button>
                        </div>
                        {seguimiento}
                    </TabPane>
                    <TabPane tab="Mapa" key="3" style={TabStyles}>
                        
                    </TabPane>
                </Tabs>

            </div>

        </React.Fragment>
    )
}

export default withRouter(BenefCard)