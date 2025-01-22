import React, {useEffect, useRef, useState} from 'react';
import {
    Input, Space, Spin, Table, Modal, Skeleton, Tag, Segmented, Upload, Button, message, Select, Empty,
    Drawer, Form, DatePicker,
} from "antd";

import {
    UploadOutlined, CaretRightOutlined, ArrowRightOutlined, CalendarOutlined, CheckOutlined, PushpinOutlined,
    CloseOutlined, ClockCircleOutlined
} from "@ant-design/icons";
import axios from "axios";
import {ApiName} from "../APIname";
import {useReactToPrint} from "react-to-print";
import {toast} from "react-toastify";

const {Search} = Input;


function appStatusList(item, exchangesApp) {
    const result = exchangesApp
        ?.filter(innerItem => innerItem.exchangeType === 'ACCEPTED_VERIFICATION'||'BACK')
        .filter(innerItem => innerItem?.department)
        .filter(innerItem => innerItem?.department.id === item?.toDepartment?.id);
    return result.length > 0 ?
        < div >
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

function appStatusList2(item, exchangesApp) {
    const result = exchangesApp
        ?.filter(innerItem => innerItem.exchangeType === 'ACCEPTED_VERIFICATION'|| innerItem.exchangeType === 'BACK')
        .filter(innerItem => innerItem?.department)
        .filter(innerItem => innerItem?.department.id === item?.toDepartment?.id);

    return result.length > 0 ?
        < div>
           <span>{result[0].department?.name}: {result[0]?.from?.shortName}</span>
            <span > {result[0].createdDate.split('T')[0]}</span>
        </div> :
        <span>{item.toDepartment?.name}</span>

}

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
        isCome: true
    });
    const [DateListe, setDateListe] = useState(['', '']);
    console.log(fulInfo)
    useEffect(() => {
        const options = {day: '2-digit', month: '2-digit', year: 'numeric'}
        const formattedDate = new Date(ariza?.createdDate).toLocaleDateString('en-US', options)
        setDatee(formattedDate)
    }, [Open]);

    const handleOk = () => {
        axios.post(`${ApiName}/api/v1/exchange-application`, {
            ...arizaSend,
            exchangeType: ariza?.toDepartment?.id !== fulInfo?.department?.id ? "ACCEPTED_VERIFICATION" : arizaSend.exchangeType
        }, {
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
            if (fulInfo?.department?.id === ariza?.toDepartment?.id) {
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

    const columns = [
        {
            title: '№',
            width: 50,
            render: (item, record, index) => (<>{index + 1}</>)
        },
        {
            title: 'Murojat turi',
            dataIndex: 'applicationType',
            width: 150,
        },

        Table.EXPAND_COLUMN,
        {
            title: "Bo'lim / Markaz",
            render: (item, record, index) => (<>{item.exchangesApp[0]?.department?.name}</>),
        },
        {
            title: 'Murojat tasdiqlanganligi',
            render: (item) => (
                item.isApproved ? <CheckOutlined style={{fontSize: "20px"}}/> :
                    <CloseOutlined style={{fontSize: "20px"}}/>
            )
        },
        {
            title: 'Murojat raqami',
            dataIndex: 'id',
        },
        {
            title: 'Murojatchi',
            dataIndex: 'fullName',
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
            } else if (info.file.status === 'done') {
                arizaSend.files.push({
                        fileId: info.file.response.id,
                    }
                )
                message.success(`${info.file.name} File uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} File upload failed.`);
            }
        },
    };

    function DepartmenGet() {
        axios.get(`${ApiName}/api/department?structureCode=ALL`, {}).then((response) => {
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
                    <Select style={{width: 400}}
                            showSearch
                            name="MurojatYuboriladigan"
                            onChange={(e) => {
                                setSRC({...SRC, departmentId: e})
                            }}
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
                        fulInfo?.currentRole !== "ROLE_DEPARTMENT" ?
                            <Select
                                placeholder='Yuborilgna murojat / Kelgan murojat'
                                style={{
                                    width: 300,
                                }} value={SRC.isCome}
                                onChange={(e) => {
                                    setSRC({...SRC, isCome: e})
                                }}
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
                            /> : ''
                    }
                    <Select
                        placeholder='Statusini tanlang'
                        style={{
                            width: 200,
                        }} value={SRC.status}
                        onChange={(e) => {
                            setSRC({...SRC, status: e})
                        }}
                        options={[
                            {
                                value: '',
                                label: 'Hamma murojatlar',
                            },
                            {
                                value: "WAIT_FOR_VERIFICATION",
                                label: 'Yangi murojatlar',
                            },
                            {
                                value: 'PROGRESS',
                                label: 'Jarayondagi murojalar',
                            },
                            {
                                value: 'FINISHED',
                                label: 'Tugatilgan murojatlar',
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
                                    <div style={{rotate: "-45deg"}}
                                         className="w-50 d-flex align-items-center justify-content-center">
                                        {ariza?.approveData ?
                                            <i>S.M.Turabdjanov <br/> {ariza?.approveData?.approveData.slice(0, 10)}
                                            </i> : ""}
                                    </div>
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
                                {
                                    ariza.description !== '' ?
                                        <div dangerouslySetInnerHTML={{__html: ariza.description}}/>
                                        :
                                        <Skeleton/>
                                }
                                <div className='date ' style={{marginTop: "30px"}}>sana: {Datee}</div>
                                <div>
                                    <b>Tel raqami:</b><br/>
                                    {ariza.phone}
                                </div>
                                <div>
                                    <b>Murojat raqami:</b> <br/>
                                    {ariza.id}
                                </div>
                                <div className="mt-3">
                                    <b>Murojatni tasdiqlovchi bo'limlar:</b>
                                    <ol className="">
                                        {
                                            ariza?.exchangesApp?.filter(item => item.exchangeType !== 'ACCEPTED_VERIFICATION').map(item => (

                                                 <li className="">{
                                                     appStatusList2(item, ariza.exchangesApp)
                                                 }</li>
                                            )).slice(1)
                                        }

                                    </ol>
                                </div>
                                <div className="mt-3">
                                    <b>Murojatni yakunlovchi bo'lim:</b>
                                    <ol className="">
                                        {
                                            <li className="">{ariza?.toDepartment?.name}</li>
                                        }

                                    </ol>
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

                        {fulInfo?.currentRole === "ROLE_DEPARTMENT" ?
                            <div className="">
                                <Segmented
                                    options={[
                                        {
                                            label: "Javob berish",
                                            value: "BACK"
                                        },
                                        {
                                            label: "Boshqa bo'limga o'tkazish",
                                            value: "SEND",
                                            disabled:true
                                                // ariza?.toDepartment?.id !== fulInfo?.department?.id
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
                                        <button className='button2' type='submit'>
                                            <div className="svg-wrapper-1">
                                                <div className="svg-wrapper">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        width="24"
                                                        height="24"
                                                    >
                                                        <path fill="none" d="M0 0h24v24H0z"></path>
                                                        <path
                                                            fill="currentColor"
                                                            d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                                                        ></path>
                                                    </svg>
                                                </div>
                                            </div>
                                            <span>Ma'lumotni yuborish</span>
                                        </button>
                                    </Form.Item>
                                </Form>
                            </div> : ''}
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
                                    record?.exchangesApp?.filter(item => ['BACK','SEND','FOR_VERIFICATION'].includes(item.exchangeType)).map(item => (
                                        <div className='d-flex gap-3 mt-3' key={item.id}>
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
                    return fulInfo?.currentRole ==="ROLE_ADMIN"? record.status :
                    record.exchangesApp.filter(item => item.exchangeType === 'ACCEPTED_VERIFICATION').length > 0 ? 'FINISHED' : ''
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

export default GetList;