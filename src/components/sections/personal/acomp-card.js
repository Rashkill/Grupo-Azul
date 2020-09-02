import React from 'react';
import { Row, Col } from 'antd';
import UserImg from '../../../images/image3.png'
import './cards.css'

class AcompCard extends React.Component{

    render(){
        return(
            <div className="card">
                <Row>
                    <Col span={4} className="flex-center">
                        <img src={UserImg} alt=""/>
                    </Col>
                    <Col span={20}>
                        <Row>
                            <h1 className="name-title">
                                {this.props.title}
                            </h1>
                        </Row>
                    </Col>
                    <Col span={4}>

                    </Col>
                </Row>
            </div>
        )
    }
}


export default AcompCard