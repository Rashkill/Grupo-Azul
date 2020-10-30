import React from 'react';
import { Divider, Row, Col, Input, Modal, Empty, Form, AutoComplete, Upload, Button, DatePicker, notification} from 'antd';
import { PlusOutlined, LoadingOutlined, UploadOutlined, CheckCircleOutlined, AlertOutlined } from '@ant-design/icons';
import { Document, Page, pdfjs } from 'react-pdf';
import InfiniteScroll from "react-infinite-scroll-component";
import BenefCard from './benef-card'
import Axios from 'axios';

const { Search } = Input;

var ucds = [], ucdsFilter = [];
var coords = [];
var coordIndex = -1;
var lastInfo = new FormData();
var fileBlob, fileURL;

const maxRows = 5;
var rowOffset = 0;
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

class Beneficiarios extends React.Component{

    state = {
        visible: false,
        isLoading: true,
        cantidad: 0,
        fileList: [],
        id: 0,
        pdfViewer: false,
        numPages: 0,
        actualPage: 1
    };
    
    abortController = new AbortController();

    //Secuencia que obtiene la informacion y luego desactiva el icono de carga
    getData = () =>{
        this.loadAndGetData().then(() => this.setState({isLoading: false}));
    }

    //Obtiene la informacion de la base de datos
    loadAndGetData = async() => {
        try{
            const fields = "Id, Nombre, Apellido, DNI, CUIL, FechaNacimiento, Domicilio, Localidad, CodigoPostal, Email, Telefono, Enfermedades, IdCoordinador"
            const resBenef = await fetch('http://localhost:4000/getBenef/' + fields + '/' + maxRows + '/' + rowOffset, {signal: this.abortController.signal});
            const datosBenef = await resBenef.json();
            
            if(datosBenef.length > 0)
                Array.prototype.push.apply(ucds, datosBenef);
            
            ucdsFilter = ucds;

            const res = await fetch('http://localhost:4000/getCoord/Nombre,Apellido,Id', {signal: this.abortController.signal});
            const datos = await res.json();
            if(datos)
                coords = datos.map(c => ({
                    value: c.Nombre + " " + c.Apellido,
                    id: c.Id
                }));

            this.setState({cantidad: ucdsFilter.length, isLoading: false})
            rowOffset += maxRows;
        }catch(e){}
    }

    //Obtiene los archivos
    getPdf = async(id) =>{
        try{
            const res = await fetch('http://localhost:4000/getBenefOnly/'+ id +'/FichaInicial', {signal: this.abortController.signal});
            const datos = await res.json();

            fileBlob = new Blob([Buffer.from(datos[0].FichaInicial.data)], {type: "application/pdf"})
            fileURL = URL.createObjectURL(fileBlob)
        } 
        catch(e){console.log(e)}
    }

    fetchMoreData = () => {
        this.setState({isLoading:true});
        this.getData();
    };
    
    //Se ejecuta al montar el componente
    componentDidMount()
    {
        this.getData();
    }

    //Se ejecuta al desmontar el componente
    componentWillUnmount()
    {
        rowOffset = 0;
        this.abortController.abort();
    }

    //Notificacion (duh)
    openNotification = (msg, desc, succeed) => {
        this.setState({
            editVisible: false,
        });

        notification.open({
            message: msg,
            description: desc,
            icon: succeed ? 
            <CheckCircleOutlined style={{ color: '#52C41A' }} /> : 
            <AlertOutlined style={{ color: '#c4251a' }} />
        });
    };
    
