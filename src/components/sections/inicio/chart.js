import React from 'react'
import { Bar, defaults } from 'react-chartjs-2'

// defaults.global.legend.position = 'bottom'
// const green = 'rgba(82, 196, 26)'
// const red = 'rgba(255, 84, 113)'
const green = 'rgba(87, 224, 196)'
const red = 'rgba(255, 132, 152)'

const Chart = (props) => {
    
    return (
        <Bar
            data={{
                // labels: ['Beneficiarios', 'Acompañantes', 'Coordinadores'],
                labels: ['Liquidaciones Mes Actual', 'Beneficiarios'],
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
            width={200}
            height={400}
            options={{
                legend: {
                    display: false
                },
                maintainAspectRatio: false,
                scales: {
                    xAxes: [{
                        gridLines: {
                            offsetGridLines: true,
                            color: "rgba(0, 0, 0, 0.0)",
                        }
                    }],
                    yAxes: [{
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