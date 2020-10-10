import React from 'react';
import { Divider, Row, Col, Input, Modal, AutoComplete, DatePicker,notification  } from 'antd';
import { PlusOutlined, FileDoneOutlined, UploadOutlined, CheckCircleOutlined, PaperClipOutlined } from '@ant-design/icons';
import JornadasInfo from './jornadas-info'
import axios from 'axios';


const { Search } = Input;
const { RangePicker } = DatePicker;
const dateFormat = 'DD/MM/YYYY';
const mesesNombres = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];
const { confirm } = Modal;

var agds = [
    { value: 'Vacio' },
];
const ucds = [
    { value: 'Celina Melamedoff' }
];

function nombreJornada (agdID, ucdID, fecha)
{
    const f = fecha.split('/');
    const n1 = ucds[ucdID - 1].value.split(" ");
    const n2 = agds[agdID - 1].value.split(" ");
    var n = f[0] + " de " + mesesNombres[parseInt(f[1] - 1, 10)];
    n += " / " + n1[n1.length -1] + " - " + n2[n2.length -1];
    return n;
    
}

function getNombreAgd(id)
{
    return agds[id - 1].value;
}

function getNombreUcd(id)
{
    return ucds[id - 1].value;
}

var jornadasIn = []

var lastInfo = {
    agdID: 0,
    ucdID: 0,
    horas: 0,
    ingreso: "",
    egreso: "",
    rangeVal: undefined
}

const getData = async () =>{
    const res = await fetch('http://localhost:4000/acomp');
    const datos = await res.json();
    agds = (datos.map(p => ({value: p.Nombre + " " + p.Apellido, key: p.Id})));
}

class Jornadas extends React.Component{
    state = { 
        visible: false,
        horas: 0,
        jornadas: jornadasIn
    };

    componentDidMount(){
        this.cargarTodo();
    }

    cargarTodo = () =>
    {
        getData().then(async() =>{
            const res = await fetch('http://localhost:4000/jornadas');
            const datos = await res.json();
            const jornadasInfoArray = (datos.map(j => ({
                title: nombreJornada(j.IdBeneficiario, j.IdAcompañante, j.FechaIngreso),
                agdID: j.IdBeneficiario,
                agdNombre: getNombreAgd(j.IdBeneficiario),
                ucdID: j.IdAcompañante,
                ucdNombre: getNombreUcd(j.IdAcompañante),
                horas: j.CantHoras,
                ingreso: j.FechaIngreso,
                egreso: j.FechaEgreso,
                key: j.Id
            })));
            jornadasIn = jornadasInfoArray;
            this.setState({jornadas: jornadasInfoArray});
        });
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
            console.log(hs)
            if(hs > 0)
                this.setState({horas: hs});

            //lastInfo.title = value[0]._d.getDate() + " de " + mesesNombres[value[0]._d.getMonth()];
            lastInfo.ingreso = value[0].format(dateFormat + " HH:mm");
            lastInfo.egreso = value[1].format(dateFormat + " HH:mm");
        }
    }

    //Mostrar modal
    showModal = () => {     
        this.setState({
        visible: true
        });
    };

    //maneja boton ok del modal
    handleOk = e => {
        this.setState({
        visible: false,
        });

        if(this.state.horas > 0)
            lastInfo.horas = this.state.horas;

        axios.post('http://localhost:4000/addjornada', lastInfo)
        .then(() => {
            this.openNotification()
            lastInfo = 
            {
                agdID: 0,
                ucdID: 0,
                horas: 0,
                ingreso: "",
                egreso: "",
                rangeVal: undefined
            }
            this.cargarTodo();
        });
        
    };

    openNotification = () => {
        this.setState({
            visible: false,
        });

        notification.open({
            message: 'Agregado exitoso',
            description:
            `La jornada se agregó correctamente.`,
            icon: <CheckCircleOutlined style={{ color: '#52C41A' }} />,
        });
    };

    //cerrar modal
    handleCancel = e => {
        this.setState({visible: false})
    }
    
    //Presionar enter al buscador
    handleSearch = (v) => { 
        console.log(v)
    }

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
                            <JornadasInfo
                                jornadasInfo = {this.state.jornadas}
                                Refresh={this.cargarTodo}
                            />
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
                                        option.value !== undefined
                                    }
                                    onChange = {(e, value, reason) => {
                                        if(e === undefined) return;
                                        var id = ucds.findIndex(v => v.value == e);
                                        if(id !== -1)
                                            lastInfo.ucdID = id+1;
                                        console.log(lastInfo.ucdID);
                                    }}
                                    value={lastInfo.ucdID > 0 ? ucds[lastInfo.ucdID - 1].value : this.value}
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
                                    option.value !== undefined
                                    }
                                    onChange = {(e, value, reason) => {
                                        if(e === undefined) return;
                                        var id = agds.findIndex(v => v.value == e);
                                        if(id !== -1)
                                            lastInfo.agdID = id+1;
                                        console.log(lastInfo.agdID);
                                    }}
                                    value={lastInfo.agdID > 0 ? agds[lastInfo.agdID - 1].value : this.value}
                                    allowClear
                                />
                            </Col>

                        </Row>

                        <Row>
                            <Col span={24}>
                                <h4 style={{marginTop: 24}}>Ingreso y Egreso</h4>
                                <RangePicker 
                                    showTime={{ format: 'HH:mm' }} 
                                    format="DD / MM / YYYY HH:mm"
                                    onOk={this.rangeOk}
                                    minuteStep={30}
                                    placeholder={['Desde', 'Hasta']}
                                    style={{width: '100%'}}
                                    value={lastInfo.rangeVal !== undefined ? lastInfo.rangeVal : this.value}
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