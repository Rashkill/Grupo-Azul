import React from 'react';
import { Divider, Row, Col, Input, Modal, Empty, Form, AutoComplete, Upload, Button, DatePicker, notification, Pagination, Spin} from 'antd';
import { PlusOutlined, LoadingOutlined, UploadOutlined, CheckCircleOutlined, AlertOutlined, InfoCircleOutlined } from '@ant-design/icons';

import VisorPDF from '../util/visorPDF';
import BenefCard from './benef-card'

import Axios from 'axios';

const moment = require('moment');
const { Search } = Input;

var infoDatos = [], infoFiltro = [];
var coords = [];
var index = -1, coordIndex = -1;
var lastInfo = new FormData();
var fileBlob, fileURL;

var maxItems;
const maxRows = 5;
var rowOffset = 0;

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

class Beneficiarios extends React.Component{
    state = {
        visible: false,
        isLoading: true,
        cantidad: 0,
        fileList: [],
        id: 0,
        pdfViewer: false,
        filterSearch: "",
        loadingModal: false
    };
    
    abortController = new AbortController();

    //Secuencia que obtiene la informacion y luego desactiva el icono de carga
    getData = () =>{
        infoDatos = []; infoFiltro = [];
        window.scrollTo(0,0);
        this.loadAndGetData().then(() => this.setState({isLoading: false}));
    }

    //Obtiene la informacion de la base de datos
    loadAndGetData = async() => {
        try{
            const result = await fetch('http://localhost:4000/getBenef/Id', {signal: this.abortController.signal});
            const data = await result.json();
            maxItems = data.length;

            const fields = "Id, Nombre, Apellido, DNI, CUIL, FechaNacimiento, Domicilio, Localidad, CodigoPostal, Email, Telefono, Enfermedades, IdCoordinador"
            const resBenef = await fetch('http://localhost:4000/getBenef/' + fields + '/' + maxRows + '/' + rowOffset, {signal: this.abortController.signal});
            const datosBenef = await resBenef.json();
            
            if(datosBenef)
                infoDatos = datosBenef;
            infoFiltro = infoDatos;

            const res = await fetch('http://localhost:4000/getCoord/Nombre,Apellido,DNI,Id', {signal: this.abortController.signal});
            const datos = await res.json();
            if(datos)
                coords = datos.map(c => ({
                    value: c.Nombre + " " + c.Apellido,
                    dni: c.DNI,
                    id: c.Id
            }));

            this.setState({cantidad: infoFiltro.length, isLoading: false})
        }catch(e){}
    }

