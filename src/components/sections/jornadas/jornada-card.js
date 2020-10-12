import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Menu, Dropdown, Divider, Row, Col, Input, Modal, AutoComplete, DatePicker,notification  } from 'antd';
import { PlusOutlined, FileDoneOutlined, UploadOutlined, CheckCircleOutlined, AlertOutlined } from '@ant-design/icons';
import { EllipsisOutlined, EditFilled, DeleteFilled } from '@ant-design/icons';
import JornadaImg from '../../../images/image5.png'
import { createHashHistory } from 'history';
import axios from 'axios';

export const history = createHashHistory();

const { Search } = Input;
const { RangePicker } = DatePicker;
const dateFormat = 'DD/MM/YYYY';
const mesesNombres = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];
const { confirm } = Modal;

var lastInfo = {
    agdID: 0,
    agdNombre: "",
    ucdID: 0,
    ucdNombre: "",
    horas: 0,
    ingreso: "",
    egreso: "",
    rangeVal: undefined
}

class JornadaCard extends React.Component {
    state = { 
        editVisible: false,
        deleteVisible: false,
        horas: 0
    };


    //Se llama al presionar el boton OK de las fechas
    rangeOk = (value) => {
        if(value[0] !== null && value[1] !== null)
        {
            //calculo de horas
            var mins = value[1] - value[0]
            mins = mins / 1000 / 60
            mins = Math.round(mins)
            var hs = mins / 60
            console.log(hs)
            if(hs > 0){
                this.setState({horas: hs})
                lastInfo.horas = hs;
            }

            lastInfo.ingreso = value[0].format(dateFormat + " HH:mm");
            lastInfo.egreso = value[1].format(dateFormat + " HH:mm");
        }
    }

    //Se muestra el cartel de edit
    showModalEdit = () => {     
        this.setState({
            editVisible: true,
            horas: this.props.horas
        });
        lastInfo = {
            agdID: this.props.agdID,
            ucdID: this.props.ucdID,
            horas: this.props.horas,
            ingreso: this.props.ingreso,
            egreso: this.props.egreso,
            rangeVal: this.props.rangeVal
        }
    };
    
    //Se muestra el cartel de confirmacion de borrado
    showModalDelete = () => {     
        this.setState({
            deleteVisible: true
        });
    }

    //Boton aceptar del edit
    handleOkEdit = e => {      
        this.setState({
            editVisible: false,
        });

        axios.post('http://localhost:4000/updateJornada/' + this.props.id, lastInfo).then(() => {
            this.openNotification(
                "Actualización exitosa",
                "La jornada se modificó correctamente",
                true
            );
            this.props.Refresh();
        }
        );        
    };

    openNotification = (msg, desc, succeed) => {
        this.setState({
            editVisible: false,
        });

        notification.open({
            message: msg,
            description: desc,
            icon: succeed ? 
            <CheckCircleOutlined style={{ color: '#52C41A' }} /> : 
            <AlertOutlined style={{ color: 'red' }} />
        });
    };

    handleOkDelete = e => {
        this.setState({deleteVisible: false})

        axios.delete('http://localhost:4000/jornada/' + this.props.id, lastInfo).then(() => {
                this.openNotification(
                    "Eliminación exitosa",
                    "La jornada se borró correctamente",
                    true
                )
                this.props.Refresh();
            }
        );
    }

    //Se cierran los carteles
    handleCancel = e => {
        this.setState({
            editVisible: false,
            deleteVisible: false
        })
    }


