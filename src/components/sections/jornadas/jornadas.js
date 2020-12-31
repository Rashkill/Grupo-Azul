import React from 'react';
import { Divider, Row, Col, Input, Modal, AutoComplete, DatePicker, notification, Empty, Pagination, Select } from 'antd';
import { PlusOutlined, LoadingOutlined , CheckCircleOutlined, AlertOutlined, InfoCircleOutlined } from '@ant-design/icons';
import esES from 'antd/lib/locale/es_ES';
import JornadaCard from './jornada-card';
import Axios from 'axios';


const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const mesesNombres = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
"Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const moment = require('moment');

var agds = [];
var ucds = [];

var maxItems = 0;
const maxRows = 5;
var rowOffset = 0;

function nombreJornada (agdID, ucdID, fecha)
{
    const f = fecha.split('/');
    var n1; n1 = ucds[ucds.findIndex(v => v.id === ucdID)]; n1 = n1 ? n1.value.split(" ") : "[Beneficiario Borrado]";
    var n2; n2 = agds[agds.findIndex(v => v.id === agdID)]; n2 = n2 ? n2.value.split(" ") : "[Acompañante Borrado]";
    var n = f[0] + " de " + mesesNombres[parseInt(f[1] - 1, 10)];
    n += " / " + n1[n1.length -1] + " - " + n2[n2.length -1];
    return n;    
}

function getName (id, array){
    var n = "[Usuario Eliminado]";
    var index = array.findIndex(v => v.id === id);
    n = index !== -1 ? array[index].value : n;
    return n;
}

var jornadasIn = [], jornadasFilter = [];
var lastInfo = new FormData();
var searchTable = undefined;

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

class Jornadas extends React.Component{
    state = { 
        visible: false,
        isLoading: true,
        cantidad: 0,
        horas: 0,
        id: 0,
        acompIndex: -1,
        benefIndex: -1
    };

    abortController = new AbortController();

    getData = async () => {
        try{
            const result = await fetch('http://localhost:4000/getJornadas/Id', {signal: this.abortController.signal});
            const data = await result.json();
            maxItems = data.length;
            
            const res = await fetch('http://localhost:4000/getJornadas/*' + '/' + maxRows + '/' + rowOffset, {signal: this.abortController.signal});
            const datos = await res.json();
            if(datos.length > 0)
            {
                // Array.prototype.push.apply(jornadasIn, datos);
    
                var d = [];
                datos.map(v => {
                    if(!jornadasIn.find(x =>x === v))
                    {
                        v.FechaIngreso = moment(v.FechaIngreso, dateFormat + " HH:mm").format("DD/MM/YYYY HH:mm");
                        v.FechaEgreso = moment(v.FechaEgreso, dateFormat + " HH:mm").format("DD/MM/YYYY HH:mm");
                        d.push(v);
                    }
                })
                if(d.length > 0)
                    jornadasIn = d;
                
                jornadasFilter = jornadasIn;
                // jornadasIn.forEach(v => {
                //     if(v.FechaIngreso)
                //         v.FechaIngreso = moment(v.FechaIngreso, dateFormat + " HH:mm").format("DD/MM/YYYY");
                //     if(v.FechaEgreso)
                //         v.FechaEgreso = moment(v.FechaEgreso, dateFormat + " HH:mm").format("DD/MM/YYYY");
                // })
            }

            this.setState({cantidad: jornadasFilter.length})
        }catch(e){
            jornadasIn = [];
            console.log(e);
        }
    }

