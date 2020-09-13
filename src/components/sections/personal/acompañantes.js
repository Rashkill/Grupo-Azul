import React,{ useState, useEffect } from 'react';
import { Divider, Row, Col, Input, Modal, Button } from 'antd';
import { PlusOutlined, FileDoneOutlined } from '@ant-design/icons';
import AcompCard from './acomp-card.js';

const { Search } = Input;

function Acompañantes() {

    const [state, setState] = useState({    //Estados
        visible : false,
        isLoading:true,
        nombre:""
    });
    const [data, setData] = useState([]);
    const [nombre, setNombre] = useState("");
    const [precioHora, setPrecioHora] = useState(0);

    const getData = async () =>{
        const res = await fetch('http://localhost:4000/acomp');
        const datos = await res.json();
        setData(datos);
    }

    useEffect(()=>{
        getData();
    },[]);

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

    // if(state.isLoading){
    //     <h4>Loading</h4>
    // }    
    const onChangeInput = e =>{
        if(e.target.id=="nombre"){
            console.log("nombre: ",e.target.value);
            setNombre(e.target.value)
        }
        if(e.target.id=="precioHora"){
            console.log("precioHora: ",e.target.value);
            setPrecioHora(e.target.value)
        }
    }
    const addAcomp = async  () =>{
        var data = [nombre,precioHora];
        const res = await fetch('http://localhost:4000/addacomp',{
            method: "POST",
            headers:{
                'Content-Type' : 'application/json'
            },
            body:JSON.stringify({ data })
        })
       var response =  await res.json()
        // console.log(response);
    }
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
                    {data.map((i , index)=>{
                        return(
                            <AcompCard title={i.Nombre} price={i.PrecioHora} id={i.Id} key={index}/>
                        )
                    })}                   
                    </div>
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
                title="Nuevo Acompañante"
                visible={state.visible}
                onOk={handleOk}
                onCancel={handleCancel}
                cancelText="Cancelar"
                okText="Ok"
            >
                <p>//Aquí iría el formulario//...</p>
                <p>contenido...</p>
                <p>contenido...</p>
                <Input placeholder="Nombre" id="nombre" onChange={onChangeInput}/>
                <Input placeholder="Precio Hora" id="precioHora" onChange={onChangeInput}/>
                <hr/>
                <Button type="secondary" onClick={addAcomp}>Enviar</Button>
            </Modal>
            
        </div>
    )
    
}

export default Acompañantes