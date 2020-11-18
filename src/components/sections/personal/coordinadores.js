import React,{ useState, useEffect } from 'react';
import { Divider, Row, Col, Input, Modal, Form, Empty, Upload, Button, notification, Pagination, Spin } from 'antd';
import { PlusOutlined, FileDoneOutlined, LoadingOutlined, UploadOutlined, CheckCircleOutlined, AlertOutlined} from '@ant-design/icons';
import CoordCard from './coord-card.js';

import VisorPDF from '../util/visorPDF'
import Axios from 'axios';

const { Search } = Input;

var infoDatos = [], infoFiltro = [];
var lastInfo = new FormData();
var fileBlobAFIP, fileUrlAFIP;
var fileBlobCV, fileUrlCV;


var abortController = new AbortController();
var index = -1;
var maxItems = 0;
const maxRows = 5;
var rowOffset = 0;

class Coordinadores extends React.Component {
    state = {
        id:0,
        visible : false,
        isLoading:true,
        afipFiles:[],
        cvFiles:[],
        pdfViewer: false,
        loadingModal: false
    };


    getData = () =>{
        window.scrollTo(0,0);
        this.loadAndGetData().then(() => this.setState({isLoading: false, id: 0}));
    }
    loadAndGetData = async() => {
        try{
            const result = await fetch('http://localhost:4000/getCoord/Id', {signal: this.abortController.signal});
            const data = await result.json();
            maxItems = data.length;

            const fields = "Id, Nombre, Apellido, DNI, CUIL, EntidadBancaria, CBU, Domicilio, ValorMes"
            const res = await fetch('http://localhost:4000/getCoord/' + fields + '/' + maxRows + '/' + rowOffset, {signal: this.abortController.signal});
            const datos = await res.json();
            if(datos)
                infoDatos = datos;
            infoFiltro = infoDatos;

        }catch(e){console.log(e)}
    }

    //Obtiene los archivos
    getPdfs = async(id) =>{
        try{
            const res = await fetch('http://localhost:4000/getCoordOnly/'+ id +'/ConstanciaAFIP,CV', {signal: this.abortController.signal});
            const datos = await res.json();
            console.log(datos);
            console.log(this.state.id);

            fileBlobAFIP = new Blob([Buffer.from(datos[0].ConstanciaAFIP)], {type: "application/pdf"})
            fileUrlAFIP = URL.createObjectURL(fileBlobAFIP)
            
            fileBlobCV = new Blob([Buffer.from(datos[0].CV)], {type: "application/pdf"})
            fileUrlCV = URL.createObjectURL(fileBlobCV)
        } 
        catch(e){console.log(e)}
    }
    
    componentDidMount=()=>{
        this.abortController = new AbortController();
        this.getData();
    };

    componentWillUnmount=()=>{
        rowOffset = 0;
        this.abortController.abort();
    }
    showModal = () => {     //Mostrar modal
        this.setState({
        visible: true,
        });
    };

    //Se llama al presionar el boton 'Editar' en la tarjeta
    onEdit = async(id) =>{ 

        index = infoDatos.findIndex(p => p.Id == id);
        for (var prop in infoDatos[index]) {
            lastInfo.set(prop, infoDatos[index][prop]);
        }
        

        this.abortController = new AbortController();
        this.setState({id:id, visible: true, loadingModal: true})
        this.getPdfs(id).then(() => this.setState({loadingModal: false}));
    };

    onDelete = (id) => {
        Modal.confirm({
            title:'¿Realmente desea eliminar este elemento?',
            content: 'Esta acción no se puede deshacer.',
            okText: 'Si', cancelText: 'No',
            onOk:(()=>{
                Axios.delete('http://localhost:4000/coord/' + id).then(() => {
                this.openNotification(
                    "Eliminación exitosa",
                    "El Coordinador se borró correctamente",
                    true
                )
                this.getData();
                });
            })
        })
    }

