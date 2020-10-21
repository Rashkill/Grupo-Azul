import React from 'react';
import { Divider, Row, Col, Input, Modal, Empty, Form, AutoComplete, Upload, Button, DatePicker, notification} from 'antd';
import { PlusOutlined, LoadingOutlined, UploadOutlined, CheckCircleOutlined, AlertOutlined } from '@ant-design/icons';
import BenefCard from './benef-card'
import Axios from 'axios';

const { Search } = Input;

var ucds = [];
var coords = [];
var lastInfo = new FormData();
var fileBlob, fileURL;
const abortController = new AbortController();

class Beneficiarios extends React.Component{

    state = {
        visible: false,
        isLoading: true,
        cantidad: 0,
        fileList: [],
        editId: 0
    };

    getData = () =>{
        this.setState({isLoading: true})
        this.loadAndGetData().then(this.setState({isLoading: false}));
    }

    loadAndGetData = async() => {
        try{
            const resBenef = await fetch('http://localhost:4000/getBenef', {signal: abortController.signal});
            const datosBenef = await resBenef.json();
            ucds = datosBenef.data;

            const res = await fetch('http://localhost:4000/getCoord', {signal: abortController.signal});
            const datos = await res.json();
            coords = datos.map(c => ({
                value: c.Nombre + " " + c.Apellido
            }));

            this.setState({cantidad: ucds.length})
        }catch(e){}
    }

    componentDidMount()
    {
        this.getData();
    }

    componentWillUnmount()
    {
        abortController.abort();
    }

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

    
    //maneja boton ok del modal
    handleOk = e => {   
        if(this.state.editId <=0){

            lastInfo.set("FichaInicial", this.state.fileList[0])
            Axios.post('http://localhost:4000/addBenef', lastInfo, {
                headers: {
                    Accept: 'application/json'
                }
            }).then(() => {this.setState({
                visible: false,
                editId: 0
                })
                this.getData();
            });
        }
        else{
            
            if(this.state.fileList.length >= 1)
                lastInfo.set("FichaInicial", this.state.fileList[0]);
            else
                lastInfo.set("FichaInicial", fileBlob)
            Axios.post('http://localhost:4000/updBenef/' + this.state.editId, lastInfo, {
                headers: {
                    Accept: 'application/json'
                }
            }).then(() => {this.setState({
                visible: false,
                editId: 0
                })
                this.getData();
            });
        }
        console.log(lastInfo);
    };

    //cancelar modal
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
    
    onEdit = (id) => {
        this.setState({editId: id, visible: true})

        let index = ucds.findIndex(p => p.Id === id);
        for (var prop in ucds[index]) {
            lastInfo.set(prop, ucds[index][prop]);
            //console.log(ucds[id - 1][prop])
            if(prop === "FichaInicial"){
                fileBlob = new Blob([Buffer.from(ucds[index][prop])], {type: "application/pdf"})
                fileURL = URL.createObjectURL(fileBlob);
            }
        }
    }

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
                            <AutoComplete placeholder="Coordinador" id="IdCoordinador" 
                                onChange={this.onChangeInput} 
                                style={{ width: '100%' }}
                                options={coords}
                                filterOption={(inputValue, option) =>
                                    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) + 1 !== 0}
                                onChange = {(e, value, reason) => {
                                    if(e === undefined) return;
                                    var id = coords.findIndex(v => v.value == e);
                                    if(id !== -1)
                                        lastInfo.coordID = id+1;
                                    console.log(lastInfo.coordID);
                                }}
                                defaultValue={this.state.editId <=0 ? this.value : lastInfo.get("IdCoordinador")}
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