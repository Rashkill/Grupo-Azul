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

var index = -1;
var maxItems = 0;
const maxRows = 5;
var rowOffset = 0;

class Coordinadores extends React.Component{
    state = {
        visible: false,
        isLoading: true,
        cantidad: 0,
        afipFiles:[],
        cvFiles:[],
        id: 0,
        pdfViewer1: false,
        pdfViewer2: false,
        pdfFileName: "",
        filterSearch: "",
        loadingModal: false
    };
    
    abortController = new AbortController();

    //Secuencia que obtiene la informacion y luego desactiva el icono de carga
    getData = () =>{
        window.scrollTo(0,0);
        this.loadAndGetData().then(() => this.setState({isLoading: false}));
    }

    //Obtiene la informacion de la base de datos
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

            this.setState({cantidad: infoFiltro.length, isLoading: false})
        }catch(e){}
    }

    //Obtiene los archivos
    getPdf = async(id) =>{
        try{
            const res = await fetch('http://localhost:4000/getCoordOnly/'+ id +'/ConstanciaAFIP,CV', {signal: this.abortController.signal});
            const datos = await res.json();

            fileBlobAFIP = new Blob([Buffer.from(datos[0].ConstanciaAFIP)], {type: "application/pdf"})
            fileUrlAFIP = URL.createObjectURL(fileBlobAFIP)
            
            fileBlobCV = new Blob([Buffer.from(datos[0].CV)], {type: "application/pdf"})
            fileUrlCV = URL.createObjectURL(fileBlobCV)
        } 
        catch(e){console.log(e)}
    }
    
    //Se ejecuta al montar el componente
    componentDidMount(){
        this.getData();
    }

    //Se ejecuta al desmontar el componente
    componentWillUnmount(){
        rowOffset = 0;
        infoDatos = [];
        this.abortController.abort();
    }

    //Notificacion (duh)
    openNotification = (msg, desc, succeed) => {
        this.setState({
            editVisible: false,
        });

        notification.open({
            message: msg,
            description: desc,
            icon: succeed ? 
            <CheckCircleOutlined style={{ color: '#52C41A' }} /> : 
            <AlertOutlined style={{ color: '#c4251a' }} />
        });
    };
    
    //Mostrar modal
    showModal = () => {     
        this.setState({
        visible: true,
        });
    };

    
    //Se llama al presionar el boton OK
    handleOk = e => {
        //Se obtiene la Latitud y la Longitud
        Axios(`http://dev.virtualearth.net/REST/v1/Locations?q='${lastInfo.get("Domicilio")} ${lastInfo.get("Localidad")} ${lastInfo.get("CodigoPostal")}'argentina&maxResults=1&key=Arn6kit_Moqpx-2p7jWVKy1h-TlLyYESkqc1cHzP1JkEAm1A_86T8o3FtDcKqnVV`)
            .then(response => {
                let coords = (response.data.resourceSets[0].resources[0].geocodePoints[0].coordinates);
                lastInfo.set("Latitud", coords[0]); lastInfo.set("Longitud", coords[1]);
        }).then(()=>{  
            //Si la 'id' es menor o igual a 0, significa que se esta agregando uno nuevo
            if(this.state.id <=0)
            {
                //Se asigna el archivo desde la lista y se llama a la base de datos
                lastInfo.set("ConstanciaAFIP", this.state.afipFiles[0])
                lastInfo.set("CV", this.state.cvFiles[0])
                lastInfo.set("CUIL", lastInfo.get("CUIL1")+"-"+lastInfo.get("CUIL2"))
                Axios.post('http://localhost:4000/addCoord', lastInfo, {
                    headers: {
                        Accept: 'application/json'
                    }
                }).then(() => {
                    //Se establecen los valores por defecto y se abre la notificacion
                    this.setState({
                        visible: false,
                        id: 0,
                        fileList: []
                    })
                    this.openNotification("Datos Agregados",
                    "El coordinador " + lastInfo.get("Apellido") + " ahora se encuentra en la lista", true);
                    this.getData();
                });
            }
            else    //Parte de la actualizacion
            {   
                //Se comprueba que no se haya subido un archivo nuevo.
                //De lo contrario, se utiliza el que ya estaba
                if(this.state.afipFiles>0)
                    lastInfo.set("ConstanciaAFIP", this.state.afipFiles[0])
                else
                    lastInfo.set("ConstanciaAFIP", fileBlobAFIP)

                if(this.state.cvFiles>0)
                    lastInfo.set("CV", this.state.cvFiles[0])
                else
                    lastInfo.set("CV", fileBlobCV)

                lastInfo.set("CUIL", lastInfo.get("CUIL1")+"-"+lastInfo.get("CUIL2"))
                Axios.post('http://localhost:4000/updCoord/' + this.state.id, lastInfo, {
                    headers: {
                        Accept: 'application/json'
                    }
                }).then(() => {
                    //Se establecen los valores por defecto y se abre la notificacion
                    this.setState({
                        visible: false,
                        id: 0,
                        fileList: []
                    })
                    this.openNotification("Datos Actualizados",
                    "El coordinador fue actualizado correctamente", true);
                    this.getData();
                });
            }
        })
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
            try{
                const fields = "Id, Nombre, Apellido, DNI, CUIL, EntidadBancaria, CBU, Domicilio, ValorMes"
                const result = await fetch('http://localhost:4000/find/' + fields + '/' + table + '/' + column + '/' + pattern, {signal: this.abortController.signal});
                const data = await result.json();
                if(data.error)
                    this.openNotification('Error de busqueda', `"${column}" no es un criterio de busqueda valido`, false);
                else
                    infoFiltro = data;
            }
            catch(e){console.log(e); infoFiltro = infoDatos;}
        }
        else infoFiltro = infoDatos;
        
        this.setState({cantidad: infoFiltro.length});
    } 

    //Se llama al presionar el boton 'Editar' en la tarjeta
    onEdit = (id) => {

        //Se obtiene el index del array, segun la Id a editar
        //Luego se rellenan los campos correspondientes
        index = infoDatos.findIndex(p => p.Id == id);
        for (var prop in infoDatos[index]) {
            if(prop != "CUIL")
                lastInfo.set(prop, infoDatos[index][prop]);
            else{
                let cuil = infoDatos[index].CUIL.split('-');
                lastInfo.set("CUIL1", cuil[0]);
                if(cuil.length>1)
                    lastInfo.set("CUIL2", cuil[1]);
                else
                    lastInfo.set("CUIL2", "");
            }
        }

        this.abortController = new AbortController();
        this.setState({id:id, visible: true, loadingModal: true})
        this.getPdf(id).then(() => this.setState({loadingModal: false}));
    }

    //Se llama al presionar el boton 'Eliminar' en la tarjeta
    onDelete = (id) => {
        Modal.confirm({
            title:'¿Realmente desea eliminar este elemento?',
            content: 'Esta acción no se puede deshacer.',
            okText: 'Si', cancelText: 'No',
            onOk:(()=>{
                Axios.delete('http://localhost:4000/acomp/' + id).then(() => {
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

    //Se asigna o elimina el archivo
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

    //Se asignan los campos correspondientes
    onChangeInput = (e) => {
        lastInfo.set(e.target.id, e.target.value);
    }


    render(){
        return(
            <div className="content-cont prot-shadow">
                <Row>
                    <Col span={18}>
                        <Divider orientation="left">
                            <h1 className="big-title">
                                Coordinadores
                            </h1>
                        </Divider>

                        {/* CARTAS COORDINADORES */}
                        <div className="cards-container">
                        <Empty style={{display: this.state.isLoading ? "none" : infoFiltro.length > 0 ? "none" : "inline"}} description={false} />
                        
                        {infoFiltro.map((i , index)=>{
                            return(
                                <CoordCard
                                id = {i.Id}
                                OnEdit= {this.onEdit}
                                OnDelete= {this.onDelete}
                                Nombre= {i.Nombre}
                                Apellido= {i.Apellido}
                                ValorMes= {i.ValorMes}
                                Domicilio= {i.Domicilio}
                                key= {i.Id}
                                linkto="coordprofile"
                                />
                            )
                        })}
                        <LoadingOutlined style={{ padding: 16, fontSize: 24, display: this.state.isLoading ? "inline" : "none" }} spin />
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
                        <Search placeholder="Buscar..." style={{width: '95%', margin: 8, marginRight: 16}} onSearch={e => this.handleSearch(e)} allowClear={true}/>
                        <div className="right-menu">
                            <div className="right-btn" onClick={this.showModal}>
                                <PlusOutlined />
                                <span className="right-btn-text">Nuevo</span>
                            </div>
                        </div>
                    </Col>
                </Row>


                <Modal
                    title={this.state.id <=0 ? "Nuevo Coordinador" : "Modificar Coordinador"}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    cancelText="Cancelar"
                    destroyOnClose={true}
                    okText="Ok"
                    centered={true}
                    width={800}
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
                        defaultValue={this.state.id === 0 ? undefined : lastInfo.get("Nombre")} />
                    </Col>
                    <Col span={12}>
                        <h1>Domicilio</h1>
                        <Input placeholder="Domicilio" id="Domicilio" onChange={this.onChangeInput} 
                        defaultValue={this.state.id === 0 ? undefined : lastInfo.get("Domicilio")} />
                    </Col>
                    <Col span={12}>
                        <h1>Apellido</h1>
                        <Input placeholder="Apellido" id="Apellido" onChange={this.onChangeInput} 
                        defaultValue={this.state.id === 0 ? undefined : lastInfo.get("Apellido")} />
                    </Col>
                    <Col span={12}>
                        <h1>Localidad</h1>
                        <Input placeholder="Localidad" type="text" id="Localidad" onChange={this.onChangeInput} 
                        defaultValue={this.state.id <=0 ? this.value : lastInfo.get("Localidad")} />
                    </Col>
                    <Col span={12}>
                        <h4>DNI/CUIL:</h4>
                            <Row gutter={12}>
                            <Col span={5}>
                                <Input placeholder="00" type="number" id="CUIL1" onChange={this.onChangeInput}
                                defaultValue={this.state.id <=0 ? this.value : lastInfo.get("CUIL1")}/>
                            </Col>
                            -
                            <Col span={12}>
                                <Input placeholder="DNI" type="number" id="DNI" onChange={this.onChangeInput}
                                defaultValue={this.state.id <=0 ? this.value : lastInfo.get("DNI")}/>
                            </Col>
                            -
                            <Col span={4}>
                                <Input placeholder="0" type="number" id="CUIL2" onChange={this.onChangeInput}
                                defaultValue={this.state.id <=0 ? this.value : lastInfo.get("CUIL2")}/>
                            </Col>
                            </Row>
                    </Col>
                    <Col span={12}>
                        <h1>Codigo Postal</h1>
                        <Input placeholder="Codigo Postal" type="number" id="CodigoPostal" onChange={this.onChangeInput} 
                        defaultValue={this.state.id <=0 ? this.value : lastInfo.get("CodigoPostal")} />
                    </Col>
                </Row>
                <Divider orientation="left">Datos de Facturación</Divider>
                <Row gutter={[48,20]}>
                    <Col span={12}>
                        <h1>Entidad Bancaria</h1>
                        <Input placeholder="Entidad Bancaria" id="EntidadBancaria" onChange={this.onChangeInput}
                        defaultValue={this.state.id === 0 ? undefined : lastInfo.get("EntidadBancaria")} />
                    </Col>
                    <Col span={12}>
                        <h1>CBU/ALIAS</h1>
                        <Input placeholder="CBU/ALIAS" id="CBU" onChange={this.onChangeInput}
                        defaultValue={this.state.id === 0 ? undefined : lastInfo.get("CBU")} />
                    </Col>
                    <Col span={12}>
                    <Row gutter={12}>
                        <Col span={12}>
                            <h1>Constancia AFIP</h1>
                            <Upload {...this.propsConstanciaAFIP} accept="application/pdf">
                                <Button type="primary" disabled={this.state.afipFiles.length>0} icon={<UploadOutlined />}>Subir PDF</Button>
                            </Upload>
                            <Button onClick={() => this.setState({pdfFileName: infoDatos[index].Apellido + "_ConstanciaAFIP" , pdfViewer1: true})}
                                    hidden={this.state.editId <= 0 || !fileUrlAFIP}
                            >Ver Actual</Button>
                        </Col>
                        <Col span={12}>
                            <h1>CV</h1>
                            <Upload {...this.propsCV} accept="application/pdf">
                                <Button type="primary" disabled={this.state.cvFiles.length>0} icon={<UploadOutlined />}>Subir PDF</Button>
                            </Upload>
                            <Button onClick={() => this.setState({pdfFileName: infoDatos[index].Apellido + "_CV", pdfViewer2: true})}
                                    hidden={this.state.editId <= 0 || !fileUrlCV}
                            >Ver Actual</Button>
                        </Col>
                    </Row>
                    </Col>
                    <Col span={12}>
                        <h1>Valor por Mes</h1>
                        <Input placeholder="Valor Mes" type="number" id="ValorMes" onChange={this.onChangeInput}
                        defaultValue={this.state.id === 0 ? undefined : lastInfo.get("ValorMes")} />
                    </Col>   
                </Row>
                </Form>
                </Spin>
                </Modal>

                <VisorPDF
                    fileURL={fileUrlAFIP}
                    fileName={this.state.pdfFileName}
                    visible={this.state.pdfViewer1}
                    onCancel={()=> this.setState({pdfViewer1: false})}
                />
                <VisorPDF
                    fileURL={fileUrlCV}
                    fileName={this.state.pdfFileName}
                    visible={this.state.pdfViewer2}
                    onCancel={()=> this.setState({pdfViewer2: false})}
                />
            </div>
        )
    }
}

export default Coordinadores