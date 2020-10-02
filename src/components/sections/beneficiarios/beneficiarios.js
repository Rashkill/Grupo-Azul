import React from 'react';
import { Divider, Row, Col, Input, Modal } from 'antd';
import { PlusOutlined, FileDoneOutlined } from '@ant-design/icons';
import BenefCard from './benef-card'

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
                        <Divider orientation="left">
                            <h1 className="big-title">
                                Beneficiarios
                            </h1>
                        </Divider>

                        <div className="cards-container">

                            <BenefCard 
                                title="Celina Melamedoff"
                                domicilio="Castellanos 1445"
                                telefono="+543483402494"
                                linkto="/benefprofile"
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