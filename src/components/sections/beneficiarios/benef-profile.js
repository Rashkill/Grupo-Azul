import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Modal, Upload, Tabs, PageHeader, Menu, Dropdown, Divider, Table, Timeline, Row, Col, Button, Typography, Input, notification, Popconfirm } from 'antd';
import { SettingFilled, EditFilled, DeleteFilled, DeleteOutlined, PlusOutlined, MinusOutlined, SaveFilled, CheckCircleOutlined, AlertOutlined, UploadOutlined, SaveOutlined, FileAddOutlined } from '@ant-design/icons';
import UserImg from '../../../images/image4-5.png'
import DataRow from  '../../layout/data-row'
import { Document, Page, pdfjs } from 'react-pdf';
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

    var info = []; 

    info = props.location.state;

    const [getSeguimientos, setSeguimientos] = useState([]);
    const [newInfo, setNewInfo] = useState({visible: false})
    const [inputVal, setInputVal] = useState('')
    const [getDelInfo, setDelInfo] = useState([])

    const [dataSource, setDataSource] = useState([])
    const [archivos, setArchivos] = useState([])

    const getDatos = async () =>{
        const res = await fetch('http://localhost:4000/getBenefOnly/' + props.location.state.Id + '/' + 'Seguimientos');
        const datos = await res.json();
        
        if(datos.length>0 && datos[0].Seguimientos){
            var jsonObject = JSON.parse(Buffer.from(JSON.parse(JSON.stringify(datos[0].Seguimientos)).data).toString('utf8'));
            info.Seguimientos = jsonObject;
        }

        if(info && info.Seguimientos){
            delInfo = [];
            for (let i = 0; i < info.Seguimientos.length; i++) {
                    delInfo.push({delete: false})
            }
        }
        
        setDelInfo([...delInfo]);
        setSeguimientos([...info.Seguimientos]);
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

    useEffect(() => {
        if(info){
            getDatos();
            getPdfs();
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
                    <Popconfirm
                        title={`Por el momento no hay visor PDF ¿Desea descargar el archivo?`}
                        okText= 'Si' cancelText= 'No'
                        onConfirm={async()=>{
                            let link = document.createElement("a");
                            link.download = `${record.pdf}`;
                            link.href = URL.createObjectURL(await getPDFBlob(record.key));
                            link.click();
                            URL.revokeObjectURL(link.href);
                        }}
                    >
                        <a>Abrir </a>
                    </Popconfirm>

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

    
    //Se asigna o elimina el archivo
    const ArchivoPDF = {
        onRemove: file => {
                let fileL = archivos; fileL.splice(archivos.findIndex(x => x=== file, 1));
                setArchivos([...fileL]);
                return true;
        },
        beforeUpload: file => {
            let fileL = archivos; fileL.push(file);
            setArchivos([...fileL]);
          return false;
        }
    };

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
                        
                    </TabPane>
                </Tabs>
            </div>

        </React.Fragment>
    )
}

export default withRouter(BenefCard)