    handleOk = e => {       //maneja boton ok del modal
        if(this.state.id <= 0 || this.state.id <= 0)
        {
            lastInfo.set("ConstanciaAFIP", this.state.afipFiles[0])
            lastInfo.set("CV", this.state.cvFiles[0])
            Axios.post('http://localhost:4000/addCoord',lastInfo,{
                headers: {
                    Accept: 'application/json'
                }
            }).then(res=>{
                this.setState({visible: false})
                this.openNotification("Datos Agregados",
                "El Coordinador " + lastInfo.get("Apellido") + " ahora se encuentra en la lista", true);
                this.getData();
            }).catch((error) => this.openNotification("Error","Algunos campos están vacios", false));
        }
        else
        {
            if(this.state.afipFiles>0)
                lastInfo.set("ConstanciaAFIP", this.state.afipFiles[0])
            else
                lastInfo.set("ConstanciaAFIP", fileBlobAFIP)

            if(this.state.cvFiles>0)
                lastInfo.set("CV", this.state.cvFiles[0])
            else
                lastInfo.set("CV", fileBlobCV)

            Axios.post('http://localhost:4000/updCoord/' + this.state.id ,lastInfo,{
                headers: {
                    Accept: 'application/json'
                }
            }).then(res=>{
                this.setState({visible: false})
                this.openNotification("Datos Actualizados",
                "El Coordinador fue actualizado correctamente", true);
                this.getData();
            });
        }
    };

    //cancelar modal
    handleCancel = e => {
        Modal.confirm({
            title:'¿Desea cerrar el formulario?',
            content: 'Se perderán los cambios no guardados',
            okText: 'Si', cancelText: 'No',
            onOk:(()=>{this.setState({visible: false, id:0, loadingModal: false}, this.abortController.abort())})
        })
    };

    //Buscador
    handleSearch = async(v) => {
        if(v !== null && v !== ""){
            let pattern = v.replace(/^\s+/g, '');;
            let table = "Coordinador";
            let column = "Nombre,Apellido";
            let k = v.split(':');
            if(k.length > 1){
                column = k[0];
                pattern = k[1].replace(/^\s+/g, '');
            }
            const fields = "Id, Nombre, Apellido, DNI, CUIL, EntidadBancaria, CBU, Domicilio, ValorMes"
            const result = await fetch('http://localhost:4000/find/' + fields + '/' + table + '/' + column + '/' + pattern, {signal: this.abortController.signal});
            const data = await result.json();
            infoFiltro = data;
        }
        else infoFiltro = infoDatos;
        
        this.setState({cantidad: infoFiltro.length});
    } 
    
    onChangeInput = e =>{
        lastInfo.set([e.target.id], e.target.value);
    }

    openNotification = (msg, desc, succeed) => {
        notification.open({
            message: msg,
            description: desc,
            icon: succeed ? 
            <CheckCircleOutlined style={{ color: '#52C41A' }} /> : 
            <AlertOutlined style={{ color: '#c4251a' }} />
        });
    };

    propsConstanciaAFIP = {
        onRemove: file => {
                this.setState({afipFiles:[]})
                return true;
        },
        beforeUpload: file => {
            let fileL = []; fileL.push(file);
            this.setState({afipFiles:fileL})
          return false;
        }
    };

    propsCV = {
        onRemove: file => {
                this.setState({setCV:[]})
                return true;
        },
        beforeUpload: file => {
            let fileL = []; fileL.push(file);
            this.setState({setCV:fileL})
          return false;
        }
    };

