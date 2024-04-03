import React, {useEffect, useRef, useState} from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import domtoimage from 'dom-to-image-more';
import {FileJpgOutlined} from '@ant-design/icons';

import axios from "axios";
import {ApiName} from "../APIname";
import {Select, DatePicker, Form} from "antd";


function Statistika(props) {
    const [fulInfo] = useState(JSON.parse(localStorage.getItem("myCat")));
    const [form3] = Form.useForm();
    const formRef = useRef(null);

    const [stati, setStatistics] = useState({
        totalApplications: 0,
        progress: {
            percent: 0,
            count: 0
        },
        committed: {
            percent: 0,
            count: 0
        },
        notInTimeFinished: {
            percent: 0,
            count: 0
        },
        inTimeAnswer: {
            percent: 0,
            count: 0
        }
    });
    const [loading, setLoading] = useState(false);
    const [DateListe, setDateListe] = useState(['', '']);
    const [Department, setDepartment] = useState([]);
    const [RollName, setRollName] = useState('');
    const [isCome, setIscome] = useState();


    const options = {
        chart: {
            type: 'pie'
        },
        title: {
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
                        name: "Bir bo'limdan boshqa bo'limga yuborilgan murojatlar",
                        y: stati.progress.percent === 'NaN' ? 0 : stati?.progress?.percent,
                        color: '#eab021'
                    },
                    {
                        name: "Javob berilmagan murojatlar",
                        y: stati.committed.percent === 'NaN' ? 0 : stati?.committed?.percent,
                        color: '#2791cb'
                    },
                    {
                        name: "Vaqtida javob berilmagan murojatlar",
                        y: stati.notInTimeFinished.percent === 'NaN' ? 0 : stati?.notInTimeFinished?.percent,
                        color: '#f46161'

                    },
                    {
                        name: 'Vaqtida javob berilgan murojatlar',
                        y: stati.inTimeAnswer.percent === 'NaN' ? 0 : stati?.inTimeAnswer?.percent,
                        color: '#3be08e',
                    },


                ]
            }
        ],
    }

    const onChangeDate = (value, dateString) => {
        setDateListe(dateString)
    };
    useEffect(() => {
        DepartmenGet()
        if (fulInfo?.roles?.includes("ROLE_OPERATOR")) {
            setRollName(7777)
            console.log('operator')
        } else if (fulInfo?.roles?.includes("ROLE_DEPARTMENT")) {
            setRollName(fulInfo?.department?.id)
        } else if (fulInfo?.roles?.includes("ROLE_ADMIN")) {
            setRollName('')
        }
    }, [])

    function DepartmenGet() {
        axios.get(`https://api-id.tdtu.uz/api/department?structureCode=ALL`, {}).then((response) => {
            setDepartment(response.data);
        }).catch((error) => {
            console.log(error)
        });
    }

    function StatisticsGet() {
        setLoading(true)
        axios.get(`${ApiName}/api/application/statistics-progress`, {
                headers: {"Authorization": `Bearer ${fulInfo?.accessToken}`},
                params: {
                    from: DateListe[0], to: DateListe[1],
                    departmentId:RollName,
                    isCome: isCome
                },
            }
        ).then((response) => {
            setTimeout(() => {
                setLoading(false)
                setStatistics(response.data.data);
            }, 1000)
            console.log(response.data.data)
        }).catch((error) => {
            setLoading(false)
            console.log(error)
        });
    }

    function download() {
        var node = document.getElementById('img');

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
        <div>
            <Form form={form3} layout="vertical" ref={formRef} colon={false}
                  style={{
                      width: 400,
                  }}
                  onFinish={StatisticsGet}
            >
                <Form.Item label="Murojatlarni ikkita vaqt oralig'i mudatini belgilang"
                           name="MurojatYuklash">
                    <DatePicker.RangePicker style={{width: '100%',}}
                                            name="MurojatYuklash" format="YYYY-MM-DD" onChange={onChangeDate}/>
                </Form.Item>
                <Form.Item label="Murojatlarni xolatini belgilang" name="Murojatturi"
                           rules={[{
                               required: true,
                               message: 'Malumot kiritilishi shart !!!'
                           },]}>
                    <Select
                        name="Murojatturi"
                        placeholder="Yuborilgan yoki Kelgan murojatlar"
                        onChange={(e)=>setIscome(e)}
                        options={[
                            {
                                value: 'false',
                                label: 'Yuborilgan murojatlar',
                            },
                            {
                                value: 'true',
                                label: 'Kelgan murojatlar',
                            },
                        ]}
                    />
                </Form.Item>
                {
                    fulInfo?.roles?.includes("ROLE_ADMIN") ?
                        <Form.Item label="Markaz / Bo'lim / Fakultet / Kafedradagi murojatlar"
                                   name="MurojatYuboriladigan" rules={[{
                            required: true,
                            message: 'Malumot kiritilishi shart !!!'
                        },]}>
                            <Select className='w-100' showSearch name="MurojatYuboriladigan"
                                onChange={(e) => {
                                    setRollName(e)
                                }}
                                    placeholder="Markaz / Bo'lim / Fakultet / Kafedra" optionFilterProp="children"
                                    filterOption={(input, option) => (option?.label?.toLowerCase() ?? '').startsWith(input.toLowerCase())}
                                    filterSort={(optionA, optionB) =>
                                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                                    options={Department && Department.map((item, index) => ({
                                        value: item.id,
                                        label: item.name
                                    }))}
                            />
                        </Form.Item>
                        :
                        ''
                }
                <Form.Item>
                    <button className='btn btn-success p-2 d-flex align-items-center justify-content-center'
                            type="submit"
                    >Ma'lumotni chaqirish
                    </button>
                </Form.Item>

            </Form>


            {loading ? <div className="loader">
                <div className="box-1"/>
                <span>Loading.....</span>
            </div> : <div id='img' style={{backgroundColor: "white"}}>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}
                />
                <div className="pb-4">
                    <h4 className='mx-4'>Umumiy murojatlar soni {stati?.totalApplications}</h4>
                    <div className="d-flex align-items-center dootsBox">

                        <div className="doots"/>
                        <div className="text">Bir bo'limdan boshqa bo'limga yuborilgan murojatlar</div>
                        <div className="mx-4">{stati?.progress?.count}</div>
                    </div>
                    <div className="d-flex align-items-center dootsBox">
                        <div className="doots"/>
                        <div className="text">Javob berilmagan murojatlar</div>
                        <div className="mx-4">{stati?.committed?.count}</div>
                    </div>
                    <div className="d-flex align-items-center dootsBox">
                        <div className="doots"/>
                        <div className="text">Vaqtida javob berilmagan murojatlar</div>
                        <div className="mx-4">{stati?.notInTimeFinished?.count}</div>
                    </div>
                    <div className="d-flex align-items-center dootsBox">
                        <div className="doots"/>
                        <div className="text">Vaqtida javob berilgan murojatlar</div>
                        <div className="mx-4">{stati?.inTimeAnswer?.count}</div>
                    </div>
                </div>
            </div>
            }

            <button className='btn btn-success mt-3'
                    onClick={download} id='btnID'>Yuklab olish <FileJpgOutlined/></button>
        </div>
    );
}

export default Statistika;