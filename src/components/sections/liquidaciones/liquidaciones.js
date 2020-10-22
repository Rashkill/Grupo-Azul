import React from 'react';
import { Divider, Row, Col, Input, Modal, AutoComplete, DatePicker, Empty, notification } from 'antd';
import { PlusOutlined, LoadingOutlined, CheckCircleOutlined, AlertOutlined } from '@ant-design/icons';
import LiqCard from './liq-card.js'
import Axios from 'axios';

const moment = require('moment');
const { Search } = Input;
const dateFormat = 'YYYY-MM-DD';
const mesesNombres = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

var liq = [];
var ucds = [];
var lastInfo = new FormData();

const getTitle = (ucdId, fecha) => {

    const f = fecha.split('/');
    var n = ucds[ucds.findIndex(v => v.id == ucdId)];

    n = n ? n.value.split(" ") : "[Eliminado]";

    var t = n==="[Eliminado]" ? "[Beneficiario Borrado]" : n[n.length -1] + ", " + n[0];
    t += " - " + f[0] + " de " + mesesNombres[parseInt(f[1] - 1, 10)];
    
    return t;
}

class Liquidaciones extends React.Component {

    state = { 
        visible: false,
        isLoading: true,
        editId: 0,
        benefIndex: -1
    };

    abortController = new AbortController();

    getData = async () => {
        try{            
            const res = await fetch('http://localhost:4000/getLiq', {signal: this.abortController.signal});
            const datos = await res.json();
            if(datos)
                liq = datos;
        }catch(e){
            liq = [];
            console.log(e);
        }
    }
    
    getBenef = async () => {
        try{            
            const resBenef = await fetch('http://localhost:4000/getBenef/' + "Nombre,Apellido,Id", {signal: this.abortController.signal});
            const datosBenef = await resBenef.json();
            if(datosBenef)
                ucds = (datosBenef.map(p => ({
                    value: p.Nombre + " " + p.Apellido, 
                    key: p.Id, id: p.Id
                })));          
        }catch(e){
            ucds = [];
            console.log(e);
        }
    }

    cargarTodo = () =>{
        this.getBenef().then(
            () => this.getData().then(
                () => this.setState({isLoading: false})))
    }

    componentDidMount(){
        this.cargarTodo();
    }

    componentWillUnmount(){
        this.abortController.abort();
    }

    //Mostrar modal
    showModal = () => {     
        this.setState({
        visible: true,
        editId: 0,
        benefIndex: -1
        });
    };

    //maneja boton ok del modal
    handleOk = e => {
        let f = new Date();
        let d = String(f.getDate()).padStart(2,0);
        let m = String(f.getMonth() + 1).padStart(2,0);
        let a = f.getFullYear();
        let fecha = `${d}/${m}/${a}`;
        lastInfo.set("FechaEmision", fecha)

        if(this.state.editId <=0){
            Axios.post('http://localhost:4000/addLiq', lastInfo, {
                    headers: {
                        Accept: 'application/json'
                    }
                }).then(() => {this.setState({
                    visible: false,
                    })
                    this.cargarTodo();
                    this.openNotification(
                        "Agregado Exitoso",
                        "La Liquidación fue creada correctamente",
                        true
                    )
            });
        }
        else{
            console.log(lastInfo.get("IdBeneficiario"))
            Axios.post('http://localhost:4000/updLiq/' + this.state.editId, lastInfo, {
                    headers: {
                        Accept: 'application/json'
                    }
                }).then(() => {this.setState({
                    visible: false
                    })
                    this.cargarTodo();
                    this.openNotification(
                        "Modificacion Exitosa",
                        "La Liquidación fue modificada correctamente",
                        true
                    )
            });
        }
    };

    //cancelar modal
    handleCancel = e => {   
        var confirm = window.confirm('¿Desea cerrar el formulario? Se perderán los cambios no guardados')
        if(confirm){
            this.setState({visible: false})

        }
    };