    //Mostrar modal
    showModal = () => {     
        this.setState({
        visible: true,
        });
        coordIndex = -1;
    };

    
    //Se llama al presionar el boton OK
    handleOk = e => {   
        //Si la 'id' es menor o igual a 0, significa que se esta agregando uno nuevo
        if(this.state.id <=0)
        {
            //Se asigna el archivo desde la lista y se llama a la base de datos
            lastInfo.set("FichaInicial", this.state.fileList[0])
            Axios.post('http://localhost:4000/addBenef', lastInfo, {
                headers: {
                    Accept: 'application/json'
                }
            }).then(() => {
                //Se establecen los valores por defecto y se abre la notificacion
                this.setState({
                    visible: false,
                    id: 0,
                    fileList: []
                })
                this.openNotification("Datos Agregados",
                "El beneficiario " + lastInfo.get("Apellido") + " ahora se encuentra en la lista", true);
                this.getData();
            });
        }
        else    //Parte de la actualizacion
        {   
            //Se comprueba que no se haya subido un archivo nuevo.
            //De lo contrario, se utiliza el que ya estaba
            if(this.state.fileList.length >= 1)
                lastInfo.set("FichaInicial", this.state.fileList[0]);
            else
                lastInfo.set("FichaInicial", fileBlob)
            Axios.post('http://localhost:4000/updBenef/' + this.state.id, lastInfo, {
                headers: {
                    Accept: 'application/json'
                }
            }).then(() => {
                //Se establecen los valores por defecto y se abre la notificacion
                this.setState({
                    visible: false,
                    id: 0,
                    fileList: []
                })
                this.openNotification("Datos Actualizados",
                "El acompañante fue actualizado correctamente", true);
                this.getData();
            });
        }
    };

    //cancelar modal
    handleCancel = e => {
        Modal.confirm({
            title:'¿Desea cerrar el formulario?',
            content: 'Se perderán los cambios no guardados',
            okText: 'Si', cancelText: 'No',
            onOk:(()=>{this.setState({visible: false, id:0})})
        })
    };

    //Buscador
    handleSearch = (v) => {

        //Se comprueba que el valor ingresado no esté vacio
        if(v !== undefined || v !== "")
        {
            // if(p.Nombre.toUpperCase().includes(v.toUpperCase())||
            // p.Apellido.toUpperCase().includes(v.toUpperCase()))

            ucdsFilter = [];    //Se vacia el array
            var k = v.split(':');   //Se separa la 'key'(0) y el valor(1), si es que hay ":"
            ucds.map(p => {
                if(k.length === 2 && p[k[0]] !== undefined){
                    //Si los valores separados son 2 y la 'key'(0) es valida
                    //Se busca a partir de la 'key'(0) el valor(1) ingresado
                    //Si dentro del elemento existe dicho valor(1), se "pushea" el objeto
                    if(p[k[0]].toString().toUpperCase().includes(k[1].toUpperCase()))
                        ucdsFilter.push(p);
                }
                else{
                    //En el caso de que haya menos valores separados
                    //Se busca en cada elemento dentro del objeto la coincidencia
                    var f = false;
                    Object.keys(p).forEach(key => { 
                        if(p[key].toString().toUpperCase().includes(v.toUpperCase()) && !f) 
                        {
                            ucdsFilter.push(p);
                            f = true;
                        }
                    })
                }
            })
        }
        else ucdsFilter = ucds;

        this.setState({cantidad: ucdsFilter.length});
    }
    
    //Se llama al presionar el boton 'Editar' en la tarjeta
    onEdit = (id) => {

        //Se obtiene el index del array, segun la Id a editar
        //Luego se rellenan los campos correspondientes
        let index = ucds.findIndex(p => p.Id == id);
        for (var prop in ucds[index]) {
            lastInfo.set(prop, ucds[index][prop]);
        }
        coordIndex = coords.findIndex(v => v.id == lastInfo.get("IdCoordinador"));
        this.getPdf(id).then(() => {this.setState({id:id, visible: true}); console.log(fileBlob, fileURL)});
    }

    //Se llama al presionar el boton 'Eliminar' en la tarjeta
    onDelete = (id) => {
        Modal.confirm({
            title:'¿Realmente desea eliminar este elemento?',
            content: 'Esta acción no se puede deshacer.',
            okText: 'Si', cancelText: 'No',
            onOk:(()=>{
                Axios.delete('http://localhost:4000/benef/' + id).then(() => {
                this.openNotification(
                    "Eliminación exitosa",
                    "El Beneficiario se borró correctamente",
                    true
                )
                this.getData();
                });
            })
        })
    }

    //Se asigna o elimina el archivo
    FichaInicial = {
        onRemove: file => {
                this.setState({fileList: []})
                return true;
        },
        beforeUpload: file => {
            let fileL = []; fileL.push(file);
            this.setState({fileList: fileL})
            console.log(file);
          return false;
        }
    };

