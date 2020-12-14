import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Modal, Upload, Tabs, PageHeader, Menu, Dropdown, Divider, Table, Timeline, Row, Col, Button, Typography, Input, notification, Popconfirm } from 'antd';
import { SettingFilled, EditFilled, DeleteFilled, DeleteOutlined, CheckCircleOutlined, AlertOutlined, UploadOutlined, SaveOutlined, FileAddOutlined } from '@ant-design/icons';
import UserImg from '../../../images/image3.png'
import DataRow from  '../../layout/data-row'

import VisorPDF from '../util/visorPDF'
import Map from '../util/Map'

import Axios from 'axios';

const { TabPane } = Tabs;
const TabStyles = {
    background: 'white', 
    marginTop: -16, 
    borderLeft: '1px solid #f0f0f0', 
    borderRight: '1px solid #f0f0f0', 
    borderBottom: '1px solid #f0f0f0',
}
const botones = {
    display: 'flex',
    flexDirection: 'row'
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

let maxMonoItems = 0, maxConItems = 0;
const maxMonoRows = 5, maxConRows = 2;
var rowMonoOffset = 0, rowConOffset = 0;

function getFecha(){
    let f = new Date();
    let d = String(f.getDate()).padStart(2,0);
    let m = String(f.getMonth() + 1).padStart(2,0);
    let a = f.getFullYear();
    return `${d}-${m}-${a}`;
}
const AcompProfile = (props) =>{

    var info = []; 
    info = props.location.state;

    const [dataSourceMono, setDataSourceMono] = useState([])
    const [archivosMono, setArchivosMono] = useState([])

    const [dataSourceCon, setDataSourceCon] = useState([])
    const [archivosCon, setArchivosCon] = useState([])

    const [pdfViewer, setPdfViewer] = useState({
        visible: false,
        fileURL: null,
        fileName: ""
    })


    //Obtiene los archivos Monotributo
    const getPdfsMono = async() =>{
        try{
            //OBTENER PDFs MONOTRIBUTO
            const resMonoCant = await fetch('http://localhost:4000/getMonoAcomp/Id/' + props.location.state.Id);
            const monoCant = await resMonoCant.json();
            maxMonoItems = monoCant.length;

            const resMono = await fetch('http://localhost:4000/getMonoAcomp/Id,Fecha,NombreArchivo/' + props.location.state.Id + '/' + maxMonoRows + '/' + rowMonoOffset);
            const mono = await resMono.json();

            var dataMono = [];
            mono.forEach((e, index) => {
                dataMono.push({
                    id: index+1,
                    fecha: e.Fecha, 
                    comprobante: e.NombreArchivo, 
                    key: e.Id
                });
            });
            setDataSourceMono([...dataMono]);
        } 
        catch(e){console.log(e)}
    }

    //Se asigna o elimina el archivo
    const ArchivoPDFMono = {
        onRemove: file => {
                let fileL = archivosMono; fileL.splice(archivosMono.findIndex(x => x === file, 1));
                setArchivosMono([...fileL]);
                return true;
        },
        beforeUpload: file => {
            let fileL = archivosMono; fileL.push(file);
            setArchivosMono([...fileL]);
          return false;
        }
    };

    const subirArchivoMono = async(index) =>{
        try{
            var datos = new FormData();
            datos.set('IdAcompañante', info.Id)
            datos.set('Fecha', getFecha());
            datos.set('Archivo', archivosMono[index]);
            datos.set('NombreArchivo', archivosMono[index].name);
            //Se guarda el array en la base de datos
            await Axios.post('http://localhost:4000/addMonoAcomp', datos, {
                headers: {
                    Accept: 'application/json'
                }
            })
            return true;
        } catch(e){ return false };
    }

    const guardarMonotributos = async() =>{
        var f = archivosMono.length;
        for (let index = 0; index < archivosMono.length; index++) {
            let v = await subirArchivoMono(index);
            if(!v) f--;
        }
        if(f > 0){
            openNotification(
                archivosMono.length>1?'Monotributos creados'
                    :'Monotributo creado',
                archivosMono.length>1?`Los archivos fueron creados correctamente!(${f}/${archivosMono.length})`
                    :'El archivo se creó correctamente',
                true
            )
            setArchivosMono([]);
            getPdfsMono();
        }
        else{
            openNotification(
                'Error al crear monotributo',
                'No fue posible subir los archivos, compruebe que el PDF sea valido',
                false
            )
        }
        return f;
    }

    const getPDFBlob = async(id) =>{
        const res = await fetch('http://localhost:4000/getMonoAcompOnly/Archivo/' + id);
        const datos = await res.json();
        console.log(id, datos);
        return new Blob([Buffer.from(datos[0].Archivo.data)], {type: "application/pdf"})
    }

    const updMonotributo = (record) =>{
        let upload = document.createElement("input");
        upload.type = "file";
        upload.accept = "application/pdf"
        upload.multiple = false;
        upload.click();
        upload.onchange=(e)=>{
            var datos = new FormData();
            datos.set('Fecha', getFecha());
            datos.set('Archivo', e.target.files[0]);
            datos.set('NombreArchivo', e.target.files[0].name);
            //Se guarda el array en la base de datos
            Axios.post('http://localhost:4000/updMonoAcomp/' + record.key, datos, {
                headers: {
                    Accept: 'application/json'
                }
            }).then(()=>{
                openNotification(
                    'Monotributo actualizado',
                    `El archivo ${record.pdf} fue sustituido exitosamente`,
                    true
                )
                getPdfsMono();
            })
        };
    }

    const delMonotributo = (record) =>{
        Axios.delete('http://localhost:4000/monoAcomp/' + record.key).then(()=>{
            openNotification(
                'Archivo eliminado',
                `Pago de monotributo eliminado exitosamente`,
                true
            )
            getPdfsMono();
        })
    }

    useEffect(() => {
        if(info){
            getPdfsMono();
            getPdfsCon();
        }
        return () =>{
            rowMonoOffset = 0;
        }
    },[info])

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
                    <a onClick={async()=>{
                        let url = URL.createObjectURL(await getPDFBlob(record.key));
                        setPdfViewer({
                            fileURL: url,
                            fileName: `${record.comprobante}`,
                            visible: true
                        })
                    }}>Abrir </a>

                    <Popconfirm
                        title={`Esta accion sobreescribirá el archivo actual ¿Desea continuar?`}
                        okText= 'Si' cancelText= 'No'
                        onConfirm={()=>updMonotributo(record)}
                    >
                        <a>Editar </a>
                    </Popconfirm>

                    <Popconfirm
                        title={`¿Desea eliminar el archivo ${record.comprobante}?`}
                        okText= 'Si' cancelText= 'No'
                        onConfirm={()=>delMonotributo(record)}
                    >
                        <a>Eliminar </a>
                    </Popconfirm>
                </div>
            )
        }
    ];

    //Obtiene los archivos Contrato
    const getPdfsCon = async() =>{
        try{
            const resConCant = await fetch('http://localhost:4000/getConAcomp/Id/' + props.location.state.Id);
            const conCant = await resConCant.json();
            maxConItems = conCant.length;

            const resCon = await fetch('http://localhost:4000/getConAcomp/Id,Fecha,NombreArchivo/' + props.location.state.Id + '/' + maxMonoRows + '/' + rowMonoOffset);
            const con = await resCon.json();

            var dataCon = [];
            con.forEach((e, index) => {
                dataCon.push({
                    id: index+1,
                    fecha: e.Fecha, 
                    contrato: e.NombreArchivo, 
                    key: e.Id});
            });
            setDataSourceCon([...dataCon]);
        } 
        catch(e){console.log(e)}
    }

    //Se asigna o elimina el archivo
    const ArchivoPDFCon = {
        onRemove: file => {
                let fileL = archivosCon; fileL.splice(archivosCon.findIndex(x => x === file, 1));
                setArchivosCon([...fileL]);
                return true;
        },
        beforeUpload: file => {
            let fileL = archivosCon; fileL.push(file);
            setArchivosCon([...fileL]);
          return false;
        }
    };

    const subirArchivoCon = async(index) =>{
        try{
            var datos = new FormData();
            datos.set('IdAcompañante', info.Id)
            datos.set('Fecha', getFecha());
            datos.set('Archivo', archivosCon[index]);
            datos.set('NombreArchivo', archivosCon[index].name);
            //Se guarda el array en la base de datos
            await Axios.post('http://localhost:4000/addConAcomp', datos, {
                headers: {
                    Accept: 'application/json'
                }
            })
            return true;
        } catch(e){ return false };
    }

    const guardarContratos = async() =>{
        var f = archivosCon.length;
        for (let index = 0; index < archivosCon.length; index++) {
            let v = await subirArchivoCon(index);
            if(!v) f--;
        }
        if(f > 0){
            openNotification(
                archivosCon.length>1?'Contratos creados'
                    :'Contrato creado',
                archivosCon.length>1?`Los archivos fueron creados correctamente!(${f}/${archivosCon.length})`
                    :'El archivo se creó correctamente',
                true
            )
            setArchivosCon([]);
            getPdfsCon();
        }
        else{
            openNotification(
                'Error al crear el contrato',
                'No fue posible subir los archivos, compruebe que el PDF sea valido',
                false
            )
        }
        return f;
    }

    const getPDFBlobCon = async(id) =>{
        const res = await fetch('http://localhost:4000/getConAcompOnly/Archivo/' + id);
        const datos = await res.json();
        console.log(id, datos);
        return new Blob([Buffer.from(datos[0].Archivo.data)], {type: "application/pdf"})
    }

    const updContrato = (record) =>{
        let upload = document.createElement("input");
        upload.type = "file";
        upload.accept = "application/pdf"
        upload.multiple = false;
        upload.click();
        upload.onchange=(e)=>{
            var datos = new FormData();
            datos.set('Fecha', getFecha());
            datos.set('Archivo', e.target.files[0]);
            datos.set('NombreArchivo', e.target.files[0].name);
            //Se guarda el array en la base de datos
            Axios.post('http://localhost:4000/updConAcomp/' + record.key, datos, {
                headers: {
                    Accept: 'application/json'
                }
            }).then(()=>{
                openNotification(
                    'Contrato actualizado',
                    `El archivo ${record.pdf} fue sustituida exitosamente`,
                    true
                )
                getPdfsCon();
            })
        };
    }

    const delContrato = (record) =>{
        Axios.delete('http://localhost:4000/conAcomp/' + record.key).then(()=>{
            openNotification(
                'Archivo eliminado',
                `Contrato eliminado exitosamente`,
                true
            )
            getPdfsCon();
        })
    }

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
                    <a onClick={async()=>{
                        let url = URL.createObjectURL(await getPDFBlobCon(record.key));
                        setPdfViewer({
                            fileURL: url,
                            fileName: `${record.contrato}`,
                            visible: true
                        })
                    }}>Abrir </a>

                    <Popconfirm
                        title={`Esta accion sobreescribirá el archivo actual ¿Desea continuar?`}
                        okText= 'Si' cancelText= 'No'
                        onConfirm={()=>updContrato(record)}
                    >
                        <a>Editar </a>
                    </Popconfirm>

                    <Popconfirm
                        title={`¿Desea eliminar el archivo ${record.contrato}?`}
                        okText= 'Si' cancelText= 'No'
                        onConfirm={()=>delContrato(record)}
                    >
                        <a>Eliminar </a>
                    </Popconfirm>
                </div>
            )
        }
    ]

    //Atrás
    const goBack = () =>{
        if(archivosMono.length<=0 && archivosCon.length<=0){
            props.history.goBack()
        }else{
            Modal.confirm({
                title:'¿Desea volver atrás?',
                content: 'Se perderán los cambios no guardados',
                okText: 'Si', cancelText: 'No',
                onOk:(()=>{props.history.goBack()})
            })
        }
    }

    //Notificacion (duh)
    const openNotification = (msg, desc, succeed) => {
        notification.open({
            message: msg,
            description: desc,
            icon: succeed ? 
            <CheckCircleOutlined style={{ color: '#52C41A' }} /> : 
            <AlertOutlined style={{ color: '#c4251a' }} />
        });
    };
    if(!info){
        props.history.goBack();
        return(<div></div>)
    }
    else
    return(
        <React.Fragment>
            <VisorPDF
                fileURL={pdfViewer.fileURL}
                fileName={pdfViewer.fileName}
                visible={pdfViewer.visible}
                onCancel={()=> setPdfViewer({visible: false})}
            />

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
                                    title="Domicilio"
                                    value={info.Domicilio}
                                />
                                
                                <DataRow 
                                    title="Teléfono"
                                    value={info.Telefono}
                                />
                                
                                <DataRow 
                                    title="E-mail"
                                    value={info.Email}
                                />
                                
                                <DataRow 
                                    title="Valor Hora"
                                    value={info.ValorHora}
                                />
                                
                            </div>


                            <div className="data-col-wrap">
                                <DataRow 
                                    title="Comp. de seguros"
                                    value={info.NombreSeguros}
                                />

                                <DataRow 
                                    title="N° Póliza"
                                    value={info.NumeroPoliza}
                                />
                                
                                <DataRow 
                                    title="Banco"
                                    value={info.EntidadBancaria}
                                />

                                <DataRow 
                                    title="CBU / Alias"
                                    value={info.CBU}
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
                        <div className="botones-wrap">
                                <Upload {...ArchivoPDFMono} 
                                    id="ArchivoPDF" 
                                    accept="application/pdf"
                                    multiple={true}
                                    fileList={archivosMono}
                                >
                                    <Button type="primary" icon={<FileAddOutlined />}>Elegir Archivo/s</Button>
                                </Upload>
                                <Button 
                                    type="link"
                                    icon={<UploadOutlined />} 
                                    onClick={guardarMonotributos}
                                    style={{color:"green"}}
                                    hidden={archivosMono.length<=0}
                                >
                                    Guardar Archivos
                                </Button>
                            </div>
                            <Table 
                                dataSource={dataSourceMono} 
                                columns={compCols} 
                                bordered 
                                pagination={{
                                    style:{visibility:maxMonoItems<=maxMonoRows?"hidden":"visible"}, 
                                    defaultCurrent: 1,
                                    total: maxMonoItems,
                                    pageSize: maxMonoRows,
                                    onChange:(page)=>{rowMonoOffset=maxMonoRows*(page-1); getPdfsMono();}
                                }}
                            />
                        </div>

                        <Divider/>

                        {/* Tabla Contratos */}
                        <Divider orientation="left" plain>
                            <h1 className="big-title">
                                Contratos
                            </h1>
                        </Divider>
                        <div className="tablewrap">
                        <div className="botones-wrap">
                                <Upload {...ArchivoPDFCon} 
                                    id="ArchivoPDF" 
                                    accept="application/pdf"
                                    multiple={true}
                                    fileList={archivosCon}
                                >
                                    <Button type="primary" icon={<FileAddOutlined />}>Elegir Archivo/s</Button>
                                </Upload>
                                <Button 
                                    type="link"
                                    icon={<UploadOutlined />} 
                                    onClick={guardarContratos}
                                    style={{color:"green"}}
                                    hidden={archivosCon.length<=0}
                                >
                                    Guardar Archivos
                                </Button>
                            </div>
                            <Table 
                                dataSource={dataSourceCon} 
                                columns={contCols} 
                                bordered 
                                pagination={{
                                    style:{visibility:maxConItems<=maxConRows?"hidden":"visible"}, 
                                    defaultCurrent: 1,
                                    total: maxConItems,
                                    pageSize: maxConRows,
                                    onChange:(page)=>{rowConOffset=maxConRows*(page-1); getPdfsCon();}
                                }}
                            />
                        </div>
                            
                    </TabPane>
                    <TabPane tab="Mapa" key="2" style={TabStyles}>
                        <div style={{height: 500}}>
                            <Map
                                markerPrincipal={"Acompañante"}
                                coordPrincipal={[info.Latitud, info.Longitud]}
                                buscarCoords={"Beneficiario"}
                            />
                        </div>
                    </TabPane>
                </Tabs>

            </div>

        </React.Fragment>
    )
}

export default withRouter(AcompProfile)