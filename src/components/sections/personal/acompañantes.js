import React from 'react';
import { Divider, Row, Col, Input, Modal } from 'antd';
import { PlusOutlined, FileDoneOutlined } from '@ant-design/icons';
import AcompCard from './acomp-card.js';

const { Search } = Input;


class Acompañantes extends React.Component{

    state = { visible: false };

    showModal = () => {     //Mostrar modal
        this.setState({
        visible: true,
        });
    };

    handleOk = e => {       //maneja boton ok del modal
        console.log(e);
        this.setState({
        visible: false,
        });
    };

    handleCancel = e => {   //cancelar modal
        console.log(e);
        this.setState({
        visible: false,
        });
    };

    handleSearch = (v) => { //Presionar enter al buscador
        console.log(v)
    }
    
    render(){
        return(
            <div className="content-cont">
                <Row>
                    <Col span={18}>
                        <Divider orientation="left" plain>
                            <h1 className="big-title">
                                Acompañantes
                            </h1>
                        </Divider>
                        <div className="cards-container">
                            {/* Display de acompañantes */}
                            <AcompCard title={"Juan Perez"}/>
                            <AcompCard title={"John Doe"}/>
                            <AcompCard title={"María María"}/>
                        </div>
                    </Col>
                    <Col span={6}>
                        <Search placeholder="Buscar..." style={{width: '238px', margin: 8}} onSearch={value => this.handleSearch(value)} allowClear={true}/>
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
                title="Nuevo Acompañante"
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

export default Acompañantes