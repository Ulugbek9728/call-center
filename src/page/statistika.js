import React, {useEffect, useState} from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import domtoimage from 'dom-to-image-more';
import {FileJpgOutlined} from '@ant-design/icons';

import axios from "axios";
import {ApiName} from "../APIname";



function Statistika(props) {
    const [fulInfo] = useState(JSON.parse(localStorage.getItem("myCat")));
    const [stati, setStatistics] = useState([]);


    const options = {
        chart: {
            type: 'pie'
        },
        title:  {
            text: 'Browser market shares. January, 2022',
            align: 'center',
            marginBottom: 50
        },
        subtitle: {
            text: 'Click the slices to view versions. Source:',
            align: 'center',

        },

        plotOptions: {
            series: {
                borderRadius: 8,
                dataLabels: [{
                    enabled: true,
                    distance: 30,
                    style: {
                        fontSize: '0.9em',
                        textOutline: 'none'
                    }
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
                colorByPoint: true,
                data: [
                    {
                        name: "Javob berilmagan murojatlar",
                        y: stati?.committed?.percent,
                        color:'#2791cb'
                    },
                    {
                        name: "Vaqtida javob berilmagan murojatlar",
                        y: stati?.notInTimeFinished?.percent,
                        color:'#f46161'

                    },
                    {
                        name: 'Vaqtida javob berilgan murojatlar',
                        y: stati?.inTimeAnswer?.percent,
                        color:'#3be08e',
                    },

                    {
                        name: "Boshqa bo'limga yuborilganlekin",
                        y: stati?.progress?.percent,
                        color:'#eab021'
                    },

                ]
            }
        ],
    }


    useEffect(() => {
        StatisticsGet()
    }, []);

    function StatisticsGet() {
        axios.get(`${ApiName}/api/application/statistics-progress`, {
            headers: {"Authorization": `Bearer ${fulInfo?.accessToken}`}}
            ).then((response) => {
            setStatistics(response.data.data);
            console.log(response.data.data)
        }).catch((error) => {
            console.log(error)
        });
    }

    function download(){
        var node = document.getElementById('img');

        domtoimage
            .toJpeg(node, { quality: 0.95 })
            .then(function (dataUrl) {
                var link = document.createElement('a');
                link.download = 'my-image-name.jpeg';
                link.href = dataUrl;
                link.click();
            });
    }

    return (
        <div>
            <div id='img'>
                <HighchartsReact
                                 highcharts={Highcharts}
                                 options={options}
                />
            </div>


            <button className='btn btn-success' onClick={download} id='btnID'>Yuklab olish <FileJpgOutlined /></button>

        </div>
    );
}

export default Statistika;