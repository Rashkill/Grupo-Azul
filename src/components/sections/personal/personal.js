import React from 'react'
import { Tabs } from 'antd'
import Acompañantes from './acompañantes.js'
import Coordinadores from './coordinadores.js'

const { TabPane } = Tabs;
const TabStyles = {
    background: 'white', 
    marginTop: -16, 
    borderLeft: '1px solid #f0f0f0', 
    borderRight: '1px solid #f0f0f0', 
    borderBottom: '1px solid #f0f0f0',
}

class Personal extends React.Component{

    render() {
        return(
            <Tabs type="card">
                <TabPane tab="Acompañantes" key="1" style={TabStyles}>
                    <Acompañantes/>
                </TabPane>
                <TabPane tab="Coordinadores" key="2" style={TabStyles}>
                    <Coordinadores/>
                </TabPane>
            </Tabs>
        )

    }
}

export default Personal