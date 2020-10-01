import React,{ useState, useEffect } from 'react';
import { Divider, Row, Col, Input, Modal, Button, Upload, message ,notification  } from 'antd';
import { PlusOutlined, FileDoneOutlined, UploadOutlined, CheckCircleOutlined, PaperClipOutlined } from '@ant-design/icons';
import AcompCard from './acomp-card.js';
import Axios from 'axios';

const { Search } = Input;

function Acompañantes() {

    const [state, setState] = useState({    //Estados
        visible : false,
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
    const [fileImg, setFileImg] = useState("");
    const [filePdf,setFilePdf] = useState("");

    const getData = async () =>{
        const res = await fetch('http://localhost:4000/acomp');
        const datos = await res.json();
        setData(datos);
        console.log(datos);
    }

    useEffect(()=>{
        getData();
    },[]);

    const showModal = () => {     //Mostrar modal
        setState({
            visible: true,
        });
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
        // const res = await fetch('http://localhost:4000/addacomp',{
        //     method: "POST",
        //     headers:{
        //         'Content-Type' : 'application/json'
        //     },
        //     body:JSON.stringify({ data })
        // })

        Axios.post('http://localhost:4000/addfile',formData,{
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data'
            }
        }).then(res=>{
            openNotification();
            getData();
        });

        // var response =  await res.json().then(openNotification()).then(getData());

    };

    const handleCancel = () => {   //cancelar modal
        var confirm = window.confirm('¿Desea cerrar el formulario? Se perderán los cambios no guardados')
        if(confirm){
            setState({visible: false})

        }
    };

    const handleSearch = (v) => { //Presionar enter al buscador
        console.log(v)
    }  
    const onChangeInput = e =>{
        if(e.target.id=="nombre"){
            var nombre = e.target.value;
            console.log("nombre: ",nombre);
            setState(state=>({...state,nombre:nombre}));
        }
        if(e.target.id=="apellido"){
            var apellido = e.target.value;
            console.log("apellido: ",apellido);
            setState(state=>({...state,apellido:apellido}));
        }
        if(e.target.id=="dni"){
            var dni = e.target.value;
            console.log("dni: ",dni);
            setState(state=>({...state,dni:dni}));
        }
        if(e.target.id=="telefono"){
            var telefono = e.target.value;
            console.log("telefono: ",telefono);
            setState(state=>({...state,telefono:telefono}));
        }
        if(e.target.id=="domicilio"){
            var domicilio = e.target.value;
            console.log("domicilio: ",domicilio);
            setState(state=>({...state,domicilio:domicilio}));
        }
        if(e.target.id=="email"){
            var email = e.target.value;
            console.log("email: ",email);
            setState(state=>({...state,email:email}));
        }
        if(e.target.id=="valorHora"){
            var valorHora = e.target.value;
            console.log("valorHora: ",valorHora);
            setState(state=>({...state,valorHora:valorHora}));
        }
        if(e.target.id=="banco"){
            var banco = e.target.value;
            console.log("banco: ",banco);
            setState(state=>({...state,banco:banco}));
        }
        if(e.target.id=="cvu"){
            var cvu = e.target.value;
            console.log("cvu: ",cvu);
            setState(state=>({...state,cvu:cvu}));
        }
        if(e.target.id=="valorHora"){
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
    // const props = {
    //     // name: 'file',
    //     // action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    //     // headers: {
    //     //   authorization: 'authorization-text',
    //     // },
    //     // beforeUpload: file => {
    //     //     if (file.type !== 'image/png' || file.type !== 'image/jpeg' || file.type !== 'application/pdf') {
    //     //       message.error(`${file.name} is not a png or jpeg or pdf`);
    //     //     }
    //     //     return;
    //     // },
    //     onChange(info) {

    //         console.log(info.file, info.fileList);
    //         // fetch(info.file.originFileObj.path).then(response=>console.log(response))
    //         // fileUpload(info.file.originFileObj);
    //         const file = info.file;
    //         setFile(file);
          

    //     //   if (info.file.status === 'done') {
    //     //     message.success(`${info.file.name} file uploaded successfully`);
    //     //   } else if (info.file.status === 'error') {
    //     //     message.error(`${info.file.name} file upload failed.`);
    //     //   }
    //     },
    // };


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
                            <AcompCard refresh={getData} title={i.Nombre} price={i.ValorHora} email={i.Email} telefono={i.Telefono} domicilio={i.Domicilio} id={i.Id} key={index}/>
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

            <Modal
                title="Nuevo Acompañante"
                visible={state.visible}
                onOk={handleOk}
                onCancel={handleCancel}
                cancelText="Cancelar"
                okText="Ok"
                width='70%'
            >

                <Row gutter={[48,20]}>
                <Col span={12}>
                    <Divider orientation="left">Datos Principales</Divider>
                </Col>
                <Col span={12}>
                    <Divider orientation="left">Datos de Contacto</Divider>
                </Col>
                    <Col span={12}>
                        <Input placeholder="Nombre" id="nombre" onChange={onChangeInput}/>
                    </Col>
                    <Col span={12}>
                    <Input placeholder="Telefono" type="number" id="telefono" onChange={onChangeInput}/>
                    </Col>
                    <Col span={12}>
             
                        <Input placeholder="Apellido" id="apellido" onChange={onChangeInput}/>
                    </Col>
                    <Col span={12}>
                        <Input placeholder="Domicilio" id="domicilio" onChange={onChangeInput}/>
                    </Col>
                    <Col span={12}>
                    <Input placeholder="DNI" type="number" id="dni" onChange={onChangeInput}/>
                    </Col>
                    <Col span={12}>
                        <Input placeholder="Email" id="email" onChange={onChangeInput}/>
                    </Col>
                </Row>

                {/* <Row>
                <Col span={12}>
                 <Input placeholder="Nombre" id="nombre" onChange={onChangeInput}/>
                </Col>
                <Col span={12}>
                <Input placeholder="Precio Hora" id="precioHora" onChange={onChangeInput}/>
                </Col>
                </Row> */}
                 <Divider orientation="left">Datos de Facturación</Divider>
                 <Row gutter={[48,20]}>
                 <Col span={12}>
                        <Input placeholder="Banco" id="banco" onChange={onChangeInput}/>
                    </Col>
                    <Col span={12}>
                        {/* <Button placeholder="Póliza" onClick={fileHandler} id="poliza" onChange={onChangeInput} suffix={<PaperClipOutlined className="site-form-item-icon" />}/> */}
                    {/* <Upload {...props}>
                        <Button icon={<UploadOutlined />}>Click to upload</Button>
                    </Upload> */}
                    </Col>
                    <Col span={12}>
                    
                        <Input placeholder="CVU/ALIAS" id="cvu" onChange={onChangeInput}/>
                    </Col>

                 <Col span={12}>
                 {/* <Input placeholder="Constancia AFIP" id="afip" onChange={onChangeInput}  suffix={<PaperClipOutlined className="site-form-item-icon" />}/>      */}
                 {/* <Upload {...props}>
                    <Button icon={<UploadOutlined />}>Constancia AFIP</Button>
                </Upload>   */}
                <input type="file" id="img" accept="image/jpeg,image/png" onChange={event => {
                    const file = event.target.files[0];
                    setFileImg(file);
                }}/>
                <input type="file" id="file" accept="application/pdf" placeholder="Poliza" onChange={event => {
                    const file = event.target.files[0];
                    setFilePdf(file);
                }}/>
                </Col>
                    <Col span={12}>
                        <Input placeholder="Valor Hora" type="number" id="valorHora" onChange={onChangeInput}/>
                    </Col>
                </Row>

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