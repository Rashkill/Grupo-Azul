import React from 'react';
import { Divider, Row, Col, Input, Modal, AutoComplete, DatePicker } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import JornadaCard from './jornada-card'

const { Search } = Input;
const { RangePicker } = DatePicker;

const agds = [
    { value: 'Juan Pérez' },
    { value: 'Beatriz Acuña' },
    { value: 'Yanina Gutierrez' },
];

const ucds = [
    { value: 'Celina Melamedoff' }
];

const okRange = (value, dateString) => {
    alert(value)
    alert(dateString)
}

class Jornadas extends React.Component{

    state = { 
        visible: false,
        horas: 0,
         
    };

    //Mostrar modal
    showModal = () => {     
        this.setState({
        visible: true,
        });
    };

    //maneja boton ok del modal
    handleOk = e => {      
        console.log(e);
        this.setState({
        visible: false,
        });
    };

    //cancelar modal
    handleCancel = e => {   
        console.log(e);
        this.setState({
        visible: false,
        });
    };

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
                    okText="Ok"
                >
                    <AutoComplete
                        style={{ width: 200 }}
                        options={ucds}
                        placeholder="Nombre Beneficiario"
                        filterOption={(inputValue, option) =>
                        option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                        }
                    />
                    <AutoComplete
                        style={{ width: 200 }}
                        options={agds}
                        placeholder="Nombre Cuidador"
                        filterOption={(inputValue, option) =>
                        option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                        }
                    />
                    <RangePicker 
                        showTime={{ format: 'HH:mm' }} 
                        format="YYYY-MM-DD HH:mm"
                        onOk={okRange}
                    />
                </Modal>
                
            </div>
        )
    }
}

export default Jornadas