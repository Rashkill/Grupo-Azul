import React from 'react';
import { Divider, Row, Col, Input, Modal, AutoComplete, DatePicker } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Search } = Input;
const ucds = [
    { value: 'Celina Melamedoff' }
];


class Liquidaciones extends React.Component{

    state = { visible: false };

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
        var confirm = window.confirm('¿Desea cerrar el formulario? Se perderán los cambios no guardados')
        if(confirm){
            this.setState({visible: false})

        }
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
                                Liquidaciones
                            </h1>
                        </Divider>
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
                    title="Nueva Liquidación"
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
                                    format="DD / MM / YYYY"
                                />
                            </Col>
                            <Col span={11}>
                                <h4 style={{marginTop: 24}}>Hasta</h4>
                                <DatePicker 
                                    placeholder="Fecha" 
                                    style={{width: '100%'}}
                                    format="DD / MM / YYYY"
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