import React from 'react';
import { Divider, Row, Col, Input, Modal, AutoComplete, DatePicker, notification , Empty } from 'antd';
import { PlusOutlined, LoadingOutlined , CheckCircleOutlined, AlertOutlined } from '@ant-design/icons';
import JornadaCard from './jornada-card';
import Axios from 'axios';


const { Search } = Input;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const mesesNombres = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
"Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];
const moment = require('moment');
const { confirm } = Modal;

var agds = [];
var ucds = [];

function nombreJornada (agdID, ucdID, fecha)
{
    const f = fecha.split('/');
    var n1; n1 = ucds[ucds.findIndex(v => v.id == ucdID)]; n1 = n1 ? n1.value.split(" ") : "[Beneficiario Borrado]";
    var n2; n2 = agds[agds.findIndex(v => v.id == agdID)]; n2 = n2 ? n2.value.split(" ") : "[Acompañante Borrado]";
    var n = f[0] + " de " + mesesNombres[parseInt(f[1] - 1, 10)];
    n += " / " + n1[n1.length -1] + " - " + n2[n2.length -1];
    return n;    
}

function getName (id, array){
    var n = "[Usuario Eliminado]";
    var index = array.findIndex(v => v.id == id);
    n = index !== -1 ? array[index].value : n;
    return n;
}

var jornadasIn = []

var lastInfo = new FormData();

//const loadingIcon = <LoadingOutlined style={{ fontSize: 24, display: this.state.isLoading ? "inline" : "none" }} spin />;

class Jornadas extends React.Component{
    state = { 
        visible: false,
        isLoading: true,
        horas: 0,
        editId: 0,
        acompIndex: -1,
        benefIndex: -1
    };

    abortController = new AbortController();

    getData = async () => {
        try{            
            const res = await fetch('http://localhost:4000/getJornadas/*', {signal: this.abortController.signal});
            const datos = await res.json();
            if(datos)
            {
                jornadasIn = datos;
                jornadasIn.forEach(v => {
                    if(v.FechaIngreso)
                        v.FechaIngreso = moment(v.FechaIngreso, dateFormat + " HH:mm").format("DD/MM/YYYY");
                    if(v.FechaEgreso)
                        v.FechaEgreso = moment(v.FechaEgreso, dateFormat + " HH:mm").format("DD/MM/YYYY");
                })
            }
        }catch(e){
            jornadasIn = [];
            console.log(e);
        }
    }

    getAcompBenef = async () => {
        try{            
            const resBenef = await fetch('http://localhost:4000/getBenef/' + "Nombre,Apellido,Id", {signal: this.abortController.signal});
            const datosBenef = await resBenef.json();
            if(datosBenef)
                ucds = (datosBenef.map(p => ({
                    value: p.Nombre + " " + p.Apellido, 
                    key: p.Id, 
                    id: p.Id
                })));
            const resAcomp = await fetch('http://localhost:4000/getAcomp/' + "Nombre,Apellido,Id", {signal: this.abortController.signal});
            const datosAcomp = await resAcomp.json();
            if(datosAcomp)
                agds = (datosAcomp.map(p => ({
                    value: p.Nombre + " " + p.Apellido, 
                    key: p.Id, 
                    id: p.Id
            })));     
        }catch(e){
            ucds = [];
            agds = [];
            console.log(e);
        }
    }

