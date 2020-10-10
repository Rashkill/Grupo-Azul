import React,{ useState, useEffect } from 'react';
import { Form, Divider, Row, Col, Input, Modal, Button, Upload, message ,notification  } from 'antd';
import { PlusOutlined, FileDoneOutlined, UploadOutlined, CheckCircleOutlined, PaperClipOutlined } from '@ant-design/icons';
import AcompCard from './acomp-card.js';
import Axios from 'axios';

const { Search } = Input;

function Acompañantes() {
    const [state, setState] = useState({    //Estados
        id:0,
        visible : false,
        fileList: [],
        visibleEdit: false,
        isLoading:true,
        nombre:"",
        apellido:"",
        dni:0,
        telefono:"",
        domicilio:"",
        email:"",
        valorHora:0
    });
    
    const [data, setData] = useState([]);
    const [acompEdit,setAcompEdit] = useState([]);
    const [fileImg, setFileImg] = useState([]);
    const [filePdf,setFilePdf] = useState([]);

    const getData = async () =>{
        const res = await fetch('http://localhost:4000/acomp');
        const datos = await res.json();
        setData(datos);
        console.log(data);
    }

    useEffect(()=>{
        getData();
    },[]);

    const showModal =  () => {     //Mostrar modal
        setState({
            visible: true,
        });
    };
    const showEdit = async(id) =>{     //Mostrar modal Editar 
        setState({
            id:id,
            visibleEdit: true  
        });
        const options = {method: 'GET'};
        const res = await fetch('http://localhost:4000/acompOnly/'+id,options);
        const datos = await res.json();
        setAcompEdit(datos);
        cargandoInputs(datos);
        console.log(datos[0].Nombre);

    };

    const handleOk = async () => {       //maneja boton ok del modal
        const formData = new FormData();
        var data = [state.nombre,state.apellido,state.dni,state.telefono,state.domicilio,state.email,state.banco,state.cvu,state.valorHora];
        console.log(data);
        // var file =[];
        // file.push(fileImg);
        // file.push(filePdf);
        formData.append("files",fileImg); 
        formData.append("files",filePdf); 
        // formData.append("data",data)
        formData.append("nombre",state.nombre)
        formData.append("apellido",state.apellido)
        formData.append("dni",state.dni)
        formData.append("domicilio",state.domicilio)
        formData.append("telefono",state.telefono)
        formData.append("email",state.email)
        formData.append("banco",state.banco)
        formData.append("cvu",state.cvu)
        formData.append("valorHora",state.valorHora)

        Axios.post('http://localhost:4000/addfile',formData,{
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data'
            }
        }).then(res=>{
            form.resetFields();
            limpiarInputs();
            openNotification();
            getData();
        });

        // var response =  await res.json().then(openNotification()).then(getData());

    };
    const handlerOkEdit = async () =>{
        console.log(state.id);
        const formData = new FormData();
        formData.append("files",fileImg); 
        formData.append("files",filePdf); 
        formData.append("nombre",state.nombre)
        formData.append("apellido",state.apellido)
        formData.append("dni",state.dni)
        formData.append("domicilio",state.domicilio)
        formData.append("telefono",state.telefono)
        formData.append("email",state.email)
        formData.append("banco",state.banco)
        formData.append("cvu",state.cvu)
        formData.append("valorHora",state.valorHora)

        Axios.post('http://localhost:4000/updateAcomp/'+state.id,formData,{
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data'
            }
        }).then(res=>{
            form1.resetFields();
            limpiarInputs();
            openNotification();
            getData();
        });
    }
    const handleCancel = e => {   //cancelar modales
        var confirm = window.confirm('¿Desea cerrar el formulario? Se perderán los cambios no guardados')
        if(confirm){
            console.log(e);
            setState({
            visible: false,
            visibleEdit: false
            });
            limpiarInputs();
            form.resetFields();
            form1.resetFields();
        }
    };
    const handleSearch = (v) => { //Presionar enter al buscador
        console.log(v)
    }  
    const onChangeInput = e =>{
        if(e.target.id==="nombre"){
            var nombre = e.target.value;
            console.log("nombre: ",nombre);
            setState(state=>({...state,nombre:nombre}));
        }
        if(e.target.id==="apellido"){
            var apellido = e.target.value;
            console.log("apellido: ",apellido);
            setState(state=>({...state,apellido:apellido}));
        }
        if(e.target.id==="dni"){
            var dni = e.target.value;
            console.log("dni: ",dni);
            setState(state=>({...state,dni:dni}));
        }
        if(e.target.id==="telefono"){
            var telefono = e.target.value;
            console.log("telefono: ",telefono);
            setState(state=>({...state,telefono:telefono}));
        }
        if(e.target.id==="domicilio"){
            var domicilio = e.target.value;
            console.log("domicilio: ",domicilio);
            setState(state=>({...state,domicilio:domicilio}));
        }
        if(e.target.id==="email"){
            var email = e.target.value;
            console.log("email: ",email);
            setState(state=>({...state,email:email}));
        }
        if(e.target.id==="valorHora"){
            var valorHora = e.target.value;
            console.log("valorHora: ",valorHora);
            setState(state=>({...state,valorHora:valorHora}));
        }
        if(e.target.id==="banco"){
            var banco = e.target.value;
            console.log("banco: ",banco);
            setState(state=>({...state,banco:banco}));
        }
        if(e.target.id==="cvu"){
            var cvu = e.target.value;
            console.log("cvu: ",cvu);
            setState(state=>({...state,cvu:cvu}));
        }
        if(e.target.id==="valorHora"){
            var valorHora = e.target.value;
            console.log("valorHora: ",valorHora);
            setState(state=>({...state,valorHora:valorHora}));
        }
    }
    const fileHandler = event =>{
        console.log(fileImg);
        const data = new FormData();
        data.append("file",fileImg);
        Axios.post('http://localhost:4000/addfile',data,{
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(res=>console.log("asd: ",res))
        .catch(err=>console.log("err: ", err));
    };
    const openNotification = () => {
        setState({
            visible: false,
        });

        notification.open({
            message: 'Creado con éxito',
            description:
            `El Acompañante ${state.nombre} ya se encuentra en la lista.`,
            icon: <CheckCircleOutlined style={{ color: '#52C41A' }} />,
        });
    };
    const showFile =()=>{
        Axios.get('http://localhost:4000/photo/1',{
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(res=>setFileImg(res))
        .then(console.log(fileImg))
        .catch(err=>console.log("err: ", err));
    }
    const limpiarInputs = () =>{
        setState(state=>({...state,nombre:""}));
        setState(state=>({...state,apellido:""}));
        setState(state=>({...state,domicilio:""}));
        setState(state=>({...state,dni:0}));
        setState(state=>({...state,telefono:0}));
        setState(state=>({...state,email:""}));
        setState(state=>({...state,banco:""}));
        setState(state=>({...state,cvu:""}));
        setState(state=>({...state,alias:""})); 
        setState(state=>({...state,valorHora:0})); 
        setFilePdf([]);
        setFileImg([]);
    } 
    const cargandoInputs = (datos) =>{
        setState(state=>({...state,nombre:datos[0].Nombre}));
        setState(state=>({...state,apellido:datos[0].Apellido}));
        setState(state=>({...state,domicilio:datos[0].Domicilio}));
        setState(state=>({...state,dni:datos[0].Dni}));
        setState(state=>({...state,telefono:datos[0].Telefono}));
        setState(state=>({...state,email:datos[0].Email}));
        setState(state=>({...state,banco:datos[0].Banco}));
        setState(state=>({...state,cvu:datos[0].Cvu}));
        setState(state=>({...state,alias:datos[0].Alias})); 
        setState(state=>({...state,valorHora:datos[0].ValorHora})); 
    }
    const propsImg = {
        onRemove: file => {
            console.log(file);
                setFileImg([]);
                return {
                    fileImg,
                };
        },
        // },
        // onChange: e =>{
        //     fileImg.slice(-1);
        //     return {
        //         fileImg,
        //     }
        // },
        beforeUpload: file => {
            setFileImg(file);
            console.log(fileImg);
          return false;
        },
        fileImg,
    };
    const propsPdf = {
        onRemove: file => {
                setFilePdf([]);
                return {
                    filePdf,
                  };
        },
        beforeUpload: file => {
            setFilePdf(file);
          return false;
        },
        filePdf,
    };
    const [form] = Form.useForm();
    const [form1] = Form.useForm();
    return(
        <div className="content-cont">
            {/*Todos los Acompañantes */}
            <Row>
                <Col span={18}>
                    <Divider orientation="left" plain>
                        <h1 className="big-title">
                            Acompañantes
                        </h1>
                    </Divider>
                    <div className="cards-container">
                        
                        <AcompCard 
                            title="Juan Perez" 
                            price="80" 
                            udc="Calle XXX"
                            domicilio="Avenida Siempre Viva 123"
                            email="juanperez26@gmail.com"
                            telefono="+545325000"
                            id="1" 
                            key={1}
                        />
                        
                    {/* Display de acompañantes */}
                    {data.map((i , index)=>{
                        return(
                            <AcompCard edit={showEdit} refresh={getData} title={i.Nombre} price={i.ValorHora} email={i.Email} telefono={i.Telefono} domicilio={i.Domicilio} id={i.Id} key={index}/>
                        )
                    })}                   
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
            
            {/* //Agregar Acomp MODAL */}     
            <Modal
                title="Nuevo Acompañante"
                visible={state.visible}
                onOk={handleOk}
                onCancel={handleCancel}
                cancelText="Cancelar"
                okText="Ok"
                width='70%'
            >

            <Form form={form}>

                <Row gutter={[48,20]}>
                <Col span={12}>
                    <Divider orientation="left">Datos Principales</Divider>
                </Col>
                <Col span={12}>
                    <Divider orientation="left">Datos de Contacto</Divider>
                </Col>
                    <Col span={12}>
                        <Input placeholder="Nombre" id="nombre" value={state.nombre} onChange={onChangeInput} />
                    </Col>
                    <Col span={12}>
                    <Input placeholder="Telefono" type="number" id="telefono" value={state.telefono} onChange={onChangeInput}/>
                    </Col>
                    <Col span={12}>
             
                        <Input placeholder="Apellido" id="apellido" value={state.apellido} onChange={onChangeInput}/>
                    </Col>
                    <Col span={12}>
                        <Input placeholder="Domicilio" id="domicilio" value={state.domicilio} onChange={onChangeInput}/>
                    </Col>
                    <Col span={12}>
                    <Input placeholder="DNI" type="number" id="dni" value={state.dni} onChange={onChangeInput}/>
                    </Col>
                    <Col span={12}>
                        <Input placeholder="Email" id="email" value={state.email} onChange={onChangeInput}/>
                    </Col>
                </Row>
                 <Divider orientation="left">Datos de Facturación</Divider>
                 <Row gutter={[48,20]}>
                 <Col span={12}>
                        <Input placeholder="Banco" id="banco" value={state.banco} onChange={onChangeInput}/>
                    </Col>
                    <Col span={12}>
                        {/* <Button placeholder="Póliza" onClick={fileHandler} id="poliza" onChange={onChangeInput} suffix={<PaperClipOutlined className="site-form-item-icon" />}/> */}
                    {/* <Upload {...props}>
                        <Button icon={<UploadOutlined />}>Click to upload</Button>
                    </Upload> */}
                    </Col>
                    <Col span={12}>
                    
                        <Input placeholder="CVU/ALIAS" id="cvu" value={state.cvu} onChange={onChangeInput}/>
                    </Col>

                 <Col span={12}>
                 {/* <Input placeholder="Constancia AFIP" id="afip" onChange={onChangeInput}  suffix={<PaperClipOutlined className="site-form-item-icon" />}/>      */}
                 {/* <Upload {...props}>
                    <Button icon={<UploadOutlined />}>Constancia AFIP</Button>
                </Upload>   */}
                {/* <input type="file" id="img" accept="image/jpeg,image/png" onChange={event => {
                    const file = event.target.files[0];
                    setFileImg(file);
                }}/>
                <input type="file" id="file" accept="application/pdf" placeholder="Poliza" onChange={event => {
                    const file = event.target.files[0];
                    setFilePdf(file);
                            }}/> */}
                <Form.Item
                    name="Afip"
                    valuePropName="fileImg"
                    getValueFromEvent={fileImg}
                >                
                <Upload {...propsImg} accept="image/jpeg,image/png">
                    <Button icon={<UploadOutlined />}>Constancia AFIP</Button>
                </Upload>             
                </Form.Item>

                <Form.Item
                    name="Poliza"
                    valuePropName="filePdf"
                    getValueFromEvent={filePdf}
                >
                 <Upload {...propsPdf} accept="application/pdf">
                    <Button icon={<UploadOutlined />}>Poliza</Button>
                </Upload>
                </Form.Item> 
               

                </Col>
                    <Col span={12}>
                        <Input placeholder="Valor Hora" type="number" id="valorHora" value={state.valorHora} onChange={onChangeInput}/>
                    </Col>
                </Row>        
            </Form> 

                

                {/* Botones Programados
                <Upload {...props}>
                    <Button icon={<UploadOutlined />}>Click to upload</Button>
                </Upload>  
                <input type="file" id="file" accept="image/jpeg,image/png,application/pdf" onChange={event => {
                    const file = event.target.files[0];
                    setFilePath(file);
                }}/>
                <Button onClick={fileHandler}>Enviar File</Button>
                <Button onClick={showFile}>Mostrar Poliza</Button>
                <img src={`data:image/jpeg;base64,${img.data}`} /> */}
                           
            </Modal>
            
            {/* //Editar Acomp MODAL */}       
            <Modal
                title="Editar Acompañante"
                visible={state.visibleEdit}
                onOk={handlerOkEdit}
                onCancel={handleCancel}
                cancelText="Cancelar"
                okText="Editar"
                width='70%'
            >
            <Form form={form1}>

            <Row gutter={[48,20]}>
                <Col span={12}>
                    <Divider orientation="left">Datos Principales</Divider>
                </Col>
                <Col span={12}>
                    <Divider orientation="left">Datos de Contacto</Divider>
                </Col>
                    <Col span={12}>
                        <Input placeholder="Nombre" id="nombre" value={state.nombre} onChange={onChangeInput}/>
                    </Col>
                    <Col span={12}>
                    <Input placeholder="Telefono" type="number" id="telefono" value={state.telefono} onChange={onChangeInput}/>
                    </Col>
                    <Col span={12}>
             
                        <Input placeholder="Apellido" id="apellido" value={state.apellido} onChange={onChangeInput}/>
                    </Col>
                    <Col span={12}>
                        <Input placeholder="Domicilio" id="domicilio" value={state.domicilio} onChange={onChangeInput}/>
                    </Col>
                    <Col span={12}>
                    <Input placeholder="DNI" type="number" id="dni" value={state.dni} onChange={onChangeInput}/>
                    </Col>
                    <Col span={12}>
                        <Input placeholder="Email" id="email" value={state.email} onChange={onChangeInput}/>
                    </Col>
                </Row>
                 <Divider orientation="left">Datos de Facturación</Divider>
                 <Row gutter={[48,20]}>
                 <Col span={12}>
                        <Input placeholder="Banco" id="banco" value={state.banco} onChange={onChangeInput}/>
                    </Col>
                    <Col span={12}>
                        {/* <Button placeholder="Póliza" onClick={fileHandler} id="poliza" onChange={onChangeInput} suffix={<PaperClipOutlined className="site-form-item-icon" />}/> */}
                    {/* <Upload {...props}>
                        <Button icon={<UploadOutlined />}>Click to upload</Button>
                    </Upload> */}
                    </Col>
                    <Col span={12}>    
                        <Input placeholder="CVU/ALIAS" id="cvu" value={state.cvu} onChange={onChangeInput}/>
                    </Col>

                 <Col span={12}>
                 {/* <Input placeholder="Constancia AFIP" id="afip" onChange={onChangeInput}  suffix={<PaperClipOutlined className="site-form-item-icon" />}/>      */}
                 {/* <Upload {...props}>
                    <Button icon={<UploadOutlined />}>Constancia AFIP</Button>
                </Upload>   */}
                <Form.Item
                    name="Afip"
                    valuePropName="fileImg"
                    getValueFromEvent={fileImg}
                >
                <Upload {...propsImg} accept="image/jpeg,image/png">
                    <Button icon={<UploadOutlined />}>Constancia AFIP</Button>
                </Upload>
                </Form.Item>
                
                <Form.Item
                    name="Poliza"
                    valuePropName="filePdf"
                    getValueFromEvent={filePdf}
                >
                <Upload {...propsPdf} accept="application/pdf">
                    <Button icon={<UploadOutlined />}>Poliza</Button>
                </Upload>
                </Form.Item>

                </Col>
                    <Col span={12}>
                        <Input placeholder="Valor Hora" type="number" id="valorHora" value={state.valorHora} onChange={onChangeInput}/>
                    </Col>
                </Row>
            </Form>
                

                {/* Botones Programados
                <Upload {...props}>
                    <Button icon={<UploadOutlined />}>Click to upload</Button>
                </Upload>  
                <input type="file" id="file" accept="image/jpeg,image/png,application/pdf" onChange={event => {
                    const file = event.target.files[0];
                    setFilePath(file);
                }}/>
                <Button onClick={fileHandler}>Enviar File</Button>
                <Button onClick={showFile}>Mostrar Poliza</Button>
                <img src={`data:image/jpeg;base64,${img.data}`} /> */}
        
            </Modal>
        </div>
    )
    
}

export default Acompañantes