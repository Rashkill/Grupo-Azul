import React,{ useState, useEffect } from 'react';
import { Form, Divider, Row, Col, Input, Modal, Button, Upload, Spin ,notification , Empty } from 'antd';
import { PlusOutlined, FileDoneOutlined, UploadOutlined, CheckCircleOutlined, AlertOutlined, LoadingOutlined, PaperClipOutlined } from '@ant-design/icons';
import AcompCard from './acomp-card.js';
import Axios from 'axios';

const { Search } = Input;

var info = {
    datos: []
};

var lastInfo = new FormData();
var fileBlobAFIP, fileUrlAFIP;
var fileBlobCV, fileUrlCV;

function Acompañantes() {
    const [state, setState] = useState({    //Estados
        id:0,
        visible : false,
        isLoading:true,
    });
    
    var abortController = new AbortController();
    const [data, setData] = useState([]);
    const [afipFiles, setAFIP] = useState([]);
    const [cvFiles, setCV] = useState([]);

    const emptyIcon = <Empty style={{display: state.isLoading ? "none" : info.datos.length > 0 ? "none" : "inline"}} description={false} />;
    const loadIcon = <LoadingOutlined style={{ padding: 16, fontSize: 24, display: state.isLoading ? "inline" : "none" }} spin />;

    //Secuencia que obtiene la informacion y luego desactiva el icono de carga
    const getData = () =>{
        loadAndGetData().then(() => setState({isLoading: false, id:0}))
    }
    const loadAndGetData = async() => {
        try{
            const fields = "Id, Nombre, Apellido, DNI, CUIL, EntidadBancaria, CBU, Domicilio, Email, Telefono, ValorHora, NumeroPoliza, NombreSeguros"
            const res = await fetch('http://localhost:4000/getAcomp/' + fields, {signal: abortController.signal});
            const datos = await res.json();
            if(datos)
                info.datos = datos;            
            setData(info);

        }catch(e){console.log(e)}
    }

    //Obtiene los archivos
    const getPdfs = async(id) =>{
        try{
            const res = await fetch('http://localhost:4000/getAcompOnly/'+ id +'/ConstanciaAFIP,CV', {signal: abortController.signal});
            const datos = await res.json();
            console.log(datos);
            console.log(state.id);

            fileBlobAFIP = new Blob([Buffer.from(datos[0].ConstanciaAFIP)], {type: "application/pdf"})
            fileUrlAFIP = URL.createObjectURL(fileBlobAFIP)
            
            fileBlobCV = new Blob([Buffer.from(datos[0].CV)], {type: "application/pdf"})
            fileUrlCV = URL.createObjectURL(fileBlobCV)
        } 
        catch(e){console.log(e)}
    }

    //Se ejecuta al montar el componente
    useEffect(()=>{
        abortController = new AbortController();
        getData();

        return () => {
            abortController.abort();
        }
    },[]);

    const showModal =  () => {     //Mostrar modal
        setState({
            visible: true,
        });
    };

    //Se llama al presionar el boton 'Editar' en la tarjeta
    const onEdit = async(id) =>{ 

        let index = info.datos.findIndex(p => p.Id === id);
        for (var prop in info.datos[index]) {
            lastInfo.set(prop, info.datos[index][prop]);
        }
        
        getPdfs(id).then(() => setState({id:id, visible: true}));
    };

    //Se llama al presionar el boton 'Eliminar' en la tarjeta
    const onDelete = (id) => {
        if(window.confirm('¿Realmente desea eliminar esta tabla?'))
        Axios.delete('http://localhost:4000/benef/' + id).then(() => {
                openNotification(
                    "Eliminación exitosa",
                    "El Acompañante se borró correctamente",
                    true
                )
                getData();
            }
        );
    }

    //maneja boton ok del modal
    const handleOk = () => 
    {
        //Si la 'id' es menor o igual a 0, significa que se esta agregando uno nuevo
        if(state.id <= 0 || state.id === undefined)
        {
            //Se asigna el archivo desde la lista y se llama a la base de datos
            lastInfo.set("ConstanciaAFIP", afipFiles[0])
            lastInfo.set("CV", cvFiles[0])
            Axios.post('http://localhost:4000/addAcomp',lastInfo,{
                headers: {
                    Accept: 'application/json'
                }
            }).then(res=>{
                //Se establecen los valores por defecto y se abre la notificacion
                setState({visible: false})
                openNotification("Datos Agregados",
                "El acompañante " + lastInfo.get("Apellido") + " ahora se encuentra en la lista", true);
                getData();
                setAFIP([]);
                setCV([]);
            }).catch((error) => openNotification("Error","Algunos campos están vacios", false));
        }
        else
        {
            //Se comprueba que no se haya subido un archivo nuevo.
            //De lo contrario, se utiliza el que ya estaba
            if(afipFiles>0)
                lastInfo.set("ConstanciaAFIP", afipFiles[0])
            else
                lastInfo.set("ConstanciaAFIP", fileBlobAFIP)

            if(cvFiles>0)
                lastInfo.set("CV", cvFiles[0])
            else
                lastInfo.set("CV", fileBlobCV)

            Axios.post('http://localhost:4000/updAcomp/' + state.id ,lastInfo,{
                headers: {
                    Accept: 'application/json'
                }
            }).then(res=>{
                setState({visible: false})
                openNotification("Datos Actualizados",
                "El acompañante fue actualizado correctamente", true);
                getData();
                setAFIP([]);
                setCV([]);
            });
        }
        // var response =  await res.json().then(openNotification()).then(getData());

    };

    const handleCancel = e => {   //cancelar modales
        var confirm = window.confirm('¿Desea cerrar el formulario? Se perderán los cambios no guardados')
        if(confirm){
            setState({
            visible: false
            });
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
            {/*Todos los Acompañantes */}
            <Row>
                <Col span={18}>
                    <Divider orientation="left" plain>
                        <h1 className="big-title">
                            Acompañantes
                        </h1>
                    </Divider>
                    <div className="cards-container">                 
                    {/* Display de acompañantes */}
                    {emptyIcon}
                    {info.datos.map((i , index)=>{
                        return(
                            <AcompCard 
                                OnEdit={onEdit} 
                                OnDelete={onDelete} 
                                title={i.Nombre + " " + i.Apellido} 
                                price={i.ValorHora} 
                                email={i.Email} 
                                telefono={i.Telefono} 
                                domicilio={i.Domicilio} 
                                id={i.Id}
                                // ucd= {info.ucd[i.IdBeneficiario - 1]}
                                key={index}
                                linkto="acompprofile"
                            />
                        )
                            
                    })}
                    {loadIcon}
                    </div>
                </Col>
                <Col span={6}>
                    <Search placeholder="Buscar..." style={{width: '95%', margin: 8, marginRight: 16}} onSearch={value => this.handleSearch(value)} allowClear={true}/>
                    <div className="right-menu">
                        <div className="right-btn" hidden={state.isLoading} onClick={showModal} >
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
            
            {/* //Agregar Acomp MODAL */}     
            <Modal
                title={state.id === undefined ? "Nuevo Acompañante" : "Modificar Acompañante"}
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
                        <h1>Numero Póliza</h1>
                        <Input placeholder="Numero Póliza" id="NumeroPoliza" onChange={onChangeInput}
                        defaultValue={state.id === undefined ? undefined : lastInfo.get("NumeroPoliza")} />
                    </Col>
                    <Col span={12}>
                        <h1>Nombre Seguros</h1>
                        <Input placeholder="Nombre Seguros" id="NombreSeguros" onChange={onChangeInput}
                        defaultValue={state.id === undefined ? undefined : lastInfo.get("NombreSeguros")} />
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
                        <h1>Valor por Hora</h1>
                        <Input placeholder="Valor Hora" type="number" id="ValorHora" onChange={onChangeInput}
                        defaultValue={state.id === undefined ? undefined : lastInfo.get("ValorHora")} />
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

export default Acompañantes