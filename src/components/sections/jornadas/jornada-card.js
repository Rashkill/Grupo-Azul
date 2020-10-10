import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Menu, Dropdown, Divider, Row, Col, Input, Modal, AutoComplete, DatePicker,notification  } from 'antd';
import { PlusOutlined, FileDoneOutlined, UploadOutlined, CheckCircleOutlined, PaperClipOutlined } from '@ant-design/icons';
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
        visible: false,
    };


    rangeOk = (value) => {
        //calculo de horas
        if(value[0] !== null && value[1] !== null)
        {
            var mins = value[1] - value[0]
            mins = mins / 1000 / 60
            mins = Math.round(mins)
            var hs = mins / 60
            console.log(hs)
            if(hs > 0)
                lastInfo.horas = hs;

            //lastInfo.title = value[0]._d.getDate() + " de " + mesesNombres[value[0]._d.getMonth()];
            lastInfo.ingreso = value[0].format(dateFormat + " HH:mm");
            lastInfo.egreso = value[1].format(dateFormat + " HH:mm");
        }
    }

    //Mostrar modal
    showModal = () => {     
        this.setState({
        visible: true,
        });
    };
    
    //maneja boton ok del modal
    handleOk = e => {      
        //console.log(e);
        this.setState({
        visible: false,
        });

            // const formData = new FormData();
            // formData.append("agdID",this.props.agdID)
            // formData.append("ucdID",this.props.ucdID)
            // formData.append("horas",this.props.horas)
            // formData.append("ingreso",this.props.ingreso)
            // formData.append("egreso",this.props.egreso)
        axios.post('http://localhost:4000/updateJornada/' + this.props.id, lastInfo).then(() => {
            this.openNotification()
            this.props.Refresh();
        }
        );        
    };

    openNotification = () => {
        this.setState({
            visible: false,
        });

        notification.open({
            message: 'Actualización exitosa',
            description:
            `La jornada se actualizó correctamente.`,
            icon: <CheckCircleOutlined style={{ color: '#52C41A' }} />,
        });
    };

    //cerrar modal
    handleCancel = e => {
        // var confirm = window.confirm('¿Desea cerrar el formulario? Se perderán los cambios no guardados')
        // if(confirm){
             this.setState({visible: false})

        // }
    }


    render() {

        lastInfo = {
            title: this.props.title,
            agdID: this.props.agdID,
            agdNombre: this.props.agdNombre,
            ucdID: this.props.ucdID,
            ucdNombre: this.props.ucdNombre,
            horas: this.props.horas,
            ingreso: this.props.ingreso,
            egreso: this.props.egreso,
            id: this.props.id,
            rangeVal: this.props.rangeVal
        }

        const dropClick = ({ key }) => {
            //Key de <Menu.Item>
            if (key === 'edit') {
                //alert('edit ' + props.id)
                this.setState({visible: true})
            } else {
                //alert('delete')
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
                    <div className="drop-btn">
                        <DeleteFilled />
                        <p>Eliminar</p>
                    </div>
                </Menu.Item>
            </Menu>
        );
    
        const modalEdit = (
            <Modal
                    title="Modificar Jornada"
                    visible={this.state.visible}
                    onOk={this.handleOk}
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
                                        //options={ucds}
                                        placeholder="Nombre"
                                        filterOption={(inputValue, option) =>
                                        option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                        }
                                        // onChange = {(e, value, reason) => {
                                        //     if(e === undefined) return;
                                        //     var id = ucds.findIndex(v => v.value == e);
                                        //     if(id !== -1)
                                        //         lastInfo.ucdID = id+1;
                                        //     console.log(lastInfo.ucdID);
                                        // }}
                                        value={this.props.ucdNombre}
                                        allowClear
                                    />
                                </Col>
    
                                <Col span={11}>
                                    <h4>Acompañante</h4>
                                    <AutoComplete
                                        style={{ width: '100%' }}
                                        //options={agds}
                                        placeholder="Nombre"
                                        filterOption={(inputValue, option) =>
                                        option.value !== undefined
                                        }
                                        // onChange = {(e, value, reason) => {
                                        //     if(e === undefined) return;
                                        //     var id = agds.findIndex(v => v.value == e);
                                        //     if(id !== -1)
                                        //         lastInfo.agdID = id+1;
                                        //     console.log(lastInfo.agdID);
                                        // }}
                                        value={this.props.agdNombre}
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
    
        return(
            <div className="card">
                {modalEdit}
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
                                    <h3 className="card-subtitle">AGD: {this.props.agdNombre}</h3>
                                    <h3 className="card-subtitle">UCD: {this.props.ucdNombre}</h3>
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