    //Se asignan los campos correspondientes
    onChangeInput = (e) => {
        lastInfo.set(e.target.id, e.target.value);
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
                        <Empty style={{display: this.state.isLoading ? "none" : ucdsFilter.length > 0 ? "none" : "inline"}} description={false} />
                        <InfiniteScroll
                            dataLength={this.state.cantidad}
                            next={this.fetchMoreData}
                            hasMore={true}
                            style={{margin: 6, padding: 8}}
                        >
                        {ucdsFilter.map(p =>{
                            return(
                            <BenefCard 
                                title={p.Nombre + " " + p.Apellido}
                                domicilio={p.Domicilio}
                                telefono={p.Telefono}
                                linkto="/benefprofile"
                                key={p.Id}
                                id={p.Id}
                                OnEdit={this.onEdit}
                                OnDelete={this.onDelete}
                            />)
                        })}
                        </InfiniteScroll>
                        <LoadingOutlined style={{ padding: 16, fontSize: 24, display: this.state.isLoading ? "inline" : "none" }} spin />
                        </div>

                    </Col>
                    <Col span={6}>
                        <Search placeholder="Buscar..." style={{width: '95%', margin: 8, marginRight: 16}} onChange={e => this.handleSearch(e.target.value)} allowClear={true}/>
                        <div className="right-menu">
                            <div className="right-btn" onClick={this.showModal}>
                                <PlusOutlined />
                                <span className="right-btn-text">Nuevo</span>
                            </div>
                        </div>
                    </Col>
                </Row>


                <Modal
                    title={this.state.id <=0 ? "Nuevo Beneficiario" : "Modificar Beneficiario"}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    cancelText="Cancelar"
                    destroyOnClose={true}
                    okText="Ok"
                    centered={true}
                    width={800}
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
                            <Input placeholder="Nombre" id="Nombre" onChange={this.onChangeInput}
                            defaultValue={this.state.id <=0 ? this.value : lastInfo.get("Nombre")} />
                        </Col>
                        <Col span={12}>
                            <h4>Telefono:</h4>
                            <Input placeholder="Telefono" type="number" id="Telefono" onChange={this.onChangeInput}
                            defaultValue={this.state.id <=0 ? this.value : lastInfo.get("Telefono")}/>
                        </Col>
                        <Col span={12}>
                            <h4>Apellido:</h4>
                            <Input placeholder="Apellido" id="Apellido" onChange={this.onChangeInput}
                            defaultValue={this.state.id <=0 ? this.value : lastInfo.get("Apellido")}/>
                        </Col>
                        <Col span={12}>
                            <h4>Domicilio:</h4>
                            <Input placeholder="Domicilio" id="Domicilio" onChange={this.onChangeInput}
                            defaultValue={this.state.id <=0 ? this.value : lastInfo.get("Domicilio")}/>
                        </Col>
                        <Col span={12}>
                            <h4>DNI:</h4>
                            <Input placeholder="DNI" type="number" id="DNI" onChange={this.onChangeInput}
                            defaultValue={this.state.id <=0 ? this.value : lastInfo.get("DNI")}/>
                        </Col>
                        <Col span={12}>
                            <h4>Localidad:</h4>
                            <Input placeholder="Localidad" id="Localidad" onChange={this.onChangeInput}
                            defaultValue={this.state.id <=0 ? this.value : lastInfo.get("Localidad")}/>
                        </Col>
                        <Col span={12}>
                            <h4>Fecha de Nacimiento:</h4>
                            <DatePicker placeholder="Fecha de Nacimiento" id="FechaNacimiento"
                                format="DD / MM / YYYY"
                                style={{width: '100%'}}
                                onChange={(e) =>{lastInfo.set("FechaNacimiento", e.format('DD/MM/YYYY'))}}
                            />
                        </Col>
                        <Col span={12}>
                            <h4>CUIL:</h4>
                            <Input placeholder="CUIL" type="number" id="CUIL" onChange={this.onChangeInput}
                            defaultValue={this.state.id <=0 ? this.value : lastInfo.get("CUIL")}/>
                        </Col>
                        <Col span={12}>
                            <h4>Codigo Postal:</h4>
                            <Input placeholder="Codigo Postal" id="CodigoPostal" onChange={this.onChangeInput}
                            defaultValue={this.state.id <=0 ? this.value : lastInfo.get("CodigoPostal")}/>
                        </Col>
                        <Col span={12}>
                            <h4>Email:</h4>
                            <Input placeholder="Email" id="Email" onChange={this.onChangeInput}
                            defaultValue={this.state.id <=0 ? this.value : lastInfo.get("Email")}/>
                        </Col>
                        <Col span={12}>
                            <h4>Enfermedades:</h4>
                            <Input placeholder="Enfermedades" id="Enfermedades" onChange={this.onChangeInput}
                            defaultValue={this.state.id <=0 ? this.value : lastInfo.get("Enfermedades")}/>
                        </Col>
                        <Col span={12}>
                            <h4>Coordinador:</h4>
                            <AutoComplete 
                                placeholder="Coordinador" 
                                id="IdCoordinador"
                                allowClear
                                onChange={this.onChangeInput} 
                                style={{ width: '100%' }}
                                options={coords}
                                filterOption={(inputValue, option) =>
                                    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) + 1 !== 0}
                                onChange = {(e, value, reason) => {
                                    if(e === undefined) return;
                                    var prop = coords.find(v => v.value == e);
                                    if(prop)
                                        lastInfo.set("IdCoordinador",prop.id);
                                }}
                                defaultValue={this.state.id <=0 ? this.value : coordIndex > -1 ? coords[coordIndex].value : "[Coordinador Borrado]"}
                            />
                        </Col>
                        <Col span={12}>
                            <h4>Ficha Inicial:</h4>
                            <Upload {...this.FichaInicial} id="FichaInicial" 
                                    accept="application/pdf">
                                <Button type="primary" disabled={this.state.fileList.length>0} icon={<UploadOutlined />}>Subir PDF</Button>
                            </Upload>
                            
