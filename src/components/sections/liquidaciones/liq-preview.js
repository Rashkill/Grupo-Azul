import React from 'react'
import {Divider} from 'antd'
import { Page, Text, Image, View, Document, StyleSheet, PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import Logo3 from '../../../images/Logo3.jpg'
import FooterLogo from '../../../images/pdf-footer-img.png'
import PhoneIcon from '../../../images/llamada-telefonica.png'
import MailIcon from '../../../images/email.png'

const BORDER_COLOR = '#bfbfbf'
const BORDER_STYLE = 'solid'
const COL1_WIDTH = 40
const COLN_WIDTH = (100 - COL1_WIDTH) / 3

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 16,
        paddingTop: 8,
        fontSize: 12
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    },
    subtitle: {
        width: '100%',
        marginLeft: 8,
        marginTop: 16,
        marginBottom: 8
    },
    table: { 
        display: "table", 
        width: "auto", 
        borderStyle: BORDER_STYLE, 
        borderColor: BORDER_COLOR,
        borderWidth: 1, 
        borderRightWidth: 0, 
        borderBottomWidth: 0,
        // marginTop: 16
    }, 
    tableRow: { 
        margin: "auto", 
        flexDirection: "row" 
    }, 
    tableCol1Header: { 
        width: COL1_WIDTH + '%', 
        borderStyle: BORDER_STYLE, 
        borderColor: BORDER_COLOR,
        borderBottomColor: '#000',
        borderWidth: 1, 
        borderLeftWidth: 0, 
        borderTopWidth: 0
    },     
    tableColHeader: { 
        width: COLN_WIDTH + "%", 
        borderStyle: BORDER_STYLE, 
        borderColor: BORDER_COLOR,
        borderBottomColor: '#000',
        borderWidth: 1, 
        borderLeftWidth: 0, 
        borderTopWidth: 0
    },   
    tableColHeader2: {
        width: '80%', 
        borderStyle: BORDER_STYLE, 
        borderColor: BORDER_COLOR,
        borderBottomColor: '#000',
        borderWidth: 1, 
        borderLeftWidth: 0, 
        borderTopWidth: 0
    },
    tableColHeader3: {
        width: '30%', 
        borderStyle: BORDER_STYLE, 
        borderColor: BORDER_COLOR,
        borderBottomColor: '#000',
        borderWidth: 1, 
        borderLeftWidth: 0, 
        borderTopWidth: 0
    },
    tableCol1: { 
        width: COL1_WIDTH + '%', 
        borderStyle: BORDER_STYLE, 
        borderColor: BORDER_COLOR,
        borderWidth: 1, 
        borderLeftWidth: 0, 
        borderTopWidth: 0 
    },   
    tableCol: { 
        width: COLN_WIDTH + "%", 
        borderStyle: BORDER_STYLE, 
        borderColor: BORDER_COLOR,
        borderWidth: 1, 
        borderLeftWidth: 0, 
        borderTopWidth: 0
    }, 
    tableCol2: { 
        width: '80%', 
        borderStyle: BORDER_STYLE, 
        borderColor: BORDER_COLOR,
        borderWidth: 1, 
        borderLeftWidth: 0, 
        borderTopWidth: 0
    }, 
    tableCol3: { 
        width: '30%', 
        borderStyle: BORDER_STYLE, 
        borderColor: BORDER_COLOR,
        borderWidth: 1, 
        borderLeftWidth: 0, 
        borderTopWidth: 0
    }, 
    tableCellHeader: {
        margin: 5, 
        fontSize: 10,
        fontWeight: 800
    },  
    tableCell: { 
        margin: 5, 
        fontSize: 9,
        fontWeight: 300
    },
    footer: {
        padding: 4,
        height: '10%',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        bottom: '-20%',
        color: '#005DBA',
        fontSize: 10
    }
});

export const onRenderDocument = ({blob, filename}) => {
    var blobUrl = URL.createObjectURL(blob);
    saveDocument(blobUrl, filename);
    // console.log(blobUrl)
};
  
export const saveDocument = (function () {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (blob, fileName) {
        a.href = blob;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(blob);
    };
}());


