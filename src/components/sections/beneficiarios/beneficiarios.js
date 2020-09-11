import React from 'react';
import { Divider, Row, Col, Input, Modal } from 'antd';
import { PlusOutlined, FileDoneOutlined } from '@ant-design/icons';

const { Search } = Input;


class Beneficiarios extends React.Component{

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
                                Beneficiarios
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
                            <div className="right-btn">
                                <FileDoneOutlined />
                                <span className="right-btn-text">Monotributo</span>
                            </div>
                        </div>
                    </Col>
                </Row>


                <Modal
                title="Nuevo Beneficiario"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                cancelText="Cancelar"
                okText="Ok"
                >
                    <p>//Aquí iría el formulario//...</p>
                    <p>contenido...</p>
                    <p>contenido...</p>
                </Modal>
                
            </div>
        )
    }
}

export default Beneficiarios