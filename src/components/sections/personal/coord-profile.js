import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Spin, Modal, Upload, Tabs, PageHeader, Menu, Dropdown, Divider, Table, Timeline, Row, Col, Button, Typography, Input, notification, Popconfirm } from 'antd';
import { SaveFilled, CloseCircleOutlined, SettingFilled, EditFilled, DeleteFilled, DeleteOutlined, CheckCircleOutlined, AlertOutlined, UploadOutlined, SaveOutlined, FileAddOutlined } from '@ant-design/icons';
import CoordImg from '../../../images/image3_1.png'
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

let maxMonoItems = 0, maxConItems = 0;
const maxMonoRows = 5, maxConRows = 2;
var rowMonoOffset = 0, rowConOffset = 0;
var fileBlobAFIP, fileUrlAFIP;
var fileBlobCV, fileUrlCV;

function getFecha(){
    let f = new Date();
    let d = String(f.getDate()).padStart(2,0);
    let m = String(f.getMonth() + 1).padStart(2,0);
    let a = f.getFullYear();
    return `${d}-${m}-${a}`;
}

const CoordProfile = (props) =>{

    let abortController = new AbortController();
    const [edit, setEdit] = useState({
        visible: false,
        loading: true
    });
    const [pdf1, setPdf1] = useState({
        visible: false,
        fileList: []
    })
    const [pdf2, setPdf2] = useState({
        visible: false,
        fileList: []
    })
    const [editButton, setEditButton] = useState(true);
    const [info, setInfo] = useState(props.location.state);
    const [coordInfo, setCoordInfo] = useState("")
    let lastInfo = new FormData();

    const [dataSourceMono, setDataSourceMono] = useState([])
    const [archivosMono, setArchivosMono] = useState([])

    const [dataSourceCon, setDataSourceCon] = useState([])
    const [archivosCon, setArchivosCon] = useState([])

    const [pdfViewer, setPdfViewer] = useState({
        visible: false,
        fileURL: null,
        fileName: ""
    })

    const getInfo = async () =>{
        const fields = "Id, Nombre, Apellido, DNI, CUIL, EntidadBancaria, CBU, Domicilio, Localidad, CodigoPostal, ValorMes, Latitud, Longitud"
        const res = await fetch('http://localhost:4000/getCoordOnly/' + props.location.state.Id + "/" + fields);
        const datos = await res.json();
        setInfo(datos[0]);
        setPdf1({fileList: []});
        setPdf2({fileList: []});
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

    //#region MONOTRIBUTOS

    //Obtiene los archivos Monotributo
    const getPdfsMono = async() =>{
        try{
            //OBTENER PDFs MONOTRIBUTO
            const resMonoCant = await fetch('http://localhost:4000/getMonoCoord/Id/' + props.location.state.Id);
            const monoCant = await resMonoCant.json();
            maxMonoItems = monoCant.length;

            const resMono = await fetch('http://localhost:4000/getMonoCoord/Id,Fecha,NombreArchivo/' + props.location.state.Id + '/' + maxMonoRows + '/' + rowMonoOffset);
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
                let fileL = archivosMono; fileL.splice(archivosMono.findIndex(x => x === file), 1);
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
            datos.set('IdCoordinador', info.Id)
            datos.set('Fecha', getFecha());
            datos.set('Archivo', archivosMono[index]);
            datos.set('NombreArchivo', archivosMono[index].name);
            //Se guarda el array en la base de datos
            await Axios.post('http://localhost:4000/addMonoCoord', datos, {
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
        const res = await fetch('http://localhost:4000/getMonoCoordOnly/Archivo/' + id);
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
            Axios.post('http://localhost:4000/updMonoCoord/' + record.key, datos, {
                headers: {
                    Accept: 'application/json'
                }
            }).then(()=>{
                openNotification(
                    'Monotributo actualizado',
                    `El archivo ${record.pdf} fue sustituida exitosamente`,
                    true
                )
                getPdfsMono();
            })
        };
    }

    const delMonotributo = (record) =>{
        Axios.delete('http://localhost:4000/monoCoord/' + record.key).then(()=>{
            openNotification(
                'Archivo eliminado',
                `Pago de monotributo eliminado exitosamente`,
                true
            )
            getPdfsMono();
        })
    }


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
    //#endregion

    //#region CONTRATOS

    //Obtiene los archivos Contrato
    const getPdfsCon = async() =>{
        try{
            const resConCant = await fetch('http://localhost:4000/getConCoord/Id/' + props.location.state.Id);
            const conCant = await resConCant.json();
            maxConItems = conCant.length;

            const resCon = await fetch('http://localhost:4000/getConCoord/Id,Fecha,NombreArchivo/' + props.location.state.Id + '/' + maxConRows + '/' + rowConOffset);
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
                let fileL = archivosCon; fileL.splice(archivosCon.findIndex(x => x === file), 1);
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
            datos.set('IdCoordinador', info.Id)
            datos.set('Fecha', getFecha());
            datos.set('Archivo', archivosCon[index]);
            datos.set('NombreArchivo', archivosCon[index].name);
            //Se guarda el array en la base de datos
            await Axios.post('http://localhost:4000/addConCoord', datos, {
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
        const res = await fetch('http://localhost:4000/getConCoordOnly/Archivo/' + id);
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
            Axios.post('http://localhost:4000/updConCoord/' + record.key, datos, {
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
        Axios.delete('http://localhost:4000/conCoord/' + record.key).then(()=>{
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

    //VALORES TABLA CONTRATOS
    const contData = [
        {
            id: '2',
            contrato: 'contrato1.pdf',
            fecha: '1/10/2020'
        }
    ] 

    //#endregion
    
    //Atrás
    const goBack = () =>{
        if((archivosMono.length<=0 && archivosCon.length<=0) && !edit.visible){
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

    //Obtiene los archivos
    const getPdf = async(id) =>{
        try{
            const res = await fetch('http://localhost:4000/getAcompOnly/'+ id +'/ConstanciaAFIP,CV', {signal: abortController.signal});
            const datos = await res.json();

            fileBlobAFIP = new Blob([Buffer.from(datos[0].ConstanciaAFIP)], {type: "application/pdf"})
            fileUrlAFIP = URL.createObjectURL(fileBlobAFIP)
            
            fileBlobCV = new Blob([Buffer.from(datos[0].CV)], {type: "application/pdf"})
            fileUrlCV = URL.createObjectURL(fileBlobCV)
        } 
        catch(e){console.log(e)}
    }

    //Se asigna o elimina el archivo
    const propsConstanciaAFIP = {
        onRemove: file => {
            setPdf1({fileList: []})
            return true;
        },
        beforeUpload: file => {
            let fileL = []; fileL.push(file);
            setPdf1({fileList: fileL})
          return false;
        }
    };

    const propsCV = {
        onRemove: file => {
            setPdf2({fileList: []})
                return true;
        },
        beforeUpload: file => {
            let fileL = []; fileL.push(file);
            setPdf2({fileList: fileL})
          return false;
        }
    };

    //Se llama al presionar el boton 'Eliminar'
    const onDelete = () => {
        Modal.confirm({
            title:'¿Realmente desea eliminar este elemento?',
            content: 'Esta acción no se puede deshacer.',
            okText: 'Si', cancelText: 'No',
            onOk:(()=>{
                Axios.delete('http://localhost:4000/coord/' + props.location.state.Id).then(() => {
                    openNotification(
                        "Eliminación exitosa",
                        "El Coordinador se borró correctamente",
                        true
                    )
                    props.history.goBack();
                });
            })
        })
    }

    //Se llama al presionar el boton 'Editar'
    const onEdit = () => {
        setEdit({visible: true, loading: true})
        getPdf(info.Id).then(() => {
            setEdit({visible: true, loading: false});
        })
    }

    const onCancelEdit = () =>{
        getInfo().then(() =>
            setEdit({visible: false})
        );
    }
    
    const onInfoEdit = (field, text) =>{
        let i = [];
        Object.keys(info).forEach(key => {
            i[key] = info[key];
          });
        if(field == "CUIL1"){
            i.CUIL = text + "-" + info.CUIL.split('-')[1];
        }
        else if(field == "CUIL2"){
            i.CUIL = info.CUIL.split('-')[0] + "-" + text;
        }
        else
            i[field] = text;
        setInfo(i);
    }

    const onSaveInfo = () =>{
        Object.keys(info).forEach(key => {
            lastInfo.set(key, info[key]);
        });
        //Se comprueba que no se haya subido un archivo nuevo.
        //De lo contrario, se utiliza el que ya estaba
        if(pdf1.fileList.length >= 1)
            lastInfo.set("ConstanciaAFIP", pdf1.fileList[0]);
        else
            lastInfo.set("ConstanciaAFIP", fileBlobAFIP)

        if(pdf2.fileList.length >= 1)
            lastInfo.set("CV", pdf2.fileList[0]);
        else
            lastInfo.set("CV", fileBlobCV)

        Axios.post('http://localhost:4000/updCoord/' + info.Id, lastInfo, {
            headers: {
                Accept: 'application/json'
            }
        }).then(() => {
            getInfo();
            //Se establecen los valores por defecto y se abre la notificacion
            setEdit({visible: false});
            openNotification("Datos Actualizados",
            "El coordinador fue actualizado correctamente", true);
        });
        
    }


    //click dropdown
    const dropClick = ({ key }) => {
        //Key de <Menu.Item>
        if (key === 'edit') {
            onEdit();
        } else {
            onDelete();
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

    const editHTML = info&&edit.visible ? (
        <div hidden={!edit.visible}>
        <Spin spinning={edit.loading} tip="Cargando Archivos...">
            <div className="buttons">
                <Button
                    onClick={onSaveInfo}
                    icon={<SaveFilled/>}
                    block type="primary" 
                    style={{backgroundColor:'#33ACFF'}}
                >
                    Guardar Cambios
                </Button>
                <Button
                    onClick={onCancelEdit} 
                    icon={<CloseCircleOutlined/>}
                    block type="primary" 
                    style={{backgroundColor:'#FF4F33'}}
                >
                    Cancelar
                </Button>
            </div>
            <Row gutter={[48,20]}>
                <Col span={12}>
                    <Divider orientation="left">Datos Principales</Divider>
                </Col>
                <Col span={12}>
                    <Divider orientation="left">Datos de Contacto</Divider>
                </Col>
                <Col span={12}>
                    <h1>Nombre</h1>
                    <Input placeholder="Nombre" id="Nombre"  onChange={(e)=>{onInfoEdit(e.target.id, e.target.value);}} 
                    value={info.Nombre} />
                </Col>
                <Col span={12}>
                    <h1>Domicilio</h1>
                    <Input placeholder="Domicilio" id="Domicilio" onChange={(e)=>{onInfoEdit(e.target.id, e.target.value);}} 
                    value={info.Domicilio} />
                </Col>
                <Col span={12}>
                    <h1>Apellido</h1>
                    <Input placeholder="Apellido" id="Apellido" onChange={(e)=>{onInfoEdit(e.target.id, e.target.value);}} 
                    value={info.Apellido} />
                </Col>
                
                <Col span={12}>
                    <h1>Localidad</h1>
                    <Input placeholder="Localidad" type="text" id="Localidad" onChange={(e)=>{onInfoEdit(e.target.id, e.target.value);}} 
                    value={info.Localidad} />
                </Col>
                <Col span={12}>
                    <h4>DNI/CUIL:</h4>
                        <Row gutter={12}>
                        <Col span={5}>
                            <Input placeholder="00" type="number" id="CUIL1" onChange={(e)=>{onInfoEdit(e.target.id, e.target.value);}}
                            value={info.CUIL.split('-')[0]}/>
                        </Col>
                        -
                        <Col span={12}>
                            <Input placeholder="DNI" type="number" id="DNI" onChange={(e)=>{onInfoEdit(e.target.id, e.target.value);}}
                            value={info.DNI}/>
                        </Col>
                        -
                        <Col span={4}>
                            <Input placeholder="0" type="number" id="CUIL2" onChange={(e)=>{onInfoEdit(e.target.id, e.target.value);}}
                            value={info.CUIL.split('-')[1]}/>
                        </Col>
                        </Row>
                </Col>
                
                <Col span={12}>
                    <h1>Codigo Postal</h1>
                    <Input placeholder="Codigo Postal" type="number" id="CodigoPostal" onChange={(e)=>{onInfoEdit(e.target.id, e.target.value);}} 
                    value={info.CodigoPostal} />
                </Col> 
            </Row>
            <Divider orientation="left">Datos de Facturación</Divider>
            <Row gutter={[48,20]}>
                <Col span={12}>
                    <h1>Entidad Bancaria</h1>
                    <Input placeholder="Entidad Bancaria" id="EntidadBancaria" onChange={(e)=>{onInfoEdit(e.target.id, e.target.value);}}
                    value={info.EntidadBancaria} />
                </Col>
                <Col span={12}>
                    <h1>CBU/ALIAS</h1>
                    <Input placeholder="CBU/ALIAS" id="CBU" onChange={(e)=>{onInfoEdit(e.target.id, e.target.value);}}
                    value={info.CBU} />
                </Col>
                <Col span={12}>
                <Row gutter={12}>
                    <Col span={12}>
                        <h1>Constancia AFIP</h1>
                        <Upload {...propsConstanciaAFIP} accept="application/pdf">
                            <Button type="primary" disabled={pdf1.fileList.length>0} icon={<UploadOutlined />}>Subir PDF</Button>
                        </Upload>
                        <Button onClick={() => setPdf1({visible: true, fileList: pdf1.fileList})}
                            hidden={!fileUrlAFIP}
                        >Ver Actual</Button>
                    </Col>
                    <Col span={12}>
                        <h1>CV</h1>
                        <Upload {...propsCV} accept="application/pdf">
                            <Button type="primary" disabled={pdf2.fileList.length>0} icon={<UploadOutlined />}>Subir PDF</Button>
                        </Upload>
                        <Button onClick={() => setPdf2({visible: true, fileList: pdf2.fileList})}
                            hidden={!fileUrlCV}
                        >Ver Actual</Button>
                    </Col>
                </Row>
                </Col>
                <Col span={12}>
                    <h1>Valor por Mes</h1>
                    <Input placeholder="Valor Hora" type="number" id="ValorMes" onChange={(e)=>{onInfoEdit(e.target.id, e.target.value);}}
                    value={info.ValorMes} />
                </Col>   
            </Row>
        </Spin>
        <VisorPDF
            fileURL={fileUrlAFIP}
            fileName={info.Apellido + "_ConstanciaAFIP.pdf"}
            visible={pdf1.visible}
            onCancel={()=> setPdf1({pdfViewer: false, fileList: pdf1.fileList})}
        />
        <VisorPDF
            fileURL={fileUrlCV}
            fileName={info.Apellido + "CV.pdf"}
            visible={pdf2.visible}
            onCancel={()=> setPdf2({pdfViewer: false, fileList: pdf2.fileList})}
        />
        </div>
    ) : (<div></div>)

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
                    subTitle={"Coordinador n° " + info.Id}
                    style={{padding: 8}}
                />
                <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
                    <SettingFilled hidden={!editButton} style={{fontSize: 20, color: '#9EA2A7'}}/>
                </Dropdown>
            </div>

            <div className="prot-shadow" style={{paddingLeft: 16, paddingRight: 16, paddingBottom: 16}}>
            <Tabs onTabClick={(activeKey) =>{setEditButton(activeKey == 1 ? true : false)}}>
                    <TabPane tab="Perfil" key="1" style={TabStyles}>

                    {/*JSX DE EDICION*/}
                    {editHTML}

                    <div hidden={edit.visible}>
                        <div className="profile-banner">
                            <img src={CoordImg} style={{height: 125}}/>
                            <h1 className="profile-name">{info.Nombre + " " + info.Apellido}</h1>
                            <p className="card-subtitle" style={{fontSize: 16}}>
                                {info.CUIL.split('-')[0] + "-" + info.DNI + "-" + info.CUIL.split('-')[1]}
                            </p>
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
                                    title="CUIL"
                                    value={info.CUIL}
                                />

                                <DataRow 
                                    title="Valor / Mes"
                                    value={"$" + info.ValorMes}
                                />
                                
                            </div>


                            <div className="data-col-wrap">
                                <DataRow 
                                    title="Banco"
                                    value={info.EntidadBancaria}
                                />

                                <DataRow 
                                    title="CBU"
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
                    </div>  
                    </TabPane>
                    <TabPane tab="Mapa" key="2" style={TabStyles}>
                        <div style={{height: 500}}>
                            <Map
                                markerPrincipal={"Coordinador"}
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

export default withRouter(CoordProfile)