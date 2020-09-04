import React,{ useState } from 'react';
import { Divider, Row, Col, Input, Modal } from 'antd';
import { PlusOutlined, FileDoneOutlined } from '@ant-design/icons';
// import CoordCard from './coord-card.js';

const { Search } = Input;

function Coordinadores() {
    const [state, setState] = useState({    //Estados
        visible : false
    });

    const showModal = () => {     //Mostrar modal
        setState({
        visible: true,
        });
    };
    const handleOk = e => {       //maneja boton ok del modal
        console.log(e);
        setState({
        visible: false,
        });
    };
    const handleCancel = e => {   //cancelar modal
        console.log(e);
        setState({
        visible: false,
        });
    };
    const handleSearch = (v) => { //Presionar enter al buscador
        console.log(v)
    }
    
    return(
        <div className="content-cont">
            <Row>
                <Col span={18}>
                    <Divider orientation="left" plain>
                        <h1 className="big-title">
                            Coordinadores
                        </h1>
                    </Divider>
                </Col>
                <Col span={6}>
                    <Search placeholder="Buscar..." style={{width: '238px', margin: 8}} onSearch={value => handleSearch(value)} allowClear={true}/>
                    <div className="right-menu">
                        <div className="right-btn" onClick={showModal}>
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
                title="Nuevo Coordinador"
                visible={state.visible}
                onOk={handleOk}
                onCancel={handleCancel}
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

export default Coordinadores