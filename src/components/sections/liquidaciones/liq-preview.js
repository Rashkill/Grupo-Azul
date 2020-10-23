import React from 'react'
import {Divider} from 'antd'
import { Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#E4E4E4'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    }
});


const LiqPreview = (props) => {
    
    const info = props.location.state
    console.log(info)

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
                        {info.infoPorAcomp.map((a) => {
                            return(
                                <Text>{a.info.Apellido.toString()}</Text>
                            )
                        })}
                    </Page>
                </Document>
            </PDFViewer>
        </div>

    )
}

export default LiqPreview