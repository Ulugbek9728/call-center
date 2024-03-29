import React from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'



function Statistika(props) {
    const options = {
        chart: {
            type: 'pie'
        },
        title:  {
            text: 'Browser market shares. January, 2022',
            align: 'left'
        },
        subtitle: {
            text: 'Click the slices to view versions. Source:',
            align: 'left'
        },


        plotOptions: {
            series: {
                borderRadius: 8,
                dataLabels: [{
                    enabled: true,
                    distance: 30,
                }, {
                    enabled: true,
                    distance: '-30%',
                    format: '{point.y:.1f}%',
                    style: {
                        fontSize: '0.9em',
                        textOutline: 'none'
                    }
                }]
            }
        },

        series: [
            {
                name: 'Foiz',
                data: [
                    {
                        name: 'Vaqtida javob berilgan murojatlar',
                        y: 60.4,
                        color:'#3be08e'
                    },
                    {
                        name: "Vaqtida javob berilmagan murojatlar",
                        y: 15,
                        color:'#f46161'

                    },
                    {
                        name: "Boshqa bo'limga yuborilgan murojatlar",
                        y: 25,
                        color:'#eab021'
                    },
                ]
            }
        ],
    }

    return (
        <div>

            <HighchartsReact
                highcharts={Highcharts}
                options={options}
            />

        </div>
    );
}

export default Statistika;