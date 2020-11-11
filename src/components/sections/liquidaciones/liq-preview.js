import React from 'react'
import {Divider} from 'antd'
import { Page, Text, Image, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import Logo3 from '../../../images/Logo3.jpg'

const BORDER_COLOR = '#bfbfbf'
const BORDER_STYLE = 'solid'
const COL1_WIDTH = 40
const COLN_WIDTH = (100 - COL1_WIDTH) / 3

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 16,
        fontSize: 12
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    },
    subtitle: {
        width: '100%',
        marginTop: 4,
        padding: 16
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
    }
});


const LiqPreview = (props) => {
    
    const info = props.location.state
    console.log(info)

    if(!info){
        props.history.goBack();
        return(<div></div>)
    }
    else
    return (
        <div className="content-cont prot-shadow">

            <Divider orientation="left" plain>
                <h1 className="big-title">
                    Liquidación N°
                </h1>
                
            </Divider>

            <PDFViewer style={{width: '100%', height: 800}}>
                <Document>
                    <Page size="A4" style={styles.page}>
                        <Image src={Logo3} style={{height: 180, alignSelf: 'center'}} cache />
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
                                                <Text style={styles.tableCell}>{a.info.CUIL.toString()}</Text> 
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
                                    <Text style={styles.tableCell}>{info.infoCoord.CUIL.toString()}</Text> 
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
                                    <Text style={styles.tableCell}>{info.infoBenef.CUIL.toString()}</Text> 
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
                                            <Text style={styles.tableCell}>{'$ ' + a.valorHora.toString()}</Text> 
                                        </View> 
                                        <View style={styles.tableCol}>
                                            <Text style={styles.tableCell}>{a.horasTotales.toString()}</Text> 
                                        </View>
                                        <View style={styles.tableCol}> 
                                            <Text style={styles.tableCell}>{'$ ' + a.valorFinal.toString()}</Text> 
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
                                    <Text style={styles.tableCell}>{'$ ' + info.infoCoord.ValorMes.toString()}</Text> 
                                </View> 
                            </View> 

                        </View>

                    </Page>
                </Document>
            </PDFViewer>
        </div>

    )
}

export default LiqPreview