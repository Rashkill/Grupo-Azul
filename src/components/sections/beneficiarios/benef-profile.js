import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { AutoComplete, Spin, Modal, Upload, Tabs, PageHeader, Menu, Dropdown, Divider, Table, Timeline, Row, Col, Button, Typography, Input, notification, Popconfirm, DatePicker } from 'antd';
import { InfoCircleOutlined, SettingFilled, EditFilled, DeleteFilled, DeleteOutlined, PlusOutlined, MinusOutlined, SaveFilled, CheckCircleOutlined, CloseCircleOutlined, AlertOutlined, UploadOutlined, SaveOutlined, FileAddOutlined } from '@ant-design/icons';
import UserImg from '../../../images/image4-5.png'
import DataRow from  '../../layout/data-row'

import VisorPDF from '../util/visorPDF'
import Mapa from '../util/Map'

import Axios from 'axios';
import { DivIcon, map } from 'leaflet';

const { Paragraph, Text } = Typography;
const { TextArea } = Input;
const moment = require('moment');

var fileBlob, fileURL;
var coords = [], coordIndex = -1;
const renderItem = (title, dni) => {
    return {
      value: title,
      label: (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          {title}
          <span style={{color: "gray", fontSize: 12}}>
            <InfoCircleOutlined />{dni.toString().substr(-3, 3)}
          </span>
        </div>
      ),
    };
};

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


var maxItems = 0;
const maxRows = 5;
var rowOffset = 0;

var delInfo = [];

function getFecha(){
    let f = new Date();
    let d = String(f.getDate()).padStart(2,0);
    let m = String(f.getMonth() + 1).padStart(2,0);
    let a = f.getFullYear();
    return `${d}-${m}-${a}`;
}