    render() {

        const dropClick = ({ key }) => {
            if (key === 'edit') {
                this.showModalEdit();
            } else {
                this.showModalDelete();
            }
        }
    
        const menu = (
            <Menu onClick={dropClick}>
                {/* la key es como se diferencian las opciones del drop, en la funcion dropClick*/}
                <Menu.Item key="edit"> 
                    <div className="drop-btn">
                        <EditFilled />
                        <p>Editar</p>
                    </div>
                </Menu.Item>
                <Menu.Item key="delete">
                    <div className="drop-btn" style={{color: "red"}}>
                        <DeleteFilled />
                        <p>Eliminar</p>
                    </div>
                </Menu.Item>
            </Menu>
        );
    
        const modalEdit = (
            <Modal
                    title="Modificar Jornada"
                    visible={this.state.editVisible}
                    onOk={this.handleOkEdit}
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
                                        options={this.props.ucds}
                                        placeholder="Nombre"
                                        filterOption={(inputValue, option) =>
                                        option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                        }
                                        onChange = {(e, value, reason) => {
                                            if(e === undefined) return;
                                            var id = this.props.ucds.findIndex(v => v.value == e);
                                            if(id !== -1)
                                                lastInfo.ucdID = id+1;
                                            console.log(lastInfo.ucdID);
                                        }}
                                        defaultValue={this.props.ucds[this.props.ucdID - 1].value}
                                        allowClear
                                    />
                                </Col>
    
                                <Col span={11}>
                                    <h4>Acompañante</h4>
                                    <AutoComplete
                                        style={{ width: '100%' }}
                                        options={this.props.agds}
                                        placeholder="Nombre"
                                        filterOption={(inputValue, option) =>
                                        option.value !== undefined
                                        }
                                        onChange = {(e, value, reason) => {
                                            if(e === undefined) return;
                                            var id = this.props.agds.findIndex(v => v.value == e);
                                            if(id !== -1)
                                                lastInfo.agdID = id+1;
                                            console.log(lastInfo.agdID);
                                        }}
                                        defaultValue={this.props.agds[this.props.agdID - 1].value}
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
                                        value={this.value === undefined ? lastInfo.rangeVal : this.value}
                                        allowClear
                                    />
                                </Col>
                                <p className='card-subtitle' style={{marginTop: 8}}>Horas cumplidas: {this.props.horas}</p>
                            </Row>
                        </div>
    
            </Modal>
        );
        const modalDelete = (
            <Modal
                    title="Eliminar Jornada"
                    visible={this.state.deleteVisible}
                    onOk={this.handleOkDelete}
                    onCancel={this.handleCancel}
                    cancelText="Cancelar"
                    okText="Aceptar"
                    destroyOnClose
                    style={{padding: 16}}
                    >
                        <div className="name-title-hoverless" style={{padding:8, textAlign: "center"}}>
                            ¿Quiere borrar la jornada <h1>{this.props.title}</h1>?
                        </div>
    
            </Modal>
        );
        return(
            <div className="card">
                {modalEdit}
                {modalDelete}
                <div className="card-row">
                    <div className="card-left-col">
                        <img src={JornadaImg} alt=""/>
                    </div>
                    <div className="card-mid-col">
                        <Row>
                            <div className="card-title-container">
                                <h1 className="name-title-hoverless">
                                    {this.props.title}
                                </h1>
                            </div>
                        </Row>
                            <div className="card-contents cols">
                                <div className="card-content-col">
                                    <h3 className="card-subtitle">AGD: {this.props.agds[this.props.agdID - 1].value}</h3>
                                    <h3 className="card-subtitle">UCD: {this.props.ucds[this.props.ucdID - 1].value}</h3>
                                </div>
                                <div className="card-content-col">
                                    <h3 className="card-subtitle">Ingreso: {this.props.ingreso}</h3>
                                    <h3 className="card-subtitle">Egreso: {this.props.egreso}</h3>
                                </div>
                            </div>
                    </div>
                    <div className="card-right-col">
                        <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
                            <EllipsisOutlined style={{fontSize: 20, color: '#9EA2A7'}}/>
                        </Dropdown>
                        <h4 style={{fontFamily: 'Inter'}}>
                        {this.props.horas}hs
                        </h4>
                    </div>
                </div>
            </div>
        )
    }
}

export default JornadaCard