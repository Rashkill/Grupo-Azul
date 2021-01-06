import React,{ useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Row, Col, Menu, Dropdown } from 'antd';
import { EllipsisOutlined, EditFilled, DeleteFilled } from '@ant-design/icons';
import LiqImg from '../../../images/image6.png'
import '../../layout/cards.css'
import Axios from 'axios';
import { createHashHistory } from 'history';
export const history = createHashHistory();

const dateFormat = 'DD/MM/YYYY';
const moment = require('moment');

function LiqCard(props) {
    
    let state = {
        valorTotalHoras: 0
    }

    //Array que almacena las horas totales divididas por id de acompañante
    let infoPorAcomp = [];

    const getJor4Liq = async () => {

        const desde = moment(props.desde, dateFormat).format("YYYY-MM-DD")
        const hasta = moment(props.hasta, dateFormat).format("YYYY-MM-DD")
        let jornadas;
        let totalhoras = 0;

        

        try{
            let fields = "Id,IdAcompañante,CantHoras";
            const res = await fetch('http://localhost:4000/getJor4Liq/' + fields + '/' + props.idbenef + '/' + desde + '/' + hasta);
            jornadas = await res.json();
            console.log("Jornadas: ", jornadas)
        }catch(e){
            console.log("MAL ", e)
        }
        
        jornadas.map(j => {
            console.log("CantidadHoras " + j.IdAcompañante + " :", j.CantHoras)
            totalhoras = totalhoras + j.CantHoras
        })

        //Se loopea el array de las jornadas obtenidas
        for (let index = 0; index < jornadas.length; index++) {
            //Elemento actual
            const jorElem = jornadas[index];
            //Se compara que tenga la misma ID de acompañante (si es que ya existe dentro de "infoPorAcomp")
            //Y devuelve el elemento
            const infoElement = infoPorAcomp.find(v => v.IdAcompañante == jorElem.IdAcompañante);

            //Si lo encuentra, se le suma la hora con la propiedad del elemento actual
            if(infoElement)
                infoElement.horasTotales += jorElem.CantHoras;
            else
            {
                //Caso contrario, se agrega un nuevo elemento con los datos del actual
                //A su vez, se obtiene el valor por hora del acompañante
                try{
                    const res = await fetch('http://localhost:4000/getAcompOnly/'+ jorElem.IdAcompañante +'/ValorHora,Nombre,Apellido,CUIL,DNI,EntidadBancaria,CBU');
                    const datos = await res.json();
                    
                    infoPorAcomp.push({
                        info: datos[0],
                        IdAcompañante: jorElem.IdAcompañante, 
                        valorHora: datos[0].ValorHora,
                        horasTotales: jorElem.CantHoras,
                        valorFinal: 0
                    })
                }catch(e){console.log(e)}
            }
        }

        //Se obtiene el Id del Coordinador desde la base de datos
        const resBenef = await fetch('http://localhost:4000/getBenefOnly/'+ props.idbenef +'/Apellido,Nombre,CUIL,DNI,FechaNacimiento,Domicilio,Localidad,IdCoordinador');
        const datosBenef = await resBenef.json();
        state.infoBenef = datosBenef[0];

        //Se obtienen los datos del Coordinador 
        const resCoord = await fetch('http://localhost:4000/getCoordOnly/'+ state.infoBenef.IdCoordinador +'/Nombre,Apellido,CUIL,DNI,EntidadBancaria,CBU,ValorMes');
        const datosCoord = await resCoord.json();
        state.infoCoord = datosCoord[0];

        //Mapeado para establecer el valor final
        infoPorAcomp.map(i => {
            i.valorFinal = i.valorHora * i.horasTotales;
            state.valorTotalHoras += i.valorFinal;
        })
        state.infoPorAcomp = infoPorAcomp;

        console.log("Informacion separada por acompañante: ", infoPorAcomp);
        console.log("Horas totales del ciclo: " + totalhoras);
    }
    
    const titleClick = () => {

        // Envía el state a liq-preview
        getJor4Liq().then(() => {
            props.history.push({
                pathname: props.linkto,
                state: state
            })
        })
    }

    const dropClick = ({ key }) => {
        //Key de <Menu.Item>
        if (key === 'edit') {
            props.OnEdit(props.id);
        } else {
            props.OnDelete(props.id)
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

    return(
        <div className="card">
            <div className="card-row">
                <div className="card-left-col">
                    <img src={LiqImg} alt="" style={{width: '70%'}}/>
                </div>
                <div className="card-mid-col">
                    <Row>
                        <div className="card-title-container">
                            <h1 className="name-title" onClick={titleClick}>
                                {props.title}
                            </h1>
                            {/* <h3 className="card-subtitle">
                                UDC Asignada: {props.ucd.Nombre + " " + props.ucd.Apellido}
                            </h3> */}
                        </div>
                    </Row>
                        <div className="card-contents">
                            <h3 className="card-subtitle">desde: {props.desde}</h3>
                            <h3 className="card-subtitle">hasta: {props.hasta}</h3>
                        </div>
                </div>
                <div className="card-right-col">
                    <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
                        <EllipsisOutlined style={{fontSize: 20, color: '#9EA2A7'}}/>
                    </Dropdown>
                    <h4 className="card-subtitle">
                    {/* ids: {this.props.id}  */}
                    {props.fecha}
                    </h4>
                </div>
            </div>
        </div>
    )
}


export default withRouter(LiqCard)