const BenefCard = (props) =>{

    let abortController = new AbortController();
    const [edit, setEdit] = useState({
        visible: false,
        loading: true
    });
    const [pdf1, setPdf1] = useState({
        visible: false,
        fileList: []
    })
    const [editButton, setEditButton] = useState(true);
    const [info, setInfo] = useState(props.location.state);
    const [coordInfo, setCoordInfo] = useState("")
    let lastInfo = new FormData();

    const [getSeguimientos, setSeguimientos] = useState([]);
    const [newInfo, setNewInfo] = useState({visible: false})
    const [inputVal, setInputVal] = useState('')
    const [getDelInfo, setDelInfo] = useState([])

    const [dataSource, setDataSource] = useState([])
    const [archivos, setArchivos] = useState([])
    const [pdfViewer, setPdfViewer] = useState({
        visible: false,
        fileURL: null,
        fileName: ""
    })


    const getInfo = async () =>{
        const fields = "Id, Nombre, Apellido, DNI, CUIL, FechaNacimiento, Domicilio, Localidad, CodigoPostal, Email, Telefono, Enfermedades, IdCoordinador, Latitud, Longitud"
        const res = await fetch('http://localhost:4000/getBenefOnly/' + props.location.state.Id + '/' + fields);
        const datos = await res.json();
        setInfo(datos[0]);
        setPdf1({fileList: []});
    }

    const getDatos = async () =>{
        const res = await fetch('http://localhost:4000/getBenefOnly/' + props.location.state.Id + '/' + 'Seguimientos');
        const datos = await res.json();
        
        if(datos.length>0 && datos[0].Seguimientos){
            var jsonObject = JSON.parse(Buffer.from(JSON.parse(JSON.stringify(datos[0].Seguimientos)).data).toString('utf8'));
            info.Seguimientos = jsonObject;
        

            if(info && info.Seguimientos){
                delInfo = [];
                for (let i = 0; i < info.Seguimientos.length; i++) {
                        delInfo.push({delete: false})
                }
            }
            
            setDelInfo([...delInfo]);
            setSeguimientos([...info.Seguimientos]);
        }
    }

    //Obtiene los archivos
    const getPdfs = async() =>{
        try{
            const resNotasCant = await fetch('http://localhost:4000/getNotasBenef/Id/' + props.location.state.Id);
            const notasCant = await resNotasCant.json();
            maxItems = notasCant.length;

            const resNotas = await fetch('http://localhost:4000/getNotasBenef/Id,Fecha,NombreArchivo/' + props.location.state.Id + '/' + maxRows + '/' + rowOffset);
            const notas = await resNotas.json();

            var data = [];
            notas.forEach((e, index) => {
                data.push({
                    fecha: e.Fecha, 
                    pdf: e.NombreArchivo, 
                    key: e.Id});
            });
            setDataSource([...data]);
        } 
        catch(e){console.log(e)}
    }

    //const [coord, setCoord] = useState([0,0])
    useEffect(() => {
        if(info){
            getDatos();
            getPdfs();

            // Axios(`http://dev.virtualearth.net/REST/v1/Locations?q='${info.Domicilio} ${info.Localidad} ${info.CodigoPostal}'argentina&maxResults=1&key=Arn6kit_Moqpx-2p7jWVKy1h-TlLyYESkqc1cHzP1JkEAm1A_86T8o3FtDcKqnVV`)
            // .then(response => {
            //     setCoord(response.data.resourceSets[0].resources[0].geocodePoints[0].coordinates);
            // })
        }
        return () =>{
            rowOffset = 0;
        }
    },[info])

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

    //Creacion Seguimiento
    const onEndCreate = () => {

        let fecha = getFecha();

        var arraySeguimientos = getSeguimientos;
        arraySeguimientos.push({label: fecha, text: inputVal})
        setSeguimientos([...arraySeguimientos]);
        
        delInfo.push({delete: false});
        setDelInfo([...delInfo]);

        setNewInfo({visible: false});
        setInputVal('');
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
        var arraySeguimientos = getSeguimientos;
        //Se borran los seguimientos tachados del array
        for (let i = 0; i < getDelInfo.length; i++) {
            if(getDelInfo[i].delete){
                arraySeguimientos.splice(i,1);
                delInfo.splice(i,1);
            }
            setSeguimientos([...arraySeguimientos]);
            setDelInfo([...delInfo]);
        }

        //Se guarda el array en la base de datos
        Axios.post('http://localhost:4000/updBenefSeg/' + info.Id, getSeguimientos, {
                headers: {
                    Accept: 'application/json'
                }
        }).then(()=>{
            openNotification(
                'Seguimiento guardado',
                'Los datos fueron guardados correctamente!',
                true
            )
            getDatos();
        });
    }

    //Sube un archivo en especifico
    const subirArchivo = async(index) =>{
        try{
            var datos = new FormData();
            datos.set('IdBeneficiario', info.Id)
            datos.set('Fecha', getFecha());
            datos.set('Archivo', archivos[index]);
            datos.set('NombreArchivo', archivos[index].name);
            //Se guarda el array en la base de datos
            await Axios.post('http://localhost:4000/addNotaBenef', datos, {
                headers: {
                    Accept: 'application/json'
                }
            })
            return true;
        } catch(e){ return false };
    }

    //Guarda varias notas
    const guardarNotas = async() =>{
        var f = archivos.length;
        for (let index = 0; index < archivos.length; index++) {
            let v = await subirArchivo(index);
            if(!v) f--;
        }
        if(f > 0){
            openNotification(
                archivos.length>1?'Notas creadas'
                    :'Nota creada',
                archivos.length>1?`Los archivos fueron creados correctamente!(${f}/${archivos.length})`
                    :'El archivo se creó correctamente',
                true
            )
            setArchivos([]);
            getPdfs();
        }
        else{
            openNotification(
                'Error al crear nota',
                'No fue posible subir los archivos, compruebe que el PDF sea valido',
                false
            )
        }
        return f;
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
                    <a onClick={async()=>{
                        let url = URL.createObjectURL(await getPDFBlob(record.key));
                        setPdfViewer({
                            fileURL: url,
                            fileName: `${record.pdf}`,
                            visible: true
                        })
                    }}>Abrir </a>

                    <Popconfirm
                        title={`Esta accion sobreescribirá el archivo actual ¿Desea continuar?`}
                        okText= 'Si' cancelText= 'No'
                        onConfirm={()=>updNota(record)}
                    >
                        <a>Editar </a>
                    </Popconfirm>

                    <Popconfirm
                        title={`¿Desea eliminar el archivo ${record.pdf}?`}
                        okText= 'Si' cancelText= 'No'
                        onConfirm={()=>delNota(record)}
                    >
                        <a>Eliminar </a>
                    </Popconfirm>
                </div>
            )
        }
    ];

    const getPDFBlob = async(id) =>{
        const res = await fetch('http://localhost:4000/getNotasBenef/Archivo/' + id);
        const datos = await res.json();
        return new Blob([Buffer.from(datos[0].Archivo.data)], {type: "application/pdf"})
    }

    const updNota = (record) =>{
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
            Axios.post('http://localhost:4000/updNotaBenef/' + record.key, datos, {
                headers: {
                    Accept: 'application/json'
                }
            }).then(()=>{
                openNotification(
                    'Nota actualizada',
                    `La nota ${record.pdf} fue sustituida exitosamente`,
                    true
                )
                getPdfs();
            })
        };
    }

    const delNota = (record) =>{
        Axios.delete('http://localhost:4000/notaBenef/' + record.key).then(()=>{
            openNotification(
                'Nota eliminada',
                `La nota ${record.pdf} fue removida con exito`,
                true
            )
            getPdfs();
        })
    }

    const goBack = () =>{
        if(arrayEquals(info.Seguimientos, getSeguimientos)&&delInfoCheck()&&archivos.length<=0){
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

    function arrayEquals(a, b) {
        return Array.isArray(a) &&
          Array.isArray(b) &&
          a.length === b.length &&
          a.every((val, index) => val === b[index]);
    }

    function delInfoCheck (){
        var f = true;
        getDelInfo.map(i => {
            if(f && i.delete)
                f = false;
        })
        return f;
    }

    //Obtiene los archivos
    const getPdf = async(id) =>{
        try{
            const res = await fetch('http://localhost:4000/getBenefOnly/'+ id +'/FichaInicial', {signal: abortController.signal});
            const datos = await res.json();

            fileBlob = new Blob([Buffer.from(datos[0].FichaInicial.data)], {type: "application/pdf"})
            fileURL = URL.createObjectURL(fileBlob)
        } 
        catch(e){console.log(e)}
    }

    //Se asigna o elimina el archivo
    const ArchivoPDF = {
        onRemove: file => {
                let fileL = archivos; fileL.splice(archivos.findIndex(x => x=== file), 1);
                setArchivos([...fileL]);
                return true;
        },
        beforeUpload: file => {
            let fileL = archivos; fileL.push(file);
            setArchivos([...fileL]);
          return false;
        }
    };

    //Se asigna o elimina el archivo
    const FichaInicial = {
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

    //Se llama al presionar el boton 'Eliminar'
    const onDelete = () => {
        Modal.confirm({
            title:'¿Realmente desea eliminar este elemento?',
            content: 'Esta acción no se puede deshacer.',
            okText: 'Si', cancelText: 'No',
            onOk:(()=>{
                Axios.delete('http://localhost:4000/benef/' + props.location.state.Id).then(() => {
                    openNotification(
                        "Eliminación exitosa",
                        "El Beneficiario se borró correctamente",
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
        getPdf(info.Id).then(async() => {
            const res = await fetch('http://localhost:4000/getCoord/Nombre,Apellido,DNI,Id', {signal: abortController.signal});
            const datos = await res.json();
            if(datos)
                coords = datos.map(c => ({
                    value: c.Nombre + " " + c.Apellido,
                    dni: c.DNI,
                    id: c.Id
            }));
            coordIndex = coords.findIndex(x => x.id == info.IdCoordinador);
            setCoordInfo(coords[coordIndex] ? coords[coordIndex].value : "");
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
            lastInfo.set("FichaInicial", pdf1.fileList[0]);
        else
            lastInfo.set("FichaInicial", fileBlob)

        Axios.post('http://localhost:4000/updBenef/' + info.Id, lastInfo, {
            headers: {
                Accept: 'application/json'
            }
        }).then(() => {
            getInfo();
            //Se establecen los valores por defecto y se abre la notificacion
            setEdit({visible: false});
            openNotification("Datos Actualizados",
            "El beneficiario fue actualizado correctamente", true);
        });
        
    }


    const dropClick = ({ key }) => {
        //Key de <Menu.Item>
        if (key === 'edit') {
            onEdit();
        } else {
            onDelete();
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
                <h4>Nombre:</h4>
                    <Input placeholder="Nombre" id="Nombre" onChange={(e)=>{onInfoEdit(e.target.id, e.target.value);}}
                    value={info.Nombre} />
                </Col>
                <Col span={12}>
                    <h4>Telefono:</h4>
                    <Input placeholder="Telefono" type="number" id="Telefono" onChange={(e)=>{onInfoEdit(e.target.id, e.target.value);}}
                    value={info.Telefono}/>
                </Col>
                <Col span={12}>
                    <h4>Apellido:</h4>
                    <Input placeholder="Apellido" id="Apellido" onChange={(e)=>{onInfoEdit(e.target.id, e.target.value);}}
                    value={info.Apellido}/>
                </Col>
                <Col span={12}>
                    <h4>Domicilio:</h4>
                    <Input placeholder="Domicilio" id="Domicilio" onChange={(e)=>{onInfoEdit(e.target.id, e.target.value);}}
                    value={info.Domicilio}/>
                </Col>
                <Col span={12}>
                    <h4>DNI/CUIL:</h4>
                    <Row gutter={12}>
                    <Col span={6}>
                        <Input placeholder="00" type="number" id="CUIL1" onChange={(e)=>{onInfoEdit(e.target.id, e.target.value);}}
                        value={info.CUIL.split('-')[0]}/>
                    </Col>
                    -
                    <Col span={10}>
                        <Input placeholder="DNI" type="number" id="DNI" onChange={(e)=>{onInfoEdit(e.target.id, e.target.value);}}
                        value={info.DNI}/>
                    </Col>
                    -
                    <Col span={5}>
                        <Input placeholder="0" type="number" id="CUIL2" onChange={(e)=>{onInfoEdit(e.target.id, e.target.value);}}
                        value={info.CUIL.split('-')[1]}/>
                    </Col>
                    </Row>
                </Col>
                <Col span={12}>
                    <h4>Localidad:</h4>
                    <Input placeholder="Localidad" id="Localidad" onChange={(e)=>{onInfoEdit(e.target.id, e.target.value);}}
                    value={info.Localidad}/>
                </Col>
                <Col span={12}>
                    <h4>Fecha de Nacimiento:</h4>
                    <DatePicker placeholder="Fecha de Nacimiento" id="FechaNacimiento"
                        format="DD/MM/YYYY"
                        style={{width: '100%'}}
                        value={info.FechaNacimiento ? moment(info.FechaNacimiento, "DD/MM/YYYY") : ""}
                        onChange={(e) =>{e ? onInfoEdit("FechaNacimiento", e.format('DD-MM-YYYY')):onInfoEdit("FechaNacimiento", null)}}
                    />
                </Col>
                <Col span={12}>
                    <h4>Codigo Postal:</h4>
                    <Input placeholder="Codigo Postal" id="CodigoPostal" onChange={(e)=>{onInfoEdit(e.target.id, e.target.value);}}
                    value={info.CodigoPostal}/>
                </Col>
                <Col span={12}>
                    <h4>Email:</h4>
                    <Input placeholder="Email" id="Email" onChange={(e)=>{onInfoEdit(e.target.id, e.target.value);}}
                    value={info.Email}/>
                </Col>
                <Col span={12}>
                    <h4>Enfermedades:</h4>
                    <Input placeholder="Enfermedades" id="Enfermedades" onChange={(e)=>{onInfoEdit(e.target.id, e.target.value);}}
                    value={info.Enfermedades}/>
                </Col>
                <Col span={12}>
                    <h4>Coordinador:</h4>
                    <AutoComplete 
                        placeholder="Coordinador" 
                        id="IdCoordinador"
                        allowClear
                        onChange={(e)=>{onInfoEdit(e.target.id, e.target.value);}} 
                        style={{ width: '100%' }}
                        options={coords.map(i => renderItem(i.value, i.dni))}
                        filterOption={(inputValue, option) =>
                            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) + 1 !== 0}
                        onChange = {(e, value, reason) => {
                            setCoordInfo(e);
                            var prop = coords.find(v => v.value == e);
                            if(prop)
                                onInfoEdit("IdCoordinador", prop.id);
                            else
                                onInfoEdit("IdCoordinador", -1);
                        }}
                        value={coordInfo}
                    />
                </Col>
                <Col span={12}>
                    <h4>Ficha Inicial:</h4>
                    <Upload {...FichaInicial} id="FichaInicial" 
                            accept="application/pdf">
                        <Button type="primary" disabled={pdf1.fileList.length>0} icon={<UploadOutlined />}>Subir PDF</Button>
                    </Upload>
                    
                    <Button onClick={() => setPdf1({visible: true, fileList: pdf1.fileList})}
                        hidden={!fileURL}
                    >Ver PDF Actual</Button>
                </Col>
            </Row>
            </Spin>
            <VisorPDF
                fileURL={fileURL}
                fileName={info.Apellido + "_FichaInicial.pdf"}
                visible={pdf1.visible}
                onCancel={()=> setPdf1({pdfViewer: false, fileList: pdf1.fileList})}
            />
        </div>
    ):(<div></div>);

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
                    subTitle={"Beneficiario n° " + info.Id}
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
                        <div className="profile-banner" >
                            <img src={UserImg} style={{height: 125}}/>
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
                                    title="DNI / CUIL"
                                    value={info.CUIL.split('-')[0] + "-" + info.DNI + "-" + info.CUIL.split('-')[1]}
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
                            <div className="botones-wrap">
                                <Upload {...ArchivoPDF} 
                                    id="ArchivoPDF" 
                                    accept="application/pdf"
                                    multiple={true}
                                    fileList={archivos}
                                >
                                    <Button type="primary" icon={<FileAddOutlined />}>Elegir Archivo/s</Button>
                                </Upload>
                                <Button 
                                    type="link"
                                    icon={<UploadOutlined />} 
                                    onClick={guardarNotas}
                                    style={{color:"green"}}
                                    hidden={archivos.length<=0}
                                >
                                    Guardar Archivos
                                </Button>
                            </div>
                            <Table 
                                dataSource={dataSource} 
                                columns={columns} 
                                bordered 
                                pagination={{
                                    style:{visibility:maxItems<=maxRows?"hidden":"visible"}, 
                                    defaultCurrent: 1,
                                    total: maxItems,
                                    pageSize: maxRows,
                                    onChange:(page)=>{rowOffset=maxRows*(page-1); getPdfs();}
                                }}
                            />
                        </div>
                    </div>
                    </TabPane>
                    <TabPane tab="Seguimientos" key="2" style={TabStyles}>
                        <div className="buttons">
                            <Button 
                                hidden={info?info.Seguimientos?arrayEquals(info.Seguimientos, getSeguimientos)&&delInfoCheck():false:false} 
                                onClick={saveToBD} 
                                icon={<SaveFilled/>}
                            >
                                Subir Cambios
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
                        <div style={{height: 500}}>
                            <Mapa
                                markerPrincipal={"Beneficiario"}
                                coordPrincipal={[info.Latitud, info.Longitud]}
                                buscarCoords={"Acompañante"}
                            />
                        </div>
                    </TabPane>
                </Tabs>


            </div>

        </React.Fragment>
    )
}

export default withRouter(BenefCard)