import React from 'react';
import { Divider, Row, Col, Input, Modal, Empty, Form, AutoComplete } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import BenefCard from './benef-card'

const { Search } = Input;

var ucds = [];
var coords = [];
var lastInfo = {};

const abortController = new AbortController();

class Beneficiarios extends React.Component{

    state = {
        visible: false,
        isLoading: true,
        cantidad: 0
    };

    getData = () =>{
        this.loadAndGetData().then(this.setState({isLoading: false}));
    }

    loadAndGetData = async() => {
        try{
            const resBenef = await fetch('http://localhost:4000/beneficiarios', {signal: abortController.signal});
            const datosBenef = await resBenef.json();
            ucds = datosBenef;

            const res = await fetch('http://localhost:4000/coordinadores', {signal: abortController.signal});
            const datos = await res.json();
            coords = datos.map(c => ({
                value: c.Nombre + " " + c.Apellido
            }));
            console.log(coords);
            this.setState({cantidad: ucds.length})
        }catch(e){}
    }

    componentDidMount()
    {
        this.getData();
    }

    componentWillUnmount()
    {
        abortController.abort();
    }
    //Mostrar modal
    showModal = () => {     
        this.setState({
        visible: true,
        });
    };

    //maneja boton ok del modal
    handleOk = e => {
        this.setState({
        visible: false,
        });
        
        console.log(lastInfo);
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
    
    onChangeInput = (e) => {
        lastInfo[e.target.id] = e.target.value;
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
                        <Empty style={{display: this.state.isLoading ? "none" : ucds.length > 0 ? "none" : "inline"}} description={false} />
                        {ucds.map(p =>{
                            return(
                            <BenefCard 
                                title={p.Nombre + " " + p.Apellido}
                                domicilio={p.Direccion}
                                telefono={p.Telefono}
                                linkto="/benefprofile"
                                key={p.Id}
                                id={p.Id}
                                Refresh={this.getData}
                            />)
                        })}
                        <LoadingOutlined style={{ padding: 16, fontSize: 24, display: this.state.isLoading ? "inline" : "none" }} spin />
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
                <Form>
                    <Row gutter={[48,20]}>
                        <Col span={12}>
                            <Divider orientation="left">Datos Principales</Divider>
                        </Col>
                        <Col span={12}>
                            <Divider orientation="left">Datos de Contacto</Divider>
                        </Col>
                        <Col span={12}>
                        <h4>Nombre:</h4>
                            <Input placeholder="Nombre" id="Nombre" onChange={this.onChangeInput} />
                        </Col>
                        <Col span={12}>
                        <h4>Telefono:</h4>
                        <Input placeholder="Telefono" type="number" id="Telefono" onChange={this.onChangeInput}/>
                        </Col>
                        <Col span={12}>
                        <h4>Apellido:</h4>
                            <Input placeholder="Apellido" id="Apellido" onChange={this.onChangeInput}/>
                        </Col>
                        <Col span={12}>
                        <h4>Domicilio:</h4>
                            <Input placeholder="Domicilio" id="Domicilio" onChange={this.onChangeInput}/>
                        </Col>
                        <Col span={12}>
                        <h4>DNI:</h4>
                        <Input placeholder="DNI" type="number" id="Dni" onChange={this.onChangeInput}/>
                        </Col>
                        <Col span={12}>
                        
                        </Col>
                    </Row>
                    <h4>Coordinador:</h4>
                    <AutoComplete placeholder="Coordinador" id="IdCoordinador" 
                        onChange={this.onChangeInput} 
                        style={{ width: '100%' }}
                        options={coords}
                        filterOption={(inputValue, option) =>
                            option.value !== undefined
                            }
                        onChange = {(e, value, reason) => {
                            if(e === undefined) return;
                            var id = coords.findIndex(v => v.value == e);
                            if(id !== -1)
                                lastInfo.coordID = id+1;
                            console.log(lastInfo.coordID);
                        }}
                    />
                </Form>
                </Modal>
                
            </div>
        )
    }
}

export default Beneficiarios