    render(){
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
                        <Empty style={{display: this.stateisLoading ? "none" : infoFiltro.length > 0 ? "none" : "inline"}} description={false} />
                        {infoFiltro.map((i , index)=>{
                            return(
                                <CoordCard
                                id = {i.Id}
                                OnEdit= {this.onEdit}
                                OnDelete= {this.onDelete}
                                Nombre= {i.Nombre}
                                Apellido= {i.Apellido}
                                ValorMes= {i.ValorMes}
                                key= {i.Id}
                                linkto="coordprofile"
                                />
                            )
                        })}   
                        <LoadingOutlined style={{ padding: 16, fontSize: 24, display: this.stateisLoading ? "inline" : "none" }} spin />
                    </div>
                    <Pagination 
                            style={{textAlign:"center", visibility:maxItems<=maxRows?"hidden":"visible"}} 
                            defaultCurrent={1} 
                            total={maxItems} 
                            pageSize={maxRows}
                            onChange={(page)=>{rowOffset=maxRows*(page-1); this.getData();}}
                    />
                </Col>
                <Col span={6}>
                    <Search placeholder="Buscar..." style={{width: '95%', margin: 8, marginRight: 16}} onSearch={value => this.handleSearch(value)} allowClear={true}/>
                    <div className="right-menu">
                        <div className="right-btn" hidden={this.stateisLoading} onClick={this.showModal}>
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
                title={this.state.id <= 0 ? "Nuevo Coordinador" : "Modificar Coordinador"}
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                cancelText="Cancelar"
                destroyOnClose={true}
                okText="Ok"
                width='70%'
            >

            <Spin spinning={this.state.loadingModal} tip="Cargando Archivos...">
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
                    <Input placeholder="Nombre" id="Nombre"  onChange={this.onChangeInput}
                    defaultValue={this.state.id <= 0 ? undefined : lastInfo.get("Nombre")} />
                </Col>
                <Col span={12}>
                    <h1>Teléfono</h1>
                    <Input placeholder="Telefono" type="number" id="Telefono" onChange={this.onChangeInput}
                    defaultValue={this.state.id <= 0 ? undefined : lastInfo.get("Telefono")} />
                </Col>
                <Col span={12}>
                    <h1>Apellido</h1>
                    <Input placeholder="Apellido" id="Apellido" onChange={this.onChangeInput}
                    defaultValue={this.state.id <= 0 ? undefined : lastInfo.get("Apellido")} />
                </Col>
                <Col span={12}>
                    <h1>Domicilio</h1>
                    <Input placeholder="Domicilio" id="Domicilio" onChange={this.onChangeInput}
                    defaultValue={this.state.id <= 0 ? undefined : lastInfo.get("Domicilio")} />
                </Col>
                <Col span={12}>
                    <h1>DNI</h1>
                    <Input placeholder="DNI" type="number" id="DNI" onChange={this.onChangeInput}
                    defaultValue={this.state.id <= 0 ? undefined : lastInfo.get("DNI")} />
                </Col>
                <Col span={12}>
                    <h1>E-Mail</h1>
                    <Input placeholder="Email" id="Email" onChange={this.onChangeInput}
                    defaultValue={this.state.id <= 0 ? undefined : lastInfo.get("Email")} />
                </Col>
                <Col span={12}>
                    <h1>CUIL</h1>
                    <Input placeholder="CUIL" type="number" id="CUIL" onChange={this.onChangeInput}
                    defaultValue={this.state.id <= 0 ? undefined : lastInfo.get("CUIL")} />
                </Col>
            </Row>
            <Divider orientation="left">Datos de Facturación</Divider>
            <Row gutter={[48,20]}>
                <Col span={12}>
                    <h1>Entidad Bancaria</h1>
                    <Input placeholder="Entidad Bancaria" id="EntidadBancaria" onChange={this.onChangeInput}
                    defaultValue={this.state.id <= 0 ? undefined : lastInfo.get("EntidadBancaria")} />
                </Col>
                <Col span={12}>
                    <h1>CBU/ALIAS</h1>
                    <Input placeholder="CBU/ALIAS" id="CBU" onChange={this.onChangeInput}
                    defaultValue={this.state.id <= 0 ? undefined : lastInfo.get("CBU")} />
                </Col>
                <Col span={12}>
                    <h1>Constancia AFIP</h1>
                    <Upload {...this.propsConstanciaAFIP} accept="application/pdf">
                        <Button type="primary" disabled={this.state.afipFiles.length>0} icon={<UploadOutlined />}>Subir PDF</Button>
                    </Upload>
                    <Button onClick={() => this.setState({pdf:1, pdfViewer: true})}
                        hidden={this.state.id <= 0 || !fileUrlAFIP}
                    >Ver Actual</Button>
                </Col>
                <Col span={12}>
                    <h1>Valor por Mes</h1>
                    <Input placeholder="Valor Mes" type="number" id="ValorMes" onChange={this.onChangeInput}
                    defaultValue={this.state.id <= 0 ? undefined : lastInfo.get("ValorMes")} />
                </Col>
                <Col span={12}>
                    <h1>CV</h1>
                    <Upload {...this.propsCV} accept="application/pdf">
                        <Button type="primary" disabled={this.state.cvFiles.length>0} icon={<UploadOutlined />}>Subir PDF</Button>
                    </Upload>
                    <Button onClick={() => this.setState({pdf:2, pdfViewer: true})}
                        hidden={this.state.id <= 0 || !fileUrlCV}
                    >Ver Actual</Button>
                </Col>
            </Row>        
            </Form> 
            </Spin>             
            </Modal>
            
            <VisorPDF
                    fileURL={this.state.pdf===1?fileUrlAFIP:fileUrlCV}
                    fileName={this.state.id>0?infoDatos[this.state.id - 1].Apellido + this.state.pdf===1?"_ConstanciaAFIP":"_CV" + ".pdf":""}
                    visible={this.state.pdfViewer}
                    onCancel={()=> this.setState({pdfViewer: false})}
            />
        </div>
    )}
    
}

export default Coordinadores