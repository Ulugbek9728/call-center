import React, {useEffect, useRef, useState} from 'react';
import {
    Input, Steps, Table, Modal, Skeleton,
    Button, message, Empty, Drawer, Form, DatePicker, Spin,
} from "antd";

import {
    CaretRightOutlined,
    ArrowRightOutlined,
    ClockCircleOutlined, PushpinOutlined, CalendarOutlined, CheckOutlined
} from "@ant-design/icons";
import axios from "axios";
import {ApiName} from "../APIname";
import {useReactToPrint} from "react-to-print";
import {toast} from "react-toastify";

const {Search} = Input;

function appStatusList(item, exchangesApp) {
    const result = exchangesApp
        ?.filter(innerItem => innerItem.exchangeType === 'ACCEPTED_VERIFICATION')
        .filter(innerItem => innerItem?.department)
        .filter(innerItem => innerItem?.department.id === item?.toDepartment?.id);

    return result.length > 0 ?
        < div>
            < CheckOutlined
                style={
                    {
                        marginRight:"13px",
                        padding: "5px",
                        borderRadius: "50%",
                        backgroundColor: "#1ca01f",
                        color: "white"}
                }
            />
            <span >{result[0].createdDate.split('T')[0]}</span>
        </div> :
        <ClockCircleOutlined
            style={{
                padding: "5px",
                borderRadius: "50%",
                backgroundColor: "#d69a33",
                color: "white"
            }}
        />
}
function GetListRector(props) {
    const formRef = useRef(null);
    const [form] = Form.useForm();


    const componentRef = useRef();
    const handlePrint = useReactToPrint({content: () => componentRef.current,});

    const [messagee, setMessage] = useState('');
    const [sucsessText, setSucsessText] = useState('');

    const [fulInfo] = useState(JSON.parse(localStorage.getItem("myCat")));
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 20,
            total: 100
        },
    });
    const [ArizaList, setArizaList] = useState([]);

    const [Open, setOpen] = useState(false);
    const [ariza, setAriza] = useState({
        fullName: '',
        applicationType: 'Ariza',
        phone: '',
        description: '',
        toDepartment: {
            id: '',
            nam: '',
            code: "",
            structureType: {
                code: "",
                name: ""
            }
        },
        files: []
    });
    const [arizaSend, setArizaSend] = useState({
        applicationId: 0,
        toDepartment: {
            id: "string",
            name: "string"
        },
        exchangeType: "BACK",
        description: "string",
        files: []

    });
    const [Datee, setDatee] = useState();
    const [ItemFileListe, setItemFileListe] = useState([]);
    const [FileDrower, setFileDrower] = useState([]);
    const [open1, setOpen1] = useState(false);
    const [SRC, setSRC] = useState({
        isCome: true
    });
    const [DateListe, setDateListe] = useState(['', '']);

    useEffect(() => {
        const options = {day: '2-digit', month: '2-digit', year: 'numeric'}
        const formattedDate = new Date(ariza?.createdDate).toLocaleDateString('en-US', options)
        setDatee(formattedDate)
    }, [Open]);

    useEffect(() => {
        arizaGetList(1, 10)
    }, [sucsessText, SRC,]);

    function arizaGetList(page, pageSize) {
        axios.get(`${ApiName}/api/application/list-of-approve-applications`, {
            headers: {"Authorization": `Bearer ${fulInfo?.accessToken}`},
            params: {
                isCome: SRC.isCome,
                departmentId: SRC.departmentId,
                status: SRC.status,
                size: pageSize,
                page: page - 1
            }
        }).then((response) => {
            setArizaList(response.data.data.content)
            setTableParams({
                ...tableParams,
                pagination: {
                    pageSize: response.data.data.size,
                    total: response.data.data.totalElements
                }
            })
        }).catch((error) => {
            console.log(error)
        });
    }

    function arizaFileList(id) {
        axios.get(`${ApiName}/api/v1/exchange-application/files-by-application`, {
            headers: {"Authorization": `Bearer ${fulInfo?.accessToken}`},
            params: {
                appId: id
            }

        }).then((response) => {
            setItemFileListe(response.data.data)
        }).catch((error) => {
            console.log(error)
        });
    }

    const columns = [
        {
            title: '№',
            width: 50,
            render: (item, record, index) => (<>{index + 1}</>)
        },
        {
            title: 'File turi',
            dataIndex: 'applicationType',
            width: 150,
        },
        Table.EXPAND_COLUMN,
        {
            title: "Bo'lim / Markaz",
            render: (item, record, index) => (<>{item.exchangesApp[0]?.department?.name}</>),
        },

        {
            title: 'Murojatchi',
            dataIndex: 'fullName',
        },
        {
            title: 'File ID raqami',
            dataIndex: 'id',
        },
        {
            title: 'Tel raqami',
            dataIndex: 'phone',
        },
        {
            title: 'Masul hodim',
            render: (item, record, index) => (<>{item.fromOperator?.fullName}</>),
        },
        {
            title: "Batafsil",
            render: (item, record, index) => (
                <button className='btn btn-outline-success' onClick={(e) => {
                    setAriza(item)
                    setArizaSend({
                        ...arizaSend,
                        applicationId: item.id
                    })
                    arizaFileList(item.id)
                    setOpen(true)
                }}>
                    Ko'rish
                </button>),
        },
    ];


    useEffect(() => {
        setMessage('')
        setSucsessText('')
        notify();
    }, [message, sucsessText,]);

    const onChange = () => {
        const departmentID = fulInfo.roles[0] === "ROLE_OPERATOR" ? 7777 : fulInfo.department.id
        axios.get(`${ApiName}/api/application/get-as-excel`, {
            headers: {"Authorization": `Bearer ${fulInfo?.accessToken}`},
            params: {
                from: DateListe[0], to: DateListe[1], departmentId: departmentID, isCome: true
            },
            responseType: 'blob'
        }).then((response) => {
            const link = document.createElement('a');
            const blob = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
            const url = URL.createObjectURL(blob);

            link.href = url;
            link.setAttribute('download', `arizalar_${DateListe[0]}_${DateListe[1]}.xlsx`);
            document.body.appendChild(link);
            link.click();
        }).catch((error) => {
            console.log(error)
        });
    };
    const onChangeDate = (value, dateString) => {
        setDateListe(dateString)
    };

    function tasdiqlash() {
        axios.put(`${ApiName}/api/application/approve/${arizaSend?.applicationId}`, '', {
            headers: {"Authorization": `Bearer ${fulInfo?.accessToken}`},
        }).then((res) => {
            console.log(res)
            setSucsessText('Murojat qabul qilindi')
            setOpen(false)
        }).catch((error) => {
            console.log(error)
        });

    }

    function notify() {
        if (sucsessText !== '') {
            toast.success(sucsessText)
        }
        if (messagee !== '') {
            toast.error(message)
        }
    }

    return (
        <div>

            <Modal className='modalAddNew' footer={null} title="File mazmuni" open={Open} onCancel={() => {
                setOpen(false);
                setAriza({
                    fullName: '',
                    applicationType: 'Ariza',
                    phone: '',
                    description: '',
                    toDepartment: {
                        id: '',
                        nam: '',
                        code: "",
                        structureType: {
                            code: "",
                            name: ""
                        }
                    },
                    files: []
                })
            }}>
                <div className="d-flex justify-content-between">
                    <div className="w-50 border p-3 d-flex position-relative">

                        <div className="ariza border shadow">
                            <div ref={componentRef} style={{fontSize: '14px', padding: '45px'}}>
                                <div className="d-flex">
                                    <div className="w-50"></div>
                                    <div className="w-50">
                                        Islom Karimov nomidagi Toshkent davlat texnika universiteti rektori akademik
                                        S.M.Turabdjanovga <span>
                                            {
                                                !ariza.nameInfo || ariza.nameInfo === "" ? '' : JSON.parse(ariza.nameInfo)?.map(i => ` ${i}`)
                                            } {ariza.fullName}
                                        </span> dan
                                    </div>
                                </div>
                                <h4 className="text-center mt-3">
                                    {ariza.applicationType}
                                </h4>
                                <div style={{textAlign: "justify"}}>
                                    {
                                        ariza.description !== '' ?
                                            <div dangerouslySetInnerHTML={{__html: ariza.description}}/>
                                            :
                                            <Skeleton/>
                                    }
                                </div>
                                <div className='date ' style={{marginTop: "30px"}}>sana: {Datee}</div>
                                <div>
                                    <b>Tel raqami:</b><br/>
                                    {ariza.phone}
                                </div>
                                <div>
                                    <b>Murojat raqami:</b> <br/>
                                    {ariza.id}
                                </div>
                            </div>
                        </div>
                        <button className="button1" type="button"
                                style={{position: "absolute", bottom: 35, right: 40}}
                                onClick={handlePrint}>
                            <span className="button__text">Yuklab olish <br/> pechat qilish</span>
                            <span className="button__icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 35"
                                                                id="bdd05811-e15d-428c-bb53-8661459f9307"
                                                                data-name="Layer 2" className="svg"><path
                                d="M17.5,22.131a1.249,1.249,0,0,1-1.25-1.25V2.187a1.25,1.25,0,0,1,2.5,0V20.881A1.25,1.25,0,0,1,17.5,22.131Z"></path><path
                                d="M17.5,22.693a3.189,3.189,0,0,1-2.262-.936L8.487,15.006a1.249,1.249,0,0,1,1.767-1.767l6.751,6.751a.7.7,0,0,0,.99,0l6.751-6.751a1.25,1.25,0,0,1,1.768,1.767l-6.752,6.751A3.191,3.191,0,0,1,17.5,22.693Z"></path><path
                                d="M31.436,34.063H3.564A3.318,3.318,0,0,1,.25,30.749V22.011a1.25,1.25,0,0,1,2.5,0v8.738a.815.815,0,0,0,.814.814H31.436a.815.815,0,0,0,.814-.814V22.011a1.25,1.25,0,1,1,2.5,0v8.738A3.318,3.318,0,0,1,31.436,34.063Z"></path></svg></span>
                        </button>
                    </div>

                    <div className="w-50 px-4">

                        <div className="border p-2 fileListe">
                            {
                                ItemFileListe === '' ? <Empty/> :
                                    ItemFileListe && ItemFileListe.map((item, index) => {
                                        return <div className="" key={index}>
                                            <div className="card-header" onClick={() => {
                                                setFileDrower(item)
                                                setOpen1(true)
                                            }}>
                                                <h6 className="mb-0 d-flex justify-content-between">
                                                    <p className='w-50 px-3'>{item.exchangeApp.department.name} </p>
                                                    <ArrowRightOutlined/>
                                                    <p className='w-50 px-3'> {item.exchangeApp.toDepartment.name}</p>

                                                </h6>
                                                <CaretRightOutlined/>
                                            </div>

                                            <div>
                                            </div>
                                        </div>
                                    })
                            }
                        </div>


                        <div className='d-flex gap-2'>
                            <button className='btn btn-primary'
                                    onClick={() => {
                                        Modal.confirm({
                                            title: 'Murojatni qabul qilish',
                                            onOk: (close) => {
                                                tasdiqlash();
                                                close();
                                            },
                                            okText: 'Tasdiqlash',
                                            maskClosable: true
                                        });
                                    }}
                            > Mas'ulga yo'naltirish
                            </button>
                        </div>

                    </div>

                </div>
            </Modal>

            <Drawer
                size={'large'}
                title={`"${FileDrower?.exchangeApp?.department?.name}" dan kelgan ma'lumotlar`}
                placement="right"
                onClose={() => setOpen1(false)}
                open={open1}
            >
                <h6> Fayillar ro'yxati</h6>
                <ol>
                    {FileDrower?.files && FileDrower?.files.map((item, index) => {
                        return <li key={index}>
                            <a href={item.file.url}
                               target={"_blank"}>{item.file.filename}</a>
                        </li>
                    })}


                </ol>
                <h6>Izoh</h6>
                <div className='border p-3' dangerouslySetInnerHTML={{__html: FileDrower?.exchangeApp?.description}}/>
            </Drawer>

            <Table
                columns={columns}
                pagination={{
                    total: tableParams.pagination.total,
                    onChange: (page, pageSize) => {
                        arizaGetList(page, pageSize);
                    }
                }}
                expandable={{
                    expandedRowRender: (record) => {
                        return (
                            <div>
                                <div className='d-flex gap-3 mt-3'>
                                    <PushpinOutlined style={{
                                        padding: "5px",
                                        borderRadius: "50%",
                                        backgroundColor: "#06a3da",
                                        color: "white"
                                    }}/>
                                    <div className="d-flex gap-3">
                                        <span>{record?.exchangesApp[0]?.department?.name}</span><ArrowRightOutlined/>
                                        <span>{record?.exchangesApp[0]?.toDepartment?.name}</span>
                                    </div>
                                </div>
                                {
                                    record?.exchangesApp?.filter(item => item.exchangeType !== 'ACCEPTED_VERIFICATION').map(item => (
                                        <div className='d-flex gap-3 mt-3'>
                                            {
                                                appStatusList(item, record.exchangesApp)
                                            }
                                            <div className="d-flex gap-3">
                                                <span>{item?.department?.name}</span><ArrowRightOutlined/>
                                                <span>{item?.toDepartment?.name}</span>

                                            </div>
                                        </div>)).slice(1)
                                }


                                <div className='d-flex gap-3 mt-3'>
                                    <CalendarOutlined style={{
                                        padding: "5px",
                                        borderRadius: "50%",
                                        backgroundColor: "#06a3da",
                                        color: "white"
                                    }}/>
                                    <div className="d-flex gap-3">
                                        <span> Murojatga javob berish mudati {record?.expDate}</span>
                                        <ArrowRightOutlined/>
                                        {record.status !== "FINISHED" ?
                                            <Spin/> :
                                            <span> Murojatga javob berilgan sana {record.exchangesApp[record.exchangesApp.length - 1]?.createdDate?.split('T')[0]}</span>}
                                    </div>
                                </div>
                            </div>
                        )
                    }
                }}
                dataSource={ArizaList?.map(item => {
                    return {...item, key: item.id}
                })}
                rowClassName={(record) => {
                    return record.status
                }}
            />

            <Form form={form} layout="vertical" ref={formRef} colon={false}
                  onFinish={onChange}
            >
                <Form.Item label="Murojatlarni yuklash mudatini belgilang"
                           name="MurojatYuklash"
                           rules={[{
                               required: true,
                               message: 'Malumot kiritilishi shart !!!'
                           },]}>
                    <DatePicker.RangePicker
                        name="MurojatYuklash" format="YYYY-MM-DD" onChange={onChangeDate}/>
                </Form.Item>
                <Form.Item>
                    <button className="button1" type="submit">
                        <span className="button__text">Ma'lumotni yuklash</span>
                        <span className="button__icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 35"
                                                            id="bdd05811-e15d-428c-bb53-8661459f9307"
                                                            data-name="Layer 2" className="svg"><path
                            d="M17.5,22.131a1.249,1.249,0,0,1-1.25-1.25V2.187a1.25,1.25,0,0,1,2.5,0V20.881A1.25,1.25,0,0,1,17.5,22.131Z"></path><path
                            d="M17.5,22.693a3.189,3.189,0,0,1-2.262-.936L8.487,15.006a1.249,1.249,0,0,1,1.767-1.767l6.751,6.751a.7.7,0,0,0,.99,0l6.751-6.751a1.25,1.25,0,0,1,1.768,1.767l-6.752,6.751A3.191,3.191,0,0,1,17.5,22.693Z"></path><path
                            d="M31.436,34.063H3.564A3.318,3.318,0,0,1,.25,30.749V22.011a1.25,1.25,0,0,1,2.5,0v8.738a.815.815,0,0,0,.814.814H31.436a.815.815,0,0,0,.814-.814V22.011a1.25,1.25,0,1,1,2.5,0v8.738A3.318,3.318,0,0,1,31.436,34.063Z"></path></svg></span>
                    </button>
                </Form.Item>

            </Form>
        </div>
    )
}

export default GetListRector;