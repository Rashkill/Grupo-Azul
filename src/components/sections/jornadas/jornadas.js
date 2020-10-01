import React from 'react';
import { Divider, Row, Col, Input, Modal, AutoComplete, DatePicker } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import JornadaCard from './jornada-card'


const { Search } = Input;
const { RangePicker } = DatePicker;
const dateFormat = 'DD/MM/YYYY';
const { confirm } = Modal;


const agds = [
    { value: 'Juan Pérez' },
    { value: 'Beatriz Acuña' },
    { value: 'Yanina Gutierrez' },
];

const ucds = [
    { value: 'Celina Melamedoff' }
];


class Jornadas extends React.Component{
    
    state = { 
        visible: false,
        horas: 0
    };
    
    rangeOk = (value, dateString) => {
        //calculo de horas
        var mins = value[1] - value[0]
        mins = mins / 1000 / 60
        mins = Math.round(mins)
        var hs = mins / 60
        console.log(hs)
        if(hs > 0){
            this.setState({horas: hs})
        }
    }

    //Mostrar modal
    showModal = () => {     
        this.setState({
        visible: true,
        horas: 0
        });
    };

    //maneja boton ok del modal
    handleOk = e => {      
        console.log(e);
        this.setState({
        visible: false,
        });
    };

    //cerrar modal
    handleCancel = e => {
        var confirm = window.confirm('¿Desea cerrar el formulario? Se perderán los cambios no guardados')
        if(confirm){
            this.setState({visible: false})

        }
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
                            <JornadaCard
                                title="20 de Agosto / Melamedoff - Pérez"
                                agd="Pérez, Juan"
                                ucd="Melamedoff, Celina"
                                ingreso="20/8/2020 9:00"
                                egreso="20/8/2020 17:00"
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
                                    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                    }
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
                                    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                    }
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