    onEdit = (id) => {
        this.setState({
            editId: id, 
            visible: true
        })

        let array = liq;
        let index = array.findIndex(p => p.Id == id);
        for (var prop in array[index]) {
            lastInfo.set(prop, array[index][prop]);
        }
        this.setState({benefIndex: ucds.findIndex(v => v.id == lastInfo.get("IdBeneficiario"))});
    }

    onDelete = (id) => {
        if(window.confirm('¿Realmente desea eliminar esta tabla?'))
        Axios.delete('http://localhost:4000/liq/' + id).then(() => {
                this.openNotification(
                    "Eliminación exitosa",
                    "La Liquidación se borró correctamente",
                    true
                )
                this.getData();
            }
        );
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

    //Presionar enter al buscador
    handleSearch = (v) => { 
        console.log(v)
    }
    

    // onChangeInput = (e) => {
    //     lastInfo.set(e.target.id, e.target.value);
    // }

    render(){
        return(
            <div className="content-cont prot-shadow">
                <Row>
                    <Col span={18}>
                        <Divider orientation="left" plain>
                            <h1 className="big-title">
                                Liquidaciónes
                            </h1>
                            
                        </Divider>
                        <div className="cards-container">
                            <Empty style={{display: this.state.isLoading ? "none" : liq.length > 0 ? "none" : "inline"}} description={false} />
                            {liq.map(v =>
                            <LiqCard
                                OnEdit={this.onEdit}
                                OnDelete={this.onDelete}
                                title={getTitle(v.IdBeneficiario, v.Desde)}
                                idbenef={v.IdBeneficiario}
                                desde={v.Desde}
                                hasta={v.Hasta}
                                fecha={v.FechaEmision}
                                key={v.Id}
                                id={v.Id}
                            />
                            )}
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
                    title={this.state.editId <=0 ? "Nueva Liquidación" : "Modificar Liquidación"}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    cancelText="Cancelar"
                    okText="Generar"
                    destroyOnClose
                    style={{padding: 16}}
                >
                    <div style={{padding:16}}>
                        <Row justify="space-between">
                            <Col span={24}>
                                <h4>Beneficiario</h4>
                                <AutoComplete
                                    style={{ width: '100%' }}
                                    options={ucds}
                                    placeholder="Nombre"
                                    filterOption={(inputValue, option) =>
                                    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                    }
                                    onChange = {(e, value, reason) => {
                                        if(e === undefined) return;
                                        var prop = ucds.find(v => v.value == e);
                                        if(prop)
                                            lastInfo.set("IdBeneficiario",prop.id);
                                        console.log(prop.id);
                                    }}
                                    defaultValue={this.state.editId <=0 ? this.value : this.state.benefIndex > -1 ? ucds[this.state.benefIndex].value : "[Beneficiario Borrado]"}
                                    allowClear
                                />
                            </Col>
                        </Row>
                        <Row justify="space-between">
                            <Col span={11}>
                                <h4 style={{marginTop: 24}}>Desde</h4>
                                <DatePicker 
                                    placeholder="Fecha" 
                                    style={{width: '100%'}} 
                                    format={"DD/MM/YYYY"}
                                    onChange={(e) => lastInfo.set("Desde", e.format(dateFormat))}
                                    defaultValue={this.state.editId <=0 ? this.value : moment(lastInfo.get("Desde"), "DD/MM/YYYY")}
                                />
                            </Col>
                            <Col span={11}>
                                <h4 style={{marginTop: 24}}>Hasta</h4>
                                <DatePicker 
                                    placeholder="Fecha" 
                                    style={{width: '100%'}}
                                    format={"DD/MM/YYYY"}
                                    onChange={(e) => lastInfo.set("Hasta", e.format(dateFormat))}
                                    defaultValue={this.state.editId <=0 ? this.value : moment(lastInfo.get("Hasta"), "DD/MM/YYYY")}
                                    />
                            </Col>
                        </Row>
                    </div>
                </Modal>
                
            </div>
        )
    }
}

export default Liquidaciones