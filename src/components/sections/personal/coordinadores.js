import React,{ useState, useEffect } from 'react';
import { Divider, Row, Col, Input, Modal, Form, Empty, Upload, Button, notification } from 'antd';
import { PlusOutlined, FileDoneOutlined, LoadingOutlined, UploadOutlined, CheckCircleOutlined, AlertOutlined} from '@ant-design/icons';
import CoordCard from './coord-card.js';
import Axios from 'axios';

const { Search } = Input;

var info = {
    datos: []
}

var lastInfo = new FormData();
var fileBlobAFIP, fileUrlAFIP;
var fileBlobCV, fileUrlCV;

function Coordinadores() {
    const [state, setState] = useState({    //Estados
        id:0,
        visible : false,
        isLoading: true,
    });

    var abortController = new AbortController();

    const emptyIcon = <Empty style={{display: state.isLoading ? "none" : info.datos.length > 0 ? "none" : "inline"}} description={false} />;
    const loadIcon = <LoadingOutlined style={{ padding: 16, fontSize: 24, display: state.isLoading ? "inline" : "none" }} spin />;

    const [data, setData] = useState([]);
    const [afipFiles, setAFIP] = useState([]);
    const [cvFiles, setCV] = useState([]);

    const getData = () =>{
        loadAndGetData().then(() => setState({isLoading: false, id: 0}))
    }
    const loadAndGetData = async() => {
        try{
            const fields = "Id, Nombre, Apellido, DNI, CUIL, EntidadBancaria, CBU, Domicilio, ValorMes"
            const res = await fetch('http://localhost:4000/getCoord/' + fields, {signal: abortController.signal});
            const datos = await res.json();
            if(datos)
                info.datos = datos;
            setData(info);
            console.log(datos);

        }catch(e){console.log(e)}
    }
    
    useEffect(()=>{
        abortController = new AbortController();
        getData();

        return () => {
            abortController.abort();
        }
    },[]);

    const showModal = () => {     //Mostrar modal
        setState({
        visible: true,
        });
    };

    const onEdit = async(id) =>{     //Mostrar modal Editar 
        setState({
            id:id,
            visible: true
        });
        let index = info.datos.findIndex(p => p.Id === id);
        for (var prop in info.datos[index]) {
            lastInfo.set(prop, info.datos[index][prop]);
            if(prop === "ConstanciaAFIP"){
                fileBlobAFIP = new Blob([Buffer.from(info.datos[index][prop])], {type: "application/pdf"})
                fileUrlAFIP = URL.createObjectURL(fileBlobAFIP)
            }
            if(prop === "CV"){
                fileBlobCV = new Blob([Buffer.from(info.datos[index][prop])], {type: "application/pdf"})
                fileUrlCV = URL.createObjectURL(fileBlobCV)
            }
        }
    };

    const onDelete = (id) => {
        if(window.confirm('¿Realmente desea eliminar esta tabla?'))
            Axios.delete('http://localhost:4000/coord/' + id, lastInfo).then(() => {
                    openNotification(
                        "Eliminación exitosa",
                        "El coordinador se borró correctamente",
                        true
                    )
                    getData();
                }
            );
    }

    const handleOk = e => {       //maneja boton ok del modal
        if(state.id <= 0 || state.id === undefined)
        {
            lastInfo.set("ConstanciaAFIP", afipFiles[0])
            lastInfo.set("CV", cvFiles[0])
            Axios.post('http://localhost:4000/addCoord',lastInfo,{
                headers: {
                    Accept: 'application/json'
                }
            }).then(res=>{
                setState({visible: false})
                openNotification("Datos Agregados",
                "El Coordinador " + lastInfo.get("Apellido") + " ahora se encuentra en la lista", true);
                getData();
            }).catch((error) => openNotification("Error","Algunos campos están vacios", false));
        }
        else
        {
            if(afipFiles>0)
                lastInfo.set("ConstanciaAFIP", afipFiles[0])
            else
                lastInfo.set("ConstanciaAFIP", fileBlobAFIP)

            if(cvFiles>0)
                lastInfo.set("CV", cvFiles[0])
            else
                lastInfo.set("CV", fileBlobCV)

            Axios.post('http://localhost:4000/updCoord/' + state.id ,lastInfo,{
                headers: {
                    Accept: 'application/json'
                }
            }).then(res=>{
                setState({visible: false})
                openNotification("Datos Actualizados",
                "El Coordinador fue actualizado correctamente", true);
                getData();
            });
        }
    };
    const handleCancel = e => {   //cancelar modal
        var confirm = window.confirm('¿Desea cerrar el formulario? Se perderán los cambios no guardados')
        if(confirm){
            setState({visible: false})
        }
    };
    const handleSearch = (v) => { //Presionar enter al buscador
        console.log(v)
    }
    
    const onChangeInput = e =>{
        lastInfo.set([e.target.id], e.target.value);
    }


    const openNotification = (msg, desc, succeed) => {
        notification.open({
            message: msg,
            description: desc,
            icon: succeed ? 
            <CheckCircleOutlined style={{ color: '#52C41A' }} /> : 
            <AlertOutlined style={{ color: '#c4251a' }} />
        });
    };

    const propsConstanciaAFIP = {
        onRemove: file => {
                setAFIP([])
                return true;
        },
        beforeUpload: file => {
            let fileL = []; fileL.push(file);
            setAFIP(fileL)
          return false;
        }
    };

    const propsCV = {
        onRemove: file => {
                setCV([])
                return true;
        },
        beforeUpload: file => {
            let fileL = []; fileL.push(file);
            setCV(fileL)
          return false;
        }
    };
    return(
        <div className="content-cont">
            <Row>
                <Col span={18}>
                    <Divider orientation="left" plain>
                        <h1 className="big-title">
                            Coordinadores
                        </h1>
                    </Divider>
                    <div className="cards-container">                 
                        {/* Display de Coordinadores */}
                        {emptyIcon}
                        {info.datos.map((i , index)=>{
                            return(
                                <CoordCard
                                id = {i.Id}
                                OnEdit= {onEdit}
                                OnDelete= {onDelete}
                                Nombre= {i.Nombre}
                                Apellido= {i.Apellido}
                                ValorMes= {i.ValorMes}
                                key= {i.Id}
                                />
                            )
                        })}   
                        {loadIcon}
                    </div>
                </Col>
                <Col span={6}>
                    <Search placeholder="Buscar..." style={{width: '95%', margin: 8, marginRight: 16}} onSearch={value => this.handleSearch(value)} allowClear={true}/>
                    <div className="right-menu">
                        <div className="right-btn" hidden={state.isLoading} onClick={showModal}>
                            <PlusOutlined />
                            <span className="right-btn-text">Nuevo</span>
                        </div>
                        <div className="right-btn">
                            <FileDoneOutlined />
                            <span className="right-btn-text">Monotributo</span>
                        </div>
                    </div>
                </Col>
            </Row>


            <Modal
                title={state.id === undefined ? "Nuevo Coordinador" : "Modificar Coordinador"}
                visible={state.visible}
                onOk={handleOk}
                onCancel={handleCancel}
                cancelText="Cancelar"
                destroyOnClose={true}
                okText="Ok"
                width='70%'
            >

            <Form>

            <Row gutter={[48,20]}>
                <Col span={12}>
                    <Divider orientation="left">Datos Principales</Divider>
                </Col>
                <Col span={12}>
                    <Divider orientation="left">Datos de Contacto</Divider>
                </Col>
                <Col span={12}>
                    <h1>Nombre</h1>
                    <Input placeholder="Nombre" id="Nombre"  onChange={onChangeInput} 
                    defaultValue={state.id === undefined ? undefined : lastInfo.get("Nombre")} />
                </Col>
                <Col span={12}>
                    <h1>Teléfono</h1>
                    <Input placeholder="Telefono" type="number" id="Telefono" onChange={onChangeInput} 
                    defaultValue={state.id === undefined ? undefined : lastInfo.get("Telefono")} />
                </Col>
                <Col span={12}>
                    <h1>Apellido</h1>
                    <Input placeholder="Apellido" id="Apellido" onChange={onChangeInput} 
                    defaultValue={state.id === undefined ? undefined : lastInfo.get("Apellido")} />
                </Col>
                <Col span={12}>
                    <h1>Domicilio</h1>
                    <Input placeholder="Domicilio" id="Domicilio" onChange={onChangeInput} 
                    defaultValue={state.id === undefined ? undefined : lastInfo.get("Domicilio")} />
                </Col>
                <Col span={12}>
                    <h1>DNI</h1>
                    <Input placeholder="DNI" type="number" id="DNI" onChange={onChangeInput} 
                    defaultValue={state.id === undefined ? undefined : lastInfo.get("DNI")} />
                </Col>
                <Col span={12}>
                    <h1>E-Mail</h1>
                    <Input placeholder="Email" id="Email" onChange={onChangeInput} 
                    defaultValue={state.id === undefined ? undefined : lastInfo.get("Email")} />
                </Col>
                <Col span={12}>
                    <h1>CUIL</h1>
                    <Input placeholder="CUIL" type="number" id="CUIL" onChange={onChangeInput} 
                    defaultValue={state.id === undefined ? undefined : lastInfo.get("CUIL")} />
                </Col>
            </Row>
            <Divider orientation="left">Datos de Facturación</Divider>
            <Row gutter={[48,20]}>
                <Col span={12}>
                    <h1>Entidad Bancaria</h1>
                    <Input placeholder="Entidad Bancaria" id="EntidadBancaria" onChange={onChangeInput}
                    defaultValue={state.id === undefined ? undefined : lastInfo.get("EntidadBancaria")} />
                </Col>
                <Col span={12}>
                    <h1>CBU/ALIAS</h1>
                    <Input placeholder="CBU/ALIAS" id="CBU" onChange={onChangeInput}
                    defaultValue={state.id === undefined ? undefined : lastInfo.get("CBU")} />
                </Col>
                <Col span={12}>
                    <Upload {...propsConstanciaAFIP} accept="application/pdf">
                        <Button disabled={afipFiles.length>0} icon={<UploadOutlined />}>Constancia AFIP</Button>
                    </Upload>
                </Col>
                <Col span={12}>
                    <h1>Valor por Mes</h1>
                    <Input placeholder="Valor Mes" type="number" id="ValorMes" onChange={onChangeInput}
                    defaultValue={state.id === undefined ? undefined : lastInfo.get("ValorMes")} />
                </Col>
                <Col span={12}>
                    <Upload {...propsCV} accept="application/pdf">
                        <Button disabled={cvFiles.length>0} icon={<UploadOutlined />}>CV</Button>
                    </Upload>
                </Col>
            </Row>        
            </Form>              
            </Modal>
            
        </div>
    )
    
}

export default Coordinadores