    getAcompBenef = async () => {
        try{            
            const resBenef = await fetch('http://localhost:4000/getBenef/' + "Nombre,Apellido,DNI,Id", {signal: this.abortController.signal});
            const datosBenef = await resBenef.json();
            if(datosBenef)
                ucds = (datosBenef.map(p => ({
                    value: p.Nombre + " " + p.Apellido,
                    dni: p.DNI,
                    key: p.Id, 
                    id: p.Id
                })));
            const resAcomp = await fetch('http://localhost:4000/getAcomp/' + "Nombre,Apellido,DNI,Id", {signal: this.abortController.signal});
            const datosAcomp = await resAcomp.json();
            if(datosAcomp)
                agds = (datosAcomp.map(p => ({
                    value: p.Nombre + " " + p.Apellido,
                    dni: p.DNI,
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
        jornadasIn = []; jornadasFilter = [];
        window.scrollTo(0,0)
        this.getAcompBenef().then(
            () => this.getData().then(
                () => this.setState({isLoading: false})))
    }

    componentDidMount(){
        this.cargarTodo();
    }

    componentWillUnmount(){
        rowOffset = 0;
        this.abortController.abort();
    }

    //Mostrar modal
    showModal = () => {     
        this.setState({
        visible: true,
        id: 0,
        horas: 0,
        acompIndex: -1,
        benefIndex: -1
        });
    };

    //maneja boton ok del modal
    handleOk = e => {

        lastInfo.set("CantHoras", this.state.horas);

        if(this.state.id <=0){
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
            Axios.post('http://localhost:4000/updJornada/' + this.state.id, lastInfo, {
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
        Modal.confirm({
            title:'¿Desea cerrar el formulario?',
            content: 'Se perderán los cambios no guardados',
            okText: 'Si', cancelText: 'No',
            onOk:(()=>{this.setState({visible: false, id:0})})
        })
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
            id: id, 
            visible: true,
            horas: lastInfo.get("CantHoras")
        })
    }

    onDelete = (id) => {
        Modal.confirm({
            title:'¿Realmente desea eliminar este elemento?',
            content: 'Esta acción no se puede deshacer.',
            okText: 'Si', cancelText: 'No',
            onOk:(()=>{
                Axios.delete('http://localhost:4000/jornada/' + id).then(() => {
                this.openNotification(
                    "Eliminación exitosa",
                    "La Jornada se borró correctamente",
                    true
                )
                this.getData();
                });
            })
        })
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

            lastInfo.set("FechaIngreso", value[0].format(dateFormat + " HH:mm"));
            lastInfo.set("FechaEgreso", value[1].format(dateFormat + " HH:mm"));
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

    //Buscador
    handleSearch = async(v) => {
        if(searchTable){
            if(v !== null && v !== ""){
                let pattern = v.replace(/^\s+/g, '');
                let column = "Nombre,Apellido";
                let k = v.split(':');
                if(k.length > 1){
                    column = k[0];
                    pattern = k[1].replace(/^\s+/g, '');
                }
                try{
                    const result = await fetch('http://localhost:4000/find/Id' + '/' + searchTable + '/' + column + '/' + pattern, {signal: this.abortController.signal});
                    const data = await result.json();
                    if(data.error)
                        this.openNotification('Error de busqueda', `"${column}" no es un criterio de busqueda valido`, false);
                    else{
                        var arr = [];
                        var p = new Promise((resolve, reject) => data.forEach(async(info) => {
                            let idType = searchTable + "=" + info.Id;
                            const result2 = await fetch('http://localhost:4000/getJornadasPorID/*/' + idType, {signal: this.abortController.signal});
                            const data2 = await result2.json();
                            if(!data2.error){
                                arr = Array.prototype.concat(arr, data2);
                                var d = [];
                                arr.map(v => {
                                    v.FechaIngreso = moment(v.FechaIngreso, dateFormat + " HH:mm").format("DD/MM/YYYY HH:mm");
                                    v.FechaEgreso = moment(v.FechaEgreso, dateFormat + " HH:mm").format("DD/MM/YYYY HH:mm");
                                    d.push(v);
                                })
                                arr = d;
                                resolve();
                            }
                        }));
                        p.then(()=> {
                            arr = arr.filter (function (value, index, array) { 
                                return array.indexOf (value) == index;
                            });

                            jornadasFilter = arr;
                            this.setState({cantidad: jornadasFilter.length});
                        });
                    }
                }
                catch(e){console.log(e);}
            } else jornadasFilter = jornadasIn;
        } else this.openNotification('Error de busqueda', `Por favor elija el tipo de busqueda`, false);
        this.setState({cantidad: jornadasFilter.length});
    } 

    onChangeFilter = async(e) => {
        if(e){
            let desde = e[0].format(dateFormat);
            let hasta = e[1].format(dateFormat);
            let fields = "*";
            const res = await fetch('http://localhost:4000/rangoJornadas/' + fields + '/' + desde + '/' + hasta);
            const datos = await res.json();
            if(!datos.error)
            {
                var d = [];
                datos.map(v => {
                    v.FechaIngreso = moment(v.FechaIngreso, dateFormat + " HH:mm").format("DD/MM/YYYY HH:mm");
                    v.FechaEgreso = moment(v.FechaEgreso, dateFormat + " HH:mm").format("DD/MM/YYYY HH:mm");
                    d.push(v);
                })
                
                jornadasFilter = d;
            }
        }
        else jornadasFilter = jornadasIn;

        this.setState({cantidad: jornadasFilter.length});
    }
    

    arrayEquals(a, b) {
        return Array.isArray(a) &&
          Array.isArray(b) &&
          a.length === b.length &&
          a.every((val, index) => val === b[index]);
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
                        
                        <div className="range-wrap">
                            <h3 className="data-attr">Filtrar por fecha: </h3>
                            <RangePicker
                                size="small"
                                format="DD/MM/YYYY"
                                separator=">"
                                allowClear
                                locale={esES}
                                onChange={this.onChangeFilter}
                            />
                        </div>
                        
                        <div className="cards-container">
                            <Empty style={{display: this.state.isLoading ? "none" : jornadasFilter.length > 0 ? "none" : "inline"}} description={false} />
                                {jornadasFilter.map(j => {
                                    return(
                                        <JornadaCard
                                            title={nombreJornada(j.IdAcompañante, j.IdBeneficiario, j.FechaIngreso)}
                                            agd={getName(j.IdAcompañante, agds)}
                                            ucd={getName(j.IdBeneficiario, ucds)}
                                            horas={j.CantHoras}
                                            ingreso={j.FechaIngreso}
                                            egreso={j.FechaEgreso}
                                            id={j.Id}
                                            key={j.Id}
                                            OnEdit={this.onEdit}
                                            OnDelete={this.onDelete}
                                        />
                                    )
                                })}
                            <LoadingOutlined style={{ padding: 16, fontSize: 24, display: this.state.isLoading ? "inline" : "none" }} spin />
                        </div>
                        <Pagination 
                            style={{textAlign:"center", visibility:maxItems<=maxRows||!this.arrayEquals(jornadasIn,jornadasFilter)?"hidden":"visible"}} 
                            defaultCurrent={1} 
                            total={maxItems} 
                            pageSize={maxRows}
                            onChange={(page)=>{rowOffset=maxRows*(page-1); this.cargarTodo();}}
                        />
                    </Col>
                    <Col span={6}>
                        <Select allowClear onChange={(value)=>searchTable=value} placeholder="Buscar por" style={{width: '95%', margin: 8, marginRight: 16}}>
                            <Option value="Acompañante" key="1">Acompañante</Option>
                            <Option value="Beneficiario" key="2">Beneficiario</Option>
                        </Select>
                        <Search placeholder="Buscar..." style={{width: '95%', margin: 8, marginRight: 16}} onSearch={e => this.handleSearch(e)} allowClear={true}/>
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
                                    options={ucds.map(i => renderItem(i.value, i.dni))}
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
                                    defaultValue={this.state.id <=0 ? this.value : this.state.benefIndex > -1 ? ucds[this.state.benefIndex].value : "[Beneficiario Borrado]"}
                                    allowClear
                                />
                            </Col>

                            <Col span={11}>
                                <h4>Acompañante</h4>
                                <AutoComplete
                                    style={{ width: '100%' }}
                                    options={agds.map(i => renderItem(i.value, i.dni))}
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
                                    defaultValue={this.state.id <=0 ? this.value : this.state.acompIndex > -1 ? agds[this.state.acompIndex].value : "[Acompañante Borrado]"}
                                    allowClear
                                />
                            </Col>

                        </Row>

                        <Row>
                            <Col span={24}>
                                <h4 style={{marginTop: 24}}>Ingreso y Egreso</h4>
                                <RangePicker 
                                    showTime={{ format: 'HH:mm' }} 
                                    format={"DD/MM/YYYY HH:mm"}
                                    onOk={this.rangeOk}
                                    minuteStep={30}
                                    style={{width: '100%'}}
                                    defaultValue = {this.state.id <=0 ? this.value : 
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