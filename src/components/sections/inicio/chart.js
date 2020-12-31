import React from 'react'
import { Doughnut, defaults } from 'react-chartjs-2'

defaults.global.legend.position = 'right'
// const green = 'rgba(82, 196, 26)'
// const red = 'rgba(255, 84, 113)'
const green = 'rgba(87, 224, 196)'
const red = 'rgba(255, 132, 152)'

const Chart = (props) => {
    
    return (
        <Doughnut
            data={{
                // labels: ['Beneficiarios', 'Acompañantes', 'Coordinadores'],
                labels: ['Liquidaciones Este Mes', 'Beneficiarios'],
                datasets: [
                    {
                        label: '',
                        data: props.data,
                        borderColor: [red, green],
                        pointBorderColor: [red, green],
                        pointBackgroundColor: [red, green],
                        backgroundColor: [red, green],
                        fill: false,
                        lineTension: 0
                    }
                ]
            }}
            width={'100%'}
            height={350}
            options={{
                legend: {
                    display: true
                },
                maintainAspectRatio: false,
                scales: {
                    xAxes: [{
                        display: false,
                        gridLines: {
                            offsetGridLines: true,
                            color: "rgba(0, 0, 0, 0.0)",
                        }
                    }],
                    yAxes: [{
                        display: false,
                        gridLines: {
                            color: "rgba(0, 0, 0, 0.0)",
                        },
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }}
        />

    )
}

export default Chart