import React, {useEffect, useRef, useState} from 'react';
import {
    Input, Space, Steps, Table, Modal, Skeleton,
    Segmented, Upload, Button, message, Select, Empty, Drawer, Form, DatePicker,
} from "antd";

import {
    UploadOutlined,
    CaretRightOutlined,
    ArrowRightOutlined,
    ClockCircleOutlined
} from "@ant-design/icons";
import axios from "axios";
import {ApiName} from "../APIname";
import {useReactToPrint} from "react-to-print";
import {toast} from "react-toastify";

const {Search} = Input;


function GetList(props) {
    const formRef = useRef(null);
    const [form] = Form.useForm();
    const [form1] = Form.useForm();

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
    const [Department, setDepartment] = useState([]);
    const [ItemFileListe, setItemFileListe] = useState([]);
    const [FileDrower, setFileDrower] = useState([]);
    const [open1, setOpen1] = useState(false);
    const [SRC, setSRC] = useState({
        isCome:true
    });
    const [DateListe, setDateListe] = useState(['', '']);


    useEffect(() => {
        const options = {day: '2-digit', month: '2-digit', year: 'numeric'}
        const formattedDate = new Date(ariza?.createdDate).toLocaleDateString('en-US', options)
        setDatee(formattedDate)
    }, [Open]);

    const handleOk = () => {
        axios.post(`${ApiName}/api/v1/exchange-application`, arizaSend, {
            headers: {"Authorization": `Bearer ${fulInfo.accessToken}`}
        }).then((response) => {
            form.resetFields()
            setOpen(false);
            setSucsessText('malumotlar yuborildi')

        }).catch((error) => {
            console.log(error)
            setMessage("Ma'lumot yuborilishida xato")

        })
    };


    useEffect(() => {
        arizaGetList(1, 10)
    }, [sucsessText, SRC,]);

    useEffect(() => {
        if (arizaSend.exchangeType === "BACK") {
            if (fulInfo.department.id === ariza.toDepartment.id) {
                setArizaSend({
                    ...arizaSend,
                    toDepartment: {
                        id: ariza?.exchangesApp ? ariza?.exchangesApp[0]?.department?.id : null,
                        name: ariza?.exchangesApp ? ariza?.exchangesApp[0]?.department?.name : null,
                    }
                })
            } else {
                setArizaSend({
                    ...arizaSend,
                    toDepartment: {
                        id: ariza?.exchangesApp ? ariza?.exchangesApp[ariza?.exchangesApp?.length - 1]?.department?.id : null,
                        name: ariza?.exchangesApp ? ariza?.exchangesApp[ariza?.exchangesApp?.length - 1]?.department?.name : null,
                    }
                })
            }
        }

    }, [arizaSend.exchangeType, ariza]);

    function arizaGetList(page, pageSize) {
        axios.get(`${ApiName}/api/application`, {
            headers: {"Authorization": `Bearer ${fulInfo?.accessToken}`},
            params: {
                isCome: SRC.isCome,
                departmentId: SRC.departmentId,
                status: SRC.status,
                size: pageSize,
                page: page-1
            }
        }).then((response) => {
            setArizaList(response.data.data.content)
            setTableParams({...tableParams,
                pagination: {
                    pageSize:response.data.data.size,
                    total:response.data.data.totalElements
                }
            })
            console.log(response.data.data)
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
            title: 'FISH',
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
                    console.log(item)
                    arizaFileList(item.id)
                    setOpen(true)
                }}>
                    Ko'rish
                </button>),
        },
    ];

    const propss = {

        name: 'file',
        action: `${ApiName}/api/v1/attach/upload`,

        headers: {
            authorization: `Bearer ${fulInfo?.accessToken}`,
        },
        onChange(info) {
            if (info.file.status === 'removed') {
                const result = ariza.files.filter((idAll) => idAll.id !== info.file.response.id);
                setArizaSend({...arizaSend, files: result})

                axios.delete(`${ApiName}/api/v1/attach/${info.file.response.id}`, {
                    headers: {"Authorization": `Bearer ${fulInfo?.accessToken}`}
                }).then((res) => {
                    console.log(res)
                    message.success("File o'chirildi")
                }).catch((error) => {
                    console.log(error)
                    message.error(`${info.file.name} file delete failed.`);
                })
            }
            else if (info.file.status === 'done') {
                arizaSend.files.push({
                        fileId: info.file.response.id,
                    }
                )
                message.success(`${info.file.name} File uploaded successfully`);
            }
            else if (info.file.status === 'error') {
                message.error(`${info.file.name} File upload failed.`);
            }
        },
    };

    function DepartmenGet() {
        axios.get(`https://api-id.tdtu.uz/api/department?structureCode=ALL`, {}).then((response) => {
            setDepartment(response.data);
        }).catch((error) => {
            console.log(error)
        });
    }

    const handleChangeDepartme = (e) => {
        const result = Department.filter((word) => word.id === e);
        setArizaSend({
            ...arizaSend,
            toDepartment: {
                id: result[0].id,
                name: result[0].name,
            }
        })
    };

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

    useEffect(() => {
        DepartmenGet()
        setMessage('')
        setSucsessText('')
        notify();
    }, [message, sucsessText,]);

    const onChange = () => {
        const departmentID = fulInfo.roles[0] === "ROLE_OPERATOR" ? 7777 : fulInfo.department.id
        axios.get(`${ApiName}/api/application/get-as-excel`, {
            headers: {"Authorization": `Bearer ${fulInfo?.accessToken}`},
            params: {
                from: DateListe[0], to: DateListe[1], departmentId: departmentID,isCome: true
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
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Space>
                    <Select style={{width:400}}
                        // showSearch
                            name="MurojatYuboriladigan"
                            onChange={(e) => {setSRC({...SRC, departmentId: e})}}
                            placeholder="Markaz / Bo'lim / Fakultet / Kafedra"
                            optionFilterProp="children"
                            filterOption={(input, option) => (option?.label?.toLowerCase() ?? '').startsWith(input.toLowerCase())}
                            filterSort={(optionA, optionB) =>
                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                            options={
                                Department && Department.map((item, index) => (
                                {
                                    value: item.id,
                                    label: item.name
                                }))}
                    />
                    {
                        fulInfo?.roles?.includes("ROLE_ADMIN") ? <Select
                            placeholder='Yuborilgna murojat / Kelgan murojat'
                            style={{
                                width: 300,
                            }}
                            value={SRC.isCome}
                            onChange={(e) => {setSRC({...SRC, isCome: e})}}
                            options={[
                                {
                                    value: false,
                                    label: 'Yuborilgna murojat',
                                },
                                {
                                    value: true,
                                    label: 'Kelgan murojat',
                                },
                            ]}
                        />: ''
                    }
                    <Select
                        placeholder='Statusini tanlang'
                        style={{
                            width: 200,
                        }}
                        value={SRC.status}
                        onChange={(e) => {setSRC({...SRC, status: e})}}
                        options={[
                            {
                                value: '',
                                label: 'Hammasi',
                            },
                            {
                                value: "COMMITTED",
                                label: 'Yaratilgan',
                            },
                            {
                                value: 'PROGRESS',
                                label: 'Jarayonda',
                            },
                            {
                                value: 'FINISHED',
                                label: 'Tugatilgan',
                            },

                        ]}
                    />


                </Space>
            </div>
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
                                        Islom karimov nomidagi Toshkent davlat texnika universiteti rektori
                                        M.S.Turabdjanov ga <span>
                                            {
                                                !ariza.nameInfo || ariza.nameInfo === "" ? '' : JSON.parse(ariza.nameInfo)?.map(i => ` ${i}`)
                                            } {ariza.fullName}
                                        </span> dan
                                    </div>
                                </div>
                                <h4 className="text-center mt-3">
                                    {ariza.applicationType}
                                </h4>
                                <div style={{textAlign: "justify"}}>{ariza.description != '' ? ariza.description :
                                    <Skeleton/>}
                                </div>
                                <div className='date ' style={{marginTop: "30px"}}>sana: {Datee}</div>
                                <div>
                                    <b>Tel raqami:</b><br/>
                                    {ariza.phone}
                                </div>
                                <div>
                                    <b>Murojatch raqami:</b> <br/>
                                    {ariza.id}
                                </div>
                            </div>
                        </div>

                        <button style={{height: 50, width: 200, position: "absolute", bottom: 60, right: 40}}
                                className='btn btn-success'
                                onClick={handlePrint}>Yuklab olish / pechat
                        </button>
                    </div>

                    <div className="w-50 px-4">

                        <div className="border p-2 fileListe">
                            {
                                ItemFileListe == '' ? <Empty/> :
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

                        {fulInfo?.roles?.includes("ROLE_ADMIN") ? '' :
                            <div className="">
                                <Segmented
                                    options={[
                                        {
                                            label: "Javob berish",
                                            value: "BACK"
                                        },
                                        {
                                            label: "Boshqa bo'limga o'tkazish",
                                            value: "SEND"
                                        },
                                    ]}
                                    value={arizaSend.exchangeType}
                                    onChange={(e) => {
                                        setArizaSend({
                                            ...arizaSend,
                                            exchangeType: e
                                        })
                                    }} block/>
                                <Form
                                    form={form} layout="vertical" ref={formRef} colon={false}
                                    onFinish={handleOk}>
                                    {arizaSend.exchangeType === 'BACK' ? '' :
                                        <Form.Item
                                            label="Markaz / Bo'lim / Fakultet / Kafedra ga yuborish"
                                            name="Markaz"
                                            rules={[{
                                                required: true,
                                                message: 'Malumot kiritilishi shart !!!'
                                            },]}>
                                            <Select className='w-100' showSearch name="Markaz"
                                                    value={arizaSend.toDepartment?.name}
                                                    onChange={(e) => {
                                                        handleChangeDepartme(e)
                                                    }}
                                                    placeholder="Markaz / Bo'lim / Fakultet / Kafedra"
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) => (option?.label?.toLowerCase() ?? '').startsWith(input.toLowerCase())}
                                                    filterSort={(optionA, optionB) =>
                                                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                                    }
                                                    options={Department && Department.map((item, index) => ({
                                                        value: item.id,
                                                        label: item.name
                                                    }))}
                                            />
                                        </Form.Item>}
                                    <Form.Item
                                        label="Javob mazmuni:"
                                        name="Javob"
                                        rules={[{
                                            required: true,
                                            message: 'Malumot kiritilishi shart !!!'
                                        },]}>
                                <textarea className="form-control mt-2" rows="6" id="comment" name="Javob"
                                          onChange={(e) => {
                                              setArizaSend({...arizaSend, description: e.target.value})
                                          }}
                                />
                                    </Form.Item>
                                    <Form.Item name='file'>
                                        <Upload name='file' {...propss}>
                                            <Button icon={<UploadOutlined/>}>File yuklash</Button>
                                        </Upload>
                                    </Form.Item>
                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                        >
                                            Ma'lumotni yuborish
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </div>}


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
                <p className='border p-3'>
                    {FileDrower?.exchangeApp?.description}
                </p>
            </Drawer>

            <Table
                columns={columns}
                pagination={{

                    total:tableParams.pagination.total,
                    onChange: (page, pageSize) => {
                        arizaGetList(page, pageSize);
                    }
            }}
                expandable={{
                    expandedRowRender: (record) => {
                        return (
                            <Steps direction="vertical"
                                   current={record.status!=="FINISHED"? record?.exchangesApp?.length : record?.exchangesApp?.length+1}
                                   status="wait"
                                   items={
                                       [...record?.exchangesApp?.map(item => (
                                           {
                                               title: item?.department?.name,
                                               description: item?.toDepartment?.name
                                           }
                                       )),
                                           {
                                               title:  `Murojatga javob berish mudati ${record?.expDate}`,
                                               description:record.status!=="FINISHED"?
                                                   ''
                                                   :
                                                   `Murojatga javob berilgan sana 
                                                   ${record.exchangesApp[record.exchangesApp.length-1]?.createdDate?.split('T')[0]}`,
                                               icon:record.status!=="FINISHED"? <ClockCircleOutlined className="timeline-clock-icon" /> :'',
                                           }
                                       ]
                                   }
                            />
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

            <Form form={form1} layout="vertical" ref={formRef} colon={false}
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
                    <Button className='btn-outline-success p-4 d-flex align-items-center justify-content-center'
                            htmlType="submit" type="primary"
                    >
                        Ma'lumotni yuklash
                    </Button>
                </Form.Item>

            </Form>
        </div>
    )
}

export default GetList;