                            <Button onClick={() => this.setState({pdfViewer: true})}
                                hidden={this.state.id <= 0 || !fileURL}
                            >Ver PDF Actual</Button>
                        </Col>
                    </Row>
                </Form>
                </Modal>
                {/*VISOR PDF*/}
                <Modal
                    title="Visor PDF"
                    visible={this.state.pdfViewer}
                    cancelText="Cerrar"
                    onCancel={()=> this.setState({pdfViewer: false, actualPage:1})}
                    onOk={() => {
                        let fileName = ucds[this.state.id - 1].Apellido + "_FichaInicial.pdf";
                        let link = document.createElement("a");
                        link.download = `${fileName}`;
                        link.href = fileURL;
                        link.click();
                        URL.revokeObjectURL(link.href);
                    }}
                    destroyOnClose={false}
                    okText="Descargar"
                    centered={true}
                    width={800}
                    height={600}
                    >
                    <div style={{backgroundColor: '#E4E4E4', overflowY:"scroll", 
                                minHeight: "400", maxHeight: "400",
                                display: "flex", justifyContent: "center"}}>
                        <Document
                            file={fileURL}
                            loading={'Cargando PDF...'}
                            onLoadSuccess={({numPages}) => this.setState({numPages: numPages})}
                            onLoadError={(e) => console.log(e)}
                        >
                            <Page loading={'Cargando página...'} pageNumber={this.state.actualPage} />
                        </Document>
                    </div>
                    <Divider />
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <Button 
                            disabled={this.state.actualPage <= 1}
                            onClick={()=>this.setState({actualPage: 1})} 
                        >
                            {"<<"}
                        </Button>
                        <Button 
                            disabled={this.state.actualPage <= 1}
                            onClick={()=>this.setState({actualPage: this.state.actualPage - 1})} 
                        >
                            {"<"}
                        </Button>
                        <Button 
                            disabled={this.state.actualPage >= this.state.numPages}
                            onClick={()=>this.setState({actualPage: this.state.actualPage + 1})} 
                        >
                            {">"}
                        </Button>
                        <Button 
                            disabled={this.state.actualPage >= this.state.numPages}
                            onClick={()=>this.setState({actualPage: this.state.numPages})} 
                        >
                            {">>"}
                        </Button>
                    </div>
                </Modal>
                {/*FIN VISOR PDF*/}
            </div>
        )
    }
}

export default Beneficiarios