const LiqPreview = (props) => {
    
    const info = props.location.state
    console.log(info)
    let totalLiq;
    
    if(!info){
        props.history.goBack();
        return(<div></div>)
    }
    else
    
    totalLiq = info.infoCoord.ValorMes;
    info.infoPorAcomp.map((a) => {
        totalLiq = totalLiq + a.valorFinal
    })

    console.log(info)

    return (
        <div className="content-cont prot-shadow">

            <Divider orientation="left" plain>
                <h1 className="big-title">
                    Liquidación N° {props.location.state.id}
                </h1>
                
            </Divider>

            <PDFViewer style={{width: '100%', height: 800}}>
                <Document>
                    <Page size="A4" style={styles.page}>
                        <View style={{fontSize: 8, display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text>Liquidación N° {props.location.state.id}</Text>
                            <Text>Emisión: {props.location.state.fecha}</Text>
                        </View>
                        
                        <Image src={Logo3} style={{height: 140, alignSelf: 'center'}} cache />
                        
                        <View style={{fontSize: 10, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 12}}>
                            <Text>Período {props.location.state.desde} al {props.location.state.hasta}</Text>
                        </View>

                        <View style={styles.subtitle}>
                            <Text>Beneficiario</Text> 
                        </View>

                        <View style={styles.table}>
                                
                            <View style={styles.tableRow}> 
                                <View style={styles.tableColHeader}> 
                                    <Text style={styles.tableCellHeader}>Apellido y Nombre</Text> 
                                </View> 
                                <View style={styles.tableColHeader}> 
                                    <Text style={styles.tableCellHeader}>CUIL</Text> 
                                </View> 
                                <View style={styles.tableColHeader}> 
                                    <Text style={styles.tableCellHeader}>Fecha de Nacimiento</Text> 
                                </View> 
                                <View style={styles.tableCol1Header}> 
                                    <Text style={styles.tableCellHeader}>Domicilio</Text> 
                                </View> 
                            </View>

                            <View style={styles.tableRow}> 
                                <View style={styles.tableCol}> 
                                    <Text style={styles.tableCell}>{info.infoBenef.Apellido.toString() + ', ' + info.infoBenef.Nombre.toString()}</Text> 
                                </View> 
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{info.infoBenef.CUIL.split('-')[0]}-{info.infoBenef.DNI}-{info.infoBenef.CUIL.split('-')[1]}</Text> 
                                </View>
                                <View style={styles.tableCol}> 
                                    <Text style={styles.tableCell}>{info.infoBenef.FechaNacimiento.toString()}</Text> 
                                </View> 
                                <View style={styles.tableCol1}> 
                                    <Text style={styles.tableCell}>{info.infoBenef.Domicilio.toString() + ', ' + info.infoBenef.Localidad.toString()}</Text> 
                                </View> 
                            </View> 
                        </View>

                        <View style={styles.subtitle}>
                            <Text>AGD / s</Text> 
                        </View>

                        <View style={styles.table}>
                            
                            <View style={styles.tableRow}> 
                                <View style={[styles.tableColHeader, {width: '10%'}]}> 
                                    <Text style={styles.tableCellHeader}>N°</Text> 
                                </View> 
                                <View style={styles.tableColHeader}> 
                                    <Text style={styles.tableCellHeader}>Apellido y Nombre</Text> 
                                </View> 
                                <View style={styles.tableColHeader}> 
                                    <Text style={styles.tableCellHeader}>CUIL</Text> 
                                </View> 
                                <View style={styles.tableColHeader}> 
                                    <Text style={styles.tableCellHeader}>Banco</Text> 
                                </View> 
                                <View style={[styles.tableColHeader, {width: '30%'}]}> 
                                    <Text style={styles.tableCellHeader}>CBU</Text> 
                                </View> 
                            </View>

                            {info.infoPorAcomp.map((a) => {
                                return(
                                    <View style={styles.tableRow}> 
                                        <View style={[styles.tableCol, {width: '10%'}]}> 
                                            <Text style={styles.tableCell}>{a.IdAcompañante.toString()}</Text> 
                                        </View> 
                                        <View style={styles.tableCol}> 
                                            <Text style={styles.tableCell}>{a.info.Apellido.toString() + ', ' + a.info.Nombre.toString()}</Text> 
                                        </View> 
                                        <View style={styles.tableCol}>
                                            <Text style={styles.tableCell}>{a.info.CUIL.split('-')[0]}-{a.info.DNI}-{a.info.CUIL.split('-')[1]}</Text> 
                                        </View>
                                        <View style={styles.tableCol}> 
                                            <Text style={styles.tableCell}>{a.info.EntidadBancaria.toString()}</Text> 
                                        </View> 
                                        <View style={[styles.tableCol, {width: '30%'}]}> 
                                            <Text style={styles.tableCell}>{a.info.CBU.toString()}</Text> 
                                        </View> 
                                    </View> 
                                            
                                )
                            })}
                        </View>

                        <View style={styles.subtitle}>
                            <Text>Coordinador Domiciliario</Text> 
                        </View>

                        <View style={styles.table}>
                                
                            <View style={styles.tableRow}> 
                                <View style={styles.tableColHeader}> 
                                    <Text style={styles.tableCellHeader}>Apellido y Nombre</Text> 
                                </View> 
                                <View style={styles.tableColHeader}> 
                                    <Text style={styles.tableCellHeader}>CUIL</Text> 
                                </View> 
                                <View style={styles.tableColHeader}> 
                                    <Text style={styles.tableCellHeader}>Banco</Text> 
                                </View> 
                                <View style={styles.tableCol1Header}> 
                                    <Text style={styles.tableCellHeader}>CBU</Text> 
                                </View> 
                            </View>

                            <View style={styles.tableRow}> 
                                <View style={styles.tableCol}> 
                                    <Text style={styles.tableCell}>{info.infoCoord.Apellido.toString() + ', ' + info.infoCoord.Nombre.toString()}</Text> 
                                </View> 
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{info.infoCoord.CUIL.split('-')[0]}-{info.infoCoord.DNI}-{info.infoCoord.CUIL.split('-')[1]}</Text> 
                                </View>
                                <View style={styles.tableCol}> 
                                    <Text style={styles.tableCell}>{info.infoCoord.EntidadBancaria.toString()}</Text> 
                                </View> 
                                <View style={styles.tableCol1}> 
                                    <Text style={styles.tableCell}>{info.infoCoord.CBU.toString()}</Text> 
                                </View> 
                            </View> 
                        </View>

                        <View style={styles.subtitle}>
                            <Text>Datos del periodo</Text> 
                        </View>

                        <View style={styles.table}>
                                
                            <View style={styles.tableRow}> 
                                <View style={styles.tableCol1Header}> 
                                    <Text style={styles.tableCellHeader}>Acompañante Gerontológico Domiciliario</Text> 
                                </View> 
                                <View style={styles.tableColHeader}> 
                                    <Text style={styles.tableCellHeader}>Valor/Hora</Text> 
                                </View> 
                                <View style={styles.tableColHeader}> 
                                    <Text style={styles.tableCellHeader}>Horas del periodo</Text> 
                                </View> 
                                <View style={styles.tableColHeader}> 
                                    <Text style={styles.tableCellHeader}>Total/es</Text> 
                                </View> 
                            </View>

                            {info.infoPorAcomp.map((a) => {
                                return(
                                    <View style={styles.tableRow}> 
                                        <View style={styles.tableCol1}> 
                                            <Text style={styles.tableCell}>{a.info.Apellido.toString() + ', ' + a.info.Nombre.toString()}</Text> 
                                        </View> 
                                        <View style={styles.tableCol}> 
                                            <Text style={styles.tableCell}>{'$ ' + a.valorHora.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text> 
                                        </View> 
                                        <View style={styles.tableCol}>
                                            <Text style={styles.tableCell}>{a.horasTotales.toString()}</Text> 
                                        </View>
                                        <View style={styles.tableCol}> 
                                            <Text style={styles.tableCell}>{'$ ' + a.valorFinal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text> 
                                        </View> 
                                    </View> 
                                            
                                )
                            })}

                            <View style={styles.tableRow}> 
                                <View style={styles.tableColHeader2}> 
                                    <Text style={styles.tableCellHeader}>Coordinador Domiciliario</Text> 
                                </View> 
                                <View style={styles.tableColHeader}> 
                                    <Text style={styles.tableCellHeader}>Total</Text> 
                                </View> 
                            </View> 

                            <View style={styles.tableRow}> 
                                <View style={styles.tableCol2}> 
                                    <Text style={styles.tableCell}>{info.infoCoord.Apellido.toString() + ', ' + info.infoCoord.Nombre.toString()}</Text> 
                                </View> 
                                <View style={styles.tableCol}> 
                                    <Text style={styles.tableCell}>{'$ ' + info.infoCoord.ValorMes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text> 
                                </View> 
                            </View> 

                            <View style={styles.tableRow}> 
                                <View style={styles.tableColHeader2}> 
                                    <Text style={styles.tableCellHeader}>TOTAL LIQUIDACIÓN</Text> 
                                </View> 
                                <View style={styles.tableColHeader}> 
                                    <Text style={styles.tableCellHeader}>$ {totalLiq.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text> 
                                </View> 
                            </View> 

                        </View>
                        <View style={styles.footer}>
                            
                            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                <Image src={MailIcon} style={{width: '14px', marginRight: 4}}/>
                                <Text>
                                    grupoazul.ucd@gmail.com
                                </Text>
                            </View>

                            <Image src={FooterLogo} style={{width: 190, alignSelf: 'center'}} cache />

                            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                <Image src={PhoneIcon} style={{width: '14px', marginRight: 4}}/>
                                <Text>
                                    3425112516 / 3425294423
                                </Text>
                            </View>

                        </View>

                    </Page>
                </Document>
            </PDFViewer>
        </div>

    )
}

export default LiqPreview