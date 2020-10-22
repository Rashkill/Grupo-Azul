import React from 'react';
import { Divider, Row, Col, Input, Modal, Empty, Form, AutoComplete, Upload, Button, DatePicker, notification} from 'antd';
import { PlusOutlined, LoadingOutlined, UploadOutlined, CheckCircleOutlined, AlertOutlined } from '@ant-design/icons';
import BenefCard from './benef-card'
import Axios from 'axios';

const { Search } = Input;

var ucds = [];
var coords = [];
var coordIndex = -1;
var lastInfo = new FormData();
var fileBlob, fileURL;


class Beneficiarios extends React.Component{

    state = {
        visible: false,
        isLoading: true,
        cantidad: 0,
        fileList: [],
        editId: 0
    };

    abortController = new AbortController();

    //Secuencia que obtiene la informacion y luego desactiva el icono de carga
    getData = () =>{
        this.loadAndGetData().then(() => this.setState({isLoading: false}));
    }

    //Obtiene la informacion de la base de datos
    loadAndGetData = async() => {
        try{
            const fields = "Id, Nombre, Apellido, DNI, CUIL, FechaNacimiento, Domicilio, Localidad, CodigoPostal, Email, Telefono, Enfermedades, IdCoordinador"
            const resBenef = await fetch('http://localhost:4000/getBenef/' + fields, {signal: this.abortController.signal});
            const datosBenef = await resBenef.json();
            if(datosBenef)
                ucds = datosBenef;

            const res = await fetch('http://localhost:4000/getCoord/Nombre,Apellido,Id', {signal: this.abortController.signal});
            const datos = await res.json();
            if(datos)
                coords = datos.map(c => ({
                    value: c.Nombre + " " + c.Apellido,
                    id: c.Id
                }));

            this.setState({cantidad: ucds.length, isLoading: false})
        }catch(e){}
    }

    //Obtiene los archivos
    getPdf = async(id) =>{
        try{
            const res = await fetch('http://localhost:4000/getBenefOnly/'+ id +'/FichaInicial', {signal: this.abortController.signal});
            const datos = await res.json();
            console.log(datos);

            this.fileBlob = new Blob([Buffer.from(datos[0].FichaInicial)], {type: "application/pdf"})
            this.fileUrl = URL.createObjectURL(this.fileBlob)
        } 
        catch(e){console.log(e)}
    }

    //Se ejecuta al montar el componente
    componentDidMount()
    {
        this.getData();
    }