    cargarTodo = () =>{
        this.getAcompBenef().then(
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
        acompIndex: -1,
        benefIndex: -1
        });
    };

    //maneja boton ok del modal
    handleOk = e => {

        lastInfo.set("CantHoras", this.state.horas);

        if(this.state.editId <=0){
            Axios.post('http://localhost:4000/addJornada', lastInfo, {
                    headers: {
                        Accept: 'application/json'
                    }
                }).then(() => {this.setState({
                    visible: false,
                    })
                    this.cargarTodo();
                    this.openNotification(
                        "Agregado Exitoso",
                        "La Jornada fue creada correctamente",
                        true
                    )
            });
        }
        else{
            Axios.post('http://localhost:4000/updJornada/' + this.state.editId, lastInfo, {
                    headers: {
                        Accept: 'application/json'
                    }
                }).then(() => {this.setState({
                    visible: false
                    })
                    this.cargarTodo();
                    this.openNotification(
                        "Modificacion Exitosa",
                        "La Jornada fue modificada correctamente",
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

        let array = jornadasIn;
        let index = array.findIndex(p => p.Id == id);
        for (var prop in array[index]) {
            lastInfo.set(prop, array[index][prop]);
        }
        this.setState({acompIndex: agds.findIndex(v => v.id == lastInfo.get("IdAcompañante"))});
        this.setState({benefIndex: ucds.findIndex(v => v.id == lastInfo.get("IdBeneficiario"))});

        this.setState({
            editId: id, 
            visible: true,
            horas: lastInfo.get("CantHoras")
        })
    }

    onDelete = (id) => {
        if(window.confirm('¿Realmente desea eliminar esta tabla?'))
        Axios.delete('http://localhost:4000/jornada/' + id).then(() => {
                this.openNotification(
                    "Eliminación exitosa",
                    "La Jornada se borró correctamente",
                    true
                )
                this.getData();
            }
        );
    }

    rangeOk = (value) => {
        //calculo de horas
        if(value[0] !== null && value[1] !== null)
        {
            lastInfo.rangeVal = value;
            var mins = value[1] - value[0]
            mins = mins / 1000 / 60
            mins = Math.round(mins)
            var hs = mins / 60
            if(hs > 0)
                this.setState({horas: hs});

            lastInfo.set("FechaIngreso", value[0].format(dateFormat + " HH:MM"));
            lastInfo.set("FechaEgreso", value[1].format(dateFormat + " HH:MM"));
        }
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
                                Jornadas
                            </h1>
                        </Divider>
                        
                        <div className="cards-container">
                            <Empty style={{display: this.state.isLoading ? "none" : jornadasIn.length > 0 ? "none" : "inline"}} description={false} />
                            {jornadasIn.map(jornadaInfo => {
                                return(
                                    <JornadaCard
                                        title={nombreJornada(jornadaInfo.IdAcompañante, jornadaInfo.IdBeneficiario, jornadaInfo.FechaIngreso)}
                                        agd={getName(jornadaInfo.IdAcompañante, agds)}
                                        ucd={getName(jornadaInfo.IdBeneficiario, ucds)}
                                        horas={jornadaInfo.CantHoras}
                                        ingreso={jornadaInfo.FechaIngreso}
                                        egreso={jornadaInfo.FechaEgreso}
                                        id={jornadaInfo.Id}
                                        key={jornadaInfo.Id}
                                        OnEdit={this.onEdit}
                                        OnDelete={this.onDelete}
                                    />
                                )
                            })}
                            <LoadingOutlined style={{ padding: 16, fontSize: 24, display: this.state.isLoading ? "inline" : "none" }} spin />
                        </div>

                    </Col>
                    <Col span={6}>
                        <Search placeholder="Buscar..." style={{width: '95%', margin: 8, marginRight: 16}} onSearch={value => this.handleSearch(value)} allowClear={true}/>
                        <div className="right-menu">
                            <div className="right-btn" hidden={this.state.isLoading} onClick={this.showModal}>
                                <PlusOutlined />
                                <span className="right-btn-text">Nuevo</span>
                            </div>
                        </div>
                    </Col>
                </Row>


                <Modal
                    title="Nueva Jornada"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    cancelText="Cancelar"
                    okText="Aceptar"
                    destroyOnClose
                    style={{padding: 16}}
                >
                    <div style={{padding:16}}>
                        <Row justify="space-between">
                            <Col span={11}>
                                <h4>Beneficiario</h4>
                                <AutoComplete
                                    style={{ width: '100%' }}
                                    options={ucds}
                                    placeholder="Nombre"
                                    filterOption={(inputValue, option) =>
                                        option.value.toUpperCase().indexOf(inputValue.toUpperCase()) + 1 !== 0
                                    }
                                    onChange = {(e, value, reason) => {
                                        if(e === undefined) return;
                                        var prop = ucds.find(v => v.value == e);
                                        if(prop)
                                            lastInfo.set("IdBeneficiario", prop.id);
                                    }}
                                    defaultValue={this.state.editId <=0 ? this.value : this.state.benefIndex > -1 ? ucds[this.state.benefIndex].value : "[Beneficiario Borrado]"}
                                    allowClear
                                />
                            </Col>

                            <Col span={11}>
                                <h4>Acompañante</h4>
                                <AutoComplete
                                    style={{ width: '100%' }}
                                    options={agds}
                                    placeholder="Nombre"
                                    filterOption={(inputValue, option) =>
                                        option.value.toUpperCase().indexOf(inputValue.toUpperCase()) + 1 !== 0
                                    }
                                    onChange = {(e, value, reason) => {
                                        if(e === undefined) return;
                                        var prop = agds.find(v => v.value == e);
                                        if(prop)
                                            lastInfo.set("IdAcompañante", prop.id);
                                    }}
                                    defaultValue={this.state.editId <=0 ? this.value : this.state.acompIndex > -1 ? agds[this.state.acompIndex].value : "[Acompañante Borrado]"}
                                    allowClear
                                />
                            </Col>

                        </Row>

                        <Row>
                            <Col span={24}>
                                <h4 style={{marginTop: 24}}>Ingreso y Egreso</h4>
                                <RangePicker 
                                    showTime={{ format: 'HH:mm' }} 
                                    format={"DD/MM/YYYY HH:MM"}
                                    onOk={this.rangeOk}
                                    minuteStep={30}
                                    placeholder={['Desde', 'Hasta']}
                                    style={{width: '100%'}}
                                    defaultValue = {this.state.editId <=0 ? this.value : 
                                        [moment(moment(lastInfo.get("FechaIngreso"), dateFormat + " HH:mm").format("DD/MM/YYYY HH:mm"), "DD/MM/YYYY HH:mm"), 
                                        moment(moment(lastInfo.get("FechaEgreso"), dateFormat + " HH:mm").format("DD/MM/YYYY HH:mm"), "DD/MM/YYYY HH:mm")]}
                                    allowClear
                                />
                            </Col>
                            <p className='card-subtitle' style={{marginTop: 8}}>Horas cumplidas: {this.state.horas}</p>
                        </Row>
                    </div>

                </Modal>
                
            </div>
        )
    }
}

export default Jornadas