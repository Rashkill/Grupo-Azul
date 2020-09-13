import React,{ useState, useEffect } from 'react';
import { Divider, Row, Col, Input, Modal, Button, Upload, message  } from 'antd';
import { PlusOutlined, FileDoneOutlined, UploadOutlined } from '@ant-design/icons';
import AcompCard from './acomp-card.js';
import  {imageToBlob} from 'image-to-blob';

const { Search } = Input;

function Acompañantes() {

    const [state, setState] = useState({    //Estados
        visible : false,
        isLoading:true,
        nombre:""
    });
    const [fileList, setFileList] = useState([]);
    const [data, setData] = useState([]);
    const [nombre, setNombre] = useState("");
    const [precioHora, setPrecioHora] = useState(0);
    const [filePath, setFilePath] = useState("");

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

    const handleOk = async () => {       //maneja boton ok del modal
        // console.log(e);
        var data = [nombre,precioHora];
        const res = await fetch('http://localhost:4000/addacomp',{
            method: "POST",
            headers:{
                'Content-Type' : 'application/json'
            },
            body:JSON.stringify({ data })
        })
        var response =  await res.json().then(getData());
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

    const fileUpload = async (path)=>{
        // const { fileList } = this.state;
        // const formData = new FormData();
        // fileList.forEach(file => {
        //   formData.append('files[]', file);
        // });

        const res = await fetch('http://localhost:4000/addfile',{
            name: 'file',
            method: "POST",
            type:'file',
            headers:{
                'Content-Type' : 'application/json'
            },
            body:JSON.stringify({ path })
        });
        // then((result)=>{
        //     setState({
        //         fileList: [],
        //         isLoading: false
        //     });
        //     message.success('upload successfully.');
        // }).catch(err=>{
        //     setState({
        //         isLoading: false
        //     });
        //     message.error('upload failed.', err);
        // })

    };

    const props = {
        // name: 'file',
        // action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        // headers: {
        //   authorization: 'authorization-text',
        // },
        onChange(info) {
          if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
            // fetch(info.file.originFileObj.path).then(response=>console.log(response))
            fileUpload(info.file.originFileObj);
          }
          if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
          }
        },
      };


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
                <p>//Completa el Formulario//</p>
                <Input placeholder="Nombre" id="nombre" onChange={onChangeInput}/>
                <Input placeholder="Precio Hora" id="precioHora" onChange={onChangeInput}/>
                <hr/>
                
                <Upload {...props}>
                    <Button icon={<UploadOutlined />}>Click to upload</Button>
                </Upload>             
            </Modal>
            
        </div>
    )
    
}

export default Acompañantes