    //Se ejecuta al desmontar el componente
    componentWillUnmount()
    {
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
        //Si la 'editID' es menor o igual a 0, significa que se esta agregando uno nuevo
        if(this.state.editId <=0)
        {
            //Se asigna el archivo desde la lista y se llama a la base de datos
            lastInfo.set("FichaInicial", this.state.fileList[0])
            Axios.post('http://localhost:4000/addBenef', lastInfo, {
                headers: {
                    Accept: 'application/json'
                }
            }).then(() => {
                //Se establecen los valores por defecto y se abre la notificacion
                this.setState({
                    visible: false,
                    editId: 0,
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
            Axios.post('http://localhost:4000/updBenef/' + this.state.editId, lastInfo, {
                headers: {
                    Accept: 'application/json'
                }
            }).then(() => {
                //Se establecen los valores por defecto y se abre la notificacion
                this.setState({
                    visible: false,
                    editId: 0,
                    fileList: []
                })
                this.openNotification("Datos Actualizados",
                "El acompañante fue actualizado correctamente", true);
                this.getData();
            });
        }
    };

    //Al cancelar la ventana
    handleCancel = e => {   
        var confirm = window.confirm('¿Desea cerrar el formulario? Se perderán los cambios no guardados')
        if(confirm){
            this.setState({visible: false, editId: 0})
        }
    };

    //Presionar enter al buscador
    handleSearch = (v) => { 
        console.log(v)
    }
    
    //Se llama al presionar el boton 'Editar' en la tarjeta
    onEdit = (id) => {

        //Se obtiene el index del array, segun la Id a editar
        //Luego se rellenan los campos correspondientes
        let index = ucds.findIndex(p => p.Id == id);
        for (var prop in ucds[index]) {
            lastInfo.set(prop, ucds[index][prop]);
        }
        coordIndex = coords.findIndex(v => v.id == lastInfo.get("IdCoordinador"));
        this.getPdf(id).then(() => this.setState({editId:id, visible: true}));
    }

    //Se llama al presionar el boton 'Eliminar' en la tarjeta
    onDelete = (id) => {
        if(window.confirm('¿Realmente desea eliminar esta tabla?'))
        Axios.delete('http://localhost:4000/benef/' + id, lastInfo).then(() => {
                this.openNotification(
                    "Eliminación exitosa",
                    "La jornada se borró correctamente",
                    true
                )
                this.getData();
            }
        );
    }

    modalGetValue = (e) =>{
        console.log(e);
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
            console.log(file);
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

                        <div className="cards-container">
                        <Empty style={{display: this.state.isLoading ? "none" : ucds.length > 0 ? "none" : "inline"}} description={false} />
                        {ucds.map(p =>{
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

                    </Col>
                    <Col span={6}>
                        <Search placeholder="Buscar..." style={{width: '95%', margin: 8, marginRight: 16}} onSearch={value => this.handleSearch(value)} allowClear={true}/>
                        <div className="right-menu">
                            <div className="right-btn" onClick={this.showModal}>
                                <PlusOutlined />
                                <span className="right-btn-text">Nuevo</span>
                            </div>
                        </div>
                    </Col>
                </Row>


                <Modal
                    title={this.state.editId <=0 ? "Nuevo Beneficiario" : "Modificar Beneficiario"}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    cancelText="Cancelar"
                    destroyOnClose={true}
                    okText="Ok"
                    centered={true}
                    width={800}
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
                        <h4>Nombre:</h4>
                            <Input placeholder="Nombre" id="Nombre" onChange={this.onChangeInput}
                            defaultValue={this.state.editId <=0 ? this.value : lastInfo.get("Nombre")} />
                        </Col>
                        <Col span={12}>
                            <h4>Telefono:</h4>
                            <Input placeholder="Telefono" type="number" id="Telefono" onChange={this.onChangeInput}
                            defaultValue={this.state.editId <=0 ? this.value : lastInfo.get("Telefono")}/>
                        </Col>
                        <Col span={12}>
                            <h4>Apellido:</h4>
                            <Input placeholder="Apellido" id="Apellido" onChange={this.onChangeInput}
                            defaultValue={this.state.editId <=0 ? this.value : lastInfo.get("Apellido")}/>
                        </Col>
                        <Col span={12}>
                            <h4>Domicilio:</h4>
                            <Input placeholder="Domicilio" id="Domicilio" onChange={this.onChangeInput}
                            defaultValue={this.state.editId <=0 ? this.value : lastInfo.get("Domicilio")}/>
                        </Col>
                        <Col span={12}>
                            <h4>DNI:</h4>
                            <Input placeholder="DNI" type="number" id="DNI" onChange={this.onChangeInput}
                            defaultValue={this.state.editId <=0 ? this.value : lastInfo.get("DNI")}/>
                        </Col>
                        <Col span={12}>
                            <h4>Localidad:</h4>
                            <Input placeholder="Localidad" id="Localidad" onChange={this.onChangeInput}
                            defaultValue={this.state.editId <=0 ? this.value : lastInfo.get("Localidad")}/>
                        </Col>
                        <Col span={12}>
                            <h4>Fecha de Nacimiento:</h4>
                            <DatePicker placeholder="Fecha de Nacimiento" id="FechaNacimiento"
                                format="DD / MM / YYYY"
                                style={{width: '100%'}}
                                onChange={(e) =>{lastInfo.set("FechaNacimiento", e.format('DD/MM/YYYY'))}}
                            />
                        </Col>
                        <Col span={12}>
                            <h4>CUIL:</h4>
                            <Input placeholder="CUIL" type="number" id="CUIL" onChange={this.onChangeInput}
                            defaultValue={this.state.editId <=0 ? this.value : lastInfo.get("CUIL")}/>
                        </Col>
                        <Col span={12}>
                            <h4>Codigo Postal:</h4>
                            <Input placeholder="Codigo Postal" id="CodigoPostal" onChange={this.onChangeInput}
                            defaultValue={this.state.editId <=0 ? this.value : lastInfo.get("CodigoPostal")}/>
                        </Col>
                        <Col span={12}>
                            <h4>Email:</h4>
                            <Input placeholder="Email" id="Email" onChange={this.onChangeInput}
                            defaultValue={this.state.editId <=0 ? this.value : lastInfo.get("Email")}/>
                        </Col>
                        <Col span={12}>
                            <h4>Enfermedades:</h4>
                            <Input placeholder="Enfermedades" id="Enfermedades" onChange={this.onChangeInput}
                            defaultValue={this.state.editId <=0 ? this.value : lastInfo.get("Enfermedades")}/>
                        </Col>
                        <Col span={12}>
                            <h4>Coordinador:</h4>
                            <AutoComplete 
                                placeholder="Coordinador" 
                                id="IdCoordinador"
                                allowClear
                                onChange={this.onChangeInput} 
                                style={{ width: '100%' }}
                                options={coords}
                                filterOption={(inputValue, option) =>
                                    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) + 1 !== 0}
                                onChange = {(e, value, reason) => {
                                    if(e === undefined) return;
                                    var prop = coords.find(v => v.value == e);
                                    if(prop)
                                        lastInfo.set("IdCoordinador",prop.id);
                                }}
                                defaultValue={this.state.editId <=0 ? this.value : coordIndex > -1 ? coords[coordIndex].value : "[Coordinador Borrado]"}
                            />
                        </Col>
                        <Col span={12}>
                            <h4>Ficha Inicial:</h4>
                            <Upload {...this.FichaInicial} id="FichaInicial" 
                                    accept="application/pdf">
                                <Button disabled={this.state.fileList.length>0} icon={<UploadOutlined />}>Subir PDF</Button>
                            </Upload>
                            <a href={fileURL} 
                                download={this.state.editId >0 ? ucds[this.state.editId - 1].Apellido + "_FichaInicial.pdf" : "_.pdf"}
                                hidden={this.state.editId <= 0}
                            >
                            Descargar
                            </a>
                        </Col>
                    </Row>
                    
                </Form>
                </Modal>
            </div>
        )
    }
}

export default Beneficiarios