    //Obtiene los archivos
    getPdf = async(id) =>{
        try{
            const res = await fetch('http://localhost:4000/getBenefOnly/'+ id +'/FichaInicial', {signal: this.abortController.signal});
            const datos = await res.json();

            fileBlob = new Blob([Buffer.from(datos[0].FichaInicial.data)], {type: "application/pdf"})
            fileURL = URL.createObjectURL(fileBlob)
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
        coordIndex = -1;
    };

    
    //Se llama al presionar el boton OK
    handleOk = e => {
        //Se obtiene la Latitud y la Longitud
        Axios(`http://dev.virtualearth.net/REST/v1/Locations?q=${lastInfo.get("Domicilio")}%20${lastInfo.get("CodigoPostal")}%20${lastInfo.get("Localidad")}%20argentina&maxResults=1&key=Arn6kit_Moqpx-2p7jWVKy1h-TlLyYESkqc1cHzP1JkEAm1A_86T8o3FtDcKqnVV`)
            .then(response => {
                let coords = (response.data.resourceSets[0].resources[0].geocodePoints[0].coordinates);
                lastInfo.set("Latitud", coords[0]); lastInfo.set("Longitud", coords[1]);
        }).then(()=>{
            //Si la 'id' es menor o igual a 0, significa que se esta agregando uno nuevo
            if(this.state.id <=0)
            {
                //Se asigna el archivo desde la lista y se llama a la base de datos
                lastInfo.set("FichaInicial", this.state.fileList[0])
                lastInfo.set("CUIL", lastInfo.get("CUIL1")+"-"+lastInfo.get("CUIL2"))
                Axios.post('http://localhost:4000/addBenef', lastInfo, {
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
                    "El beneficiario " + lastInfo.get("Apellido") + " ahora se encuentra en la lista", true);
                    this.getData();
                });
            }
            else    //Parte de la actualizacion
            {   
                //Se comprueba que no se haya subido un archivo nuevo.
                //De lo contrario, se utiliza el que ya estaba
                if(this.state.fileList.length >= 1)
                    lastInfo.set("FichaInicial", this.state.fileList[0]);
                else
                    lastInfo.set("FichaInicial", fileBlob)

                lastInfo.set("CUIL", lastInfo.get("CUIL1")+"-"+lastInfo.get("CUIL2"))
                Axios.post('http://localhost:4000/updBenef/' + this.state.id, lastInfo, {
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
                    "El beneficiario fue actualizado correctamente", true);
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
            let table = "Beneficiario";
            let column = "Nombre,Apellido";
            let k = v.split(':');
            if(k.length > 1){
                column = k[0];
                pattern = k[1].replace(/^\s+/g, '');
            }
            try{
                const fields = "Id, Nombre, Apellido, DNI, CUIL, FechaNacimiento, Domicilio, Localidad, CodigoPostal, Email, Telefono, Enfermedades, IdCoordinador"
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
        coordIndex = coords.findIndex(x => x.id == lastInfo.get('IdCoordinador'));

        this.abortController = new AbortController();
        this.setState({id:id, visible: true, loadingModal: true})
        this.getPdf(id).then(() => this.setState({loadingModal: false}));
    }

    //Se llama al presionar el boton 'Eliminar' en la tarjeta
    onDelete = (id) => {
        Modal.confirm({
            title:'¿Realmente desea eliminar este elemento?',
            content: 'Esto eliminará toda información relacionada con el beneficiario\nEsta acción no se puede deshacer.',
            okText: 'Si', cancelText: 'No',
            onOk:(()=>{
                Axios.delete('http://localhost:4000/delRecord/Jornada/IdBeneficiario=' + id).then(() =>
                Axios.delete('http://localhost:4000/delRecord/Liquidacion/IdBeneficiario=' + id).then(() =>
                Axios.delete('http://localhost:4000/benef/' + id).then(() => {
                    this.openNotification(
                        "Eliminación exitosa",
                        "El Beneficiario se borró correctamente",
                        true
                    );
                    this.getData();
                })));
            })
        })
    }

    //Se asigna o elimina el archivo
    FichaInicial = {
        onRemove: file => {
                this.setState({fileList: []})
                return true;
        },
        beforeUpload: file => {
            let fileL = []; fileL.push(file);
            this.setState({fileList: fileL})
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
                                Beneficiarios
                            </h1>
                        </Divider>

                        {/* CARTAS BENEFICIARIOS */}
                        <div className="cards-container">
                        <Empty style={{display: this.state.isLoading ? "none" : infoFiltro.length > 0 ? "none" : "inline"}} description={false} />
                        
                        {infoFiltro.map(p =>{
                            return(
                            <BenefCard 
                                title={p.Nombre + " " + p.Apellido}
                                domicilio={p.Domicilio}
                                telefono={p.Telefono}
                                linkto="/benefprofile"
                                key={p.Id}
                                id={p.Id}
                                OnEdit={this.onEdit}
                                OnDelete={this.onDelete}
                            />)
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
                    title={this.state.id <=0 ? "Nuevo Beneficiario" : "Modificar Beneficiario"}
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
                    <Divider orientation="left">Datos Principales</Divider>
                    <Row gutter={[48,20]}>
                        <Col span={12}>
                            <h4>Nombre:</h4>
                            <Input placeholder="Nombre" id="Nombre" onChange={this.onChangeInput}
                            defaultValue={this.state.id <=0 ? this.value : lastInfo.get("Nombre")} />
                        </Col>
                        <Col span={12}>
                            <h4>Apellido:</h4>
                            <Input placeholder="Apellido" id="Apellido" onChange={this.onChangeInput}
                            defaultValue={this.state.id <=0 ? this.value : lastInfo.get("Apellido")}/>
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
                            <h4>Fecha de Nacimiento:</h4>
                            <DatePicker placeholder="Fecha de Nacimiento" id="FechaNacimiento"
                                format="DD/MM/YYYY"
                                style={{width: '100%'}}
                                defaultValue={this.state.id<=0? "" :  moment(lastInfo.get("FechaNacimiento"), "DD/MM/YYYY")}
                                onChange={(e) =>{e ? lastInfo.set("FechaNacimiento", e.format('DD-MM-YYYY')) : lastInfo.set("FechaNacimiento", null)}}
                            />
                        </Col>
                        <Col span={12}>
                            <h4>Domicilio:</h4>
                            <Input placeholder="Domicilio" id="Domicilio" onChange={this.onChangeInput}
                            defaultValue={this.state.id <=0 ? this.value : lastInfo.get("Domicilio")}/>
                        </Col>
                        <Col span={12}>
                            <h4>Localidad:</h4>
                            <Input placeholder="Localidad" id="Localidad" onChange={this.onChangeInput}
                            defaultValue={this.state.id <=0 ? this.value : lastInfo.get("Localidad")}/>
                        </Col>
                        <Col span={12}>
                            <h4>Codigo Postal:</h4>
                            <Input placeholder="Codigo Postal" id="CodigoPostal" onChange={this.onChangeInput}
                            defaultValue={this.state.id <=0 ? this.value : lastInfo.get("CodigoPostal")}/>
                        </Col>
                        <Col span={12}>
                            <h4>Telefono:</h4>
                            <Input placeholder="Telefono" type="number" id="Telefono" onChange={this.onChangeInput}
                            defaultValue={this.state.id <=0 ? this.value : lastInfo.get("Telefono")}/>
                        </Col>
                        <Col span={12}>
                            <h4>Email:</h4>
                            <Input placeholder="Email" id="Email" onChange={this.onChangeInput}
                            defaultValue={this.state.id <=0 ? this.value : lastInfo.get("Email")}/>
                        </Col>
                        <Col span={12}>
                            <h4>Enfermedades:</h4>
                            <Input placeholder="Enfermedades" id="Enfermedades" onChange={this.onChangeInput}
                            defaultValue={this.state.id <=0 ? this.value : lastInfo.get("Enfermedades")}/>
                        </Col>
                        <Col span={12}>
                            <h4>Coordinador:</h4>
                            <AutoComplete 
                                placeholder="Coordinador" 
                                id="IdCoordinador"
                                allowClear
                                onChange={this.onChangeInput} 
                                style={{ width: '100%' }}
                                options={coords.map(i => renderItem(i.value, i.dni))}
                                filterOption={(inputValue, option) =>
                                    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) + 1 !== 0}
                                onChange = {(e, value, reason) => {
                                    if(e === undefined) return;
                                    var prop = coords.find(v => v.value == e);
                                    if(prop)
                                        lastInfo.set("IdCoordinador",prop.id);
                                }}
                                defaultValue={this.state.id <=0 ? this.value : coordIndex > -1 ? coords[coordIndex].value : "[Coordinador Borrado]"}
                            />
                        </Col>
                        <Col span={12}>
                            <h4>Ficha Inicial:</h4>
                            <Upload {...this.FichaInicial} id="FichaInicial" 
                                    accept="application/pdf">
                                <Button type="primary" disabled={this.state.fileList.length>0} icon={<UploadOutlined />}>Subir PDF</Button>
                            </Upload>
                            
                            <Button onClick={() => this.setState({pdfViewer: true})}
                                hidden={this.state.id <= 0 || !fileURL}
                            >Ver PDF Actual</Button>
                        </Col>
                    </Row>
                </Form>
                </Spin>
                </Modal>

                <VisorPDF
                    fileURL={fileURL}
                    fileName={this.state.id>0?infoDatos[index].Apellido + "_FichaInicial.pdf":""}
                    visible={this.state.pdfViewer}
                    onCancel={()=> this.setState({pdfViewer: false})}
                />
            </div>
        )
    }
}

export default Beneficiarios