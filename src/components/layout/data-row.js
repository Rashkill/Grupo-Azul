import React from 'react'

const DataRow = props => {
    return(
        <div className="data-row">
            <div className="data-col">
                <p className="data-attr">{props.title}</p>
            </div>
            <div className="data-col">
                <p className="card-subtitle">{props.value}</p>
            </div>
        </div>
    )
}

export default DataRow