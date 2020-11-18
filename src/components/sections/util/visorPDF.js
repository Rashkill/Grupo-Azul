import React from 'react'
import { Document, Page, pdfjs } from 'react-pdf';
import { Modal, Button, Divider } from 'antd';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
class VisorPDF extends React.Component{

    state = {
        numPages: 0,
        actualPage: 1,
    }

    render(){
        return(
            <div>
                <Modal
                    title="Visor PDF"
                    visible={this.props.visible}
                    cancelText="Cerrar"
                    onCancel={()=>{this.props.onCancel(); this.setState({actualPage: 1})}}
                    onOk={() => {
                        let link = document.createElement("a");
                        link.download = `${this.props.fileName}`;
                        link.href = this.props.fileURL;
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
                            file={this.props.fileURL}
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
            </div>
        )
    }
}

export default VisorPDF