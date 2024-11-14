import React, {useEffect, useState} from 'react';
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import {FileJpgOutlined} from "@ant-design/icons";
import domtoimage from "dom-to-image-more";
import axios from "axios";
import {ApiName} from "../APIname";

function StatisticaInPlase(props) {
    const [fulInfo] = useState(JSON.parse(localStorage.getItem("myCat")));
    const [stati, setStatistics] = useState();


    const options2 = {
        chart: {
            type: 'line'
        },
        title: {
            text: "Umumiy murojatlar bo'yicha statistika"
        },

        xAxis: {
            categories: [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
                'Oct', 'Nov', 'Dec'
            ]
        },
        yAxis: {
            title: {
                text: ''
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
        series: [{
            name: "Bo'limlararo murojatlar",
            data: stati?.simple.map((item)=>(item?.count))
        }, {
            name: 'Joyida xal qilingan murojatlar',
            data: stati?.in_place.map((item)=>(item?.count))
        }]
    }
    function StatisticsGet() {
        axios.get(`${ApiName}/api/application/statistics`, {
                headers: {"Authorization": `Bearer ${fulInfo?.accessToken}`},
            }
        ).then((response) => {
            setStatistics(JSON.parse(response?.data?.data))
        }).catch((error) => {
            console.log(error)
        });
    }

    useEffect(() => {
        StatisticsGet()
    }, []);

    function download() {
        var node = document.getElementById('img2');

        domtoimage
            .toPng(node, {quality: 0.95})
            .then(function (dataUrl) {
                var link = document.createElement('a');
                link.download = 'my-image-name.png';
                link.href = dataUrl;
                link.click();
            });
    }

    return (
        <div className='mt-5' id='img2'>
            <HighchartsReact
                highcharts={Highcharts}
                options={options2}
            />
            <button className='btn btn-success mt-3'
                    onClick={download} id='btnID'>Yuklab olish <FileJpgOutlined/>
            </button>
        </div>
    );
}

export default StatisticaInPlase;