import React from 'react';
import JornadaCard from './jornada-card'

const JornadasInfo = (props) => {
    const Refresh = () =>
    {
        props.Refresh();
    }
    //console.log(props);

    const jornadasList = props.jornadasInfo.map(jornadaInfo => {
        return (
            <JornadaCard
                title={jornadaInfo.title}
                agdID={jornadaInfo.agdID}
                agdNombre={jornadaInfo.agdNombre}
                ucdID={jornadaInfo.ucdID}
                ucdNombre={jornadaInfo.ucdNombre}
                horas={jornadaInfo.horas}
                ingreso={jornadaInfo.ingreso}
                egreso={jornadaInfo.egreso}
                id={jornadaInfo.key}
                rangeVal={jornadaInfo.rangeVal}
                key={jornadaInfo.key}
                Refresh={Refresh}
            />
        );
    });
    return (
        <div className='jornadas-list'>
            {jornadasList}
        </div>
    );
}

export default JornadasInfo