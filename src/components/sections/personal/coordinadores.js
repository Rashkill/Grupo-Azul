import React,{ useState, useEffect } from 'react';
import { Divider, Row, Col, Input, Modal, Form, Empty } from 'antd';
import { PlusOutlined, FileDoneOutlined, LoadingOutlined } from '@ant-design/icons';
import CoordCard from './coord-card.js';

const { Search } = Input;

var info = {
    datos: []
}

var lastInfo = {
    Nombre: "",
    Apellido: "",
    PrecioMensual: 0
}

function Coordinadores() {
    const [state, setState] = useState({    //Estados
        visible : false,
        isLoading: true
    });

    const abortController = new AbortController();

    const emptyIcon = <Empty style={{display: state.isLoading ? "none" : info.datos.length > 0 ? "none" : "inline"}} description={false} />;
    const loadIcon = <LoadingOutlined style={{ padding: 16, fontSize: 24, display: state.isLoading ? "inline" : "none" }} spin />;

    const [data, setData] = useState([]);
    const getData = () =>{
        loadAndGetData().then(() => setState({isLoading: false}))
    }
    const loadAndGetData = async() => {
        try{
            const res = await fetch('http://localhost:4000/coordinadores', {signal: abortController.signal});
            const datos = await res.json();
            info.datos = datos;
            setData(info);

        }catch(e){console.log(e)}
    }
    
    useEffect(()=>{
        getData();

        return () => {
            abortController.abort();
        }
    },[]);

    const showModal = () => {     //Mostrar modal
        setState({
        visible: true,
        });
    };
    const handleOk = e => {       //maneja boton ok del modal
        console.log(lastInfo);
        setState({
        visible: false,
        });
    };
    const handleCancel = e => {   //cancelar modal
        var confirm = window.confirm('¿Desea cerrar el formulario? Se perderán los cambios no guardados')
        if(confirm){
            setState({visible: false})
        }
    };
    const handleSearch = (v) => { //Presionar enter al buscador
        console.log(v)
    }
    
    const form = Form.useForm();
    const onChangeInput = e =>{
        lastInfo[e.target.id]= e.target.value;
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
                    <div className="cards-container">                 
                        {/* Display de Coordinadores */}
                        {emptyIcon}
                        {info.datos.map((i , index)=>{
                            return(
                                <CoordCard 
                                Nombre= {i.Nombre}
                                Apellido= {i.Apellido}
                                PrecioMensual= {i.PrecioMensual}
                                key= {i.Id}
                                />
                            )
                        })}   
                        {loadIcon}
                    </div>
                </Col>
                <Col span={6}>
                    <Search placeholder="Buscar..." style={{width: '95%', margin: 8, marginRight: 16}} onSearch={value => this.handleSearch(value)} allowClear={true}/>
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
                <Form>
                <Row gutter={[48,20]}>
                <Col span={12}>
                    <Divider orientation="left">Datos Principales</Divider>
                </Col>
                <Col span={12}>
                    <Divider orientation="left">Datos de Contacto</Divider>
                </Col>
                    <Col span={12}>
                        <Input placeholder="Nombre" id="Nombre" onChange={onChangeInput} />
                    </Col>
                    <Col span={12}>
                    <Input placeholder="Telefono" type="number" id="Telefono" onChange={onChangeInput}/>
                    </Col>
                    <Col span={12}>
             
                        <Input placeholder="Apellido" id="Apellido" onChange={onChangeInput}/>
                    </Col>
                    <Col span={12}>
                        <Input placeholder="Domicilio" id="Domicilio" onChange={onChangeInput}/>
                    </Col>
                    <Col span={12}>
                    <Input placeholder="DNI" type="number" id="Dni" onChange={onChangeInput}/>
                    </Col>
                    <Col span={12}>
                        <Input placeholder="Email" id="Email" onChange={onChangeInput}/>
                    </Col>
                </Row> 
                </Form> 
            </Modal>
            
        </div>
    )
    
}

export default Coordinadores