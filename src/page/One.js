import React, {useEffect, useState, useRef} from 'react';
import {useReactToPrint} from 'react-to-print';
import {
    Space, Table, Select, Modal, Upload, Button, Steps, Skeleton,
    message, Empty, Drawer, Form, DatePicker, Popconfirm, Input,
} from 'antd';
import {
    UploadOutlined, ClockCircleOutlined, CaretRightOutlined,
    EyeOutlined, CheckOutlined, CloseOutlined, ArrowRightOutlined,
} from '@ant-design/icons';
import {ApiName} from "../APIname";
import axios from "axios";
import {toast} from "react-toastify";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import OtpInput from 'react-otp-input';
import {Editor} from '@tinymce/tinymce-react';


dayjs.extend(customParseFormat);

function One(props) {
    const formRef = useRef(null);
    const [form] = Form.useForm();
    const [form1] = Form.useForm();
    const [form2] = Form.useForm();
    const componentRef = useRef();
    const handlePrint = useReactToPrint({content: () => componentRef.current,});

    const [messagee, setMessage] = useState('');
    const [sucsessText, setSucsessText] = useState('');

    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 20,
            total: 100
        },
    });
    const [Department, setDepartment] = useState([]);
    const [fulInfo] = useState(JSON.parse(localStorage.getItem("myCat")));

    const [open, setOpen] = useState(false);
    const [batafsil, setBatafsil] = useState(false);
    const [edite, setEdite] = useState(false);

    const [ariza, setAriza] = useState({
        fullName: '',
        nameInfo:fulInfo?.currentRole==="ROLE_DEPARTMENT"? `["${fulInfo?.department?.name}"]`: '[]',
        applicationType: 'Ariza',
        phone: '',
        expDate: null,
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
    const [ArizaList, setArizaList] = useState([]);
    const [Datee, setDatee] = useState();
    const [ItemFileListe, setItemFileListe] = useState([]);
    const [FileDrower, setFileDrower] = useState([]);
    const [SRC, setSRC] = useState({
        isCome: false,
    });
    const [open1, setOpen1] = useState(false);
    const [DateListe, setDateListe] = useState(['', '']);
    const [verificatio, setVerificatio] = useState(false);
    const [verifiResponse, setverifiResponse] = useState({});
    const [otp, setOtp] = useState('');

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

    const handleChangeDepartme = (e) => {
        const result = Department.filter((word) => word.id === e);
        setAriza({...ariza, toDepartment: result[0]})
    };

    useEffect(() => {
        if (fulInfo?.currentRole?.includes('ROLE_DEPARTMENT')) {
            setAriza({...ariza, fullName: fulInfo.fullName})
        }
        DepartmenGet()
        arizaGetList(1, 20)
    }, [sucsessText, SRC]);

    function DepartmenGet() {
        axios.get(`https://api-id.tdtu.uz/api/department?structureCode=ALL`, {}).then((response) => {
            setDepartment(response.data);
        }).catch((error) => {
            console.log(error)
        });
    }

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

    const handleOk = () => {
        if (batafsil === true) {
            setTimeout(() => {
                setOpen(false);
                setBatafsil(false)
            }, 1000)
        } else {
            if (edite === true) {
                axios.put(`${ApiName}/api/application/${ariza?.id}`, ariza, {
                    headers: {"Authorization": `Bearer ${fulInfo.accessToken}`}
                }).then((response) => {
                    console.log(response)
                    form.resetFields()
                    setOpen(false);
                    setSucsessText("Murojat o'zgardi")
                    setAriza({
                        fullName: '',
                        applicationType: 'Ariza',
                        phone: '',
                        expDate: '',
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
                    setEdite(false)
                    if (response?.data?.isSuccess === true) {
                        setSucsessText("Murojat o'zgardi")
                    } else {
                        setMessage(response?.data?.message)
                    }
                }).catch((error) => {
                    console.log(error)
                    setMessage(error?.response?.data?.message)
                })
            } else {
                axios.post(`${ApiName}/api/application`, ariza, {
                    headers: {"Authorization": `Bearer ${fulInfo.accessToken}`}
                }).then((response) => {
                    if (response.data.message === "Success") {
                        setVerificatio(true)
                        toast.warning("Tasdiqlash kodini kiriting")
                        console.log(response?.data?.data)
                        setverifiResponse(response?.data?.data)
                        form.resetFields()
                        // setOpen(false);
                        setAriza({
                            fullName: '',
                            applicationType: 'Ariza',
                            phone: '',
                            expDate: '',
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
                    }
                }).catch((error) => {
                    setMessage('Error')
                })
            }
        }
    };

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
            render: (item, record, index) => (<>{item.toDepartment?.name}</>),
        },
        {
            title: 'Murojat tasdiqlanganligi',
            render: (item) => (
                item.isApproved ? <CheckOutlined style={{fontSize: "20px"}}/> :
                    <CloseOutlined style={{fontSize: "20px"}}/>
            )
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
            title: " ",
            render: (item, record, index) => (
                <div className='d-flex justify-content-between' style={{width: 150}}>
                    <button className='btn btn-success' onClick={(e) => {
                        arizaFileList(item.id)
                        setAriza(item)
                        setBatafsil(true)
                        setOpen(true)
                    }}><EyeOutlined/></button>

                    <button className="editBtn"
                            onClick={(e) => {
                                setAriza({
                                    id: item.id,
                                    fullName: item.fullName,
                                    nameInfo: item.nameInfo,
                                    applicationType: item.applicationType,
                                    phone: item.phone,
                                    expDate: item.expDate,
                                    description: item.description,
                                    toDepartment: item.toDepartment,
                                });
                                console.log(item)
                                setOpen(true);
                                setEdite(true)
                            }}>
                        <svg height="1em" viewBox="0 0 512 512">
                            <path
                                d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"
                            ></path>
                        </svg>
                    </button>

                    <Popconfirm
                        title="Murojatni o'chirish"
                        description="Murojatni o'chirishni tasdiqlaysizmi?"
                        onConfirm={(e) => Delete(item.id)}
                        okText="Ha" cancelText="Yo'q"
                    >
                        <button className="delet">
                            <svg
                                className="bin-top"
                                viewBox="0 0 39 7"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <line y1="5" x2="39" y2="5" stroke="white" strokeWidth="4"></line>
                                <line
                                    x1="12"
                                    y1="1.5"
                                    x2="26.0357"
                                    y2="1.5"
                                    stroke="white"
                                    strokeWidth="3"
                                ></line>
                            </svg>
                            <svg
                                className="bin-bottom"
                                viewBox="0 0 33 39"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <mask id="path-1-inside-1_8_19" fill="white">
                                    <path
                                        d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"
                                    ></path>
                                </mask>
                                <path
                                    d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
                                    fill="white"
                                    mask="url(#path-1-inside-1_8_19)"
                                ></path>
                                <path d="M12 6L12 29" stroke="white" strokeWidth="4"></path>
                                <path d="M21 6V29" stroke="white" strokeWidth="4"></path>
                            </svg>
                        </button>

                        {/*<button className='btn btn-danger'><DeleteOutlined/></button>*/}
                    </Popconfirm>
                </div>
            )
        },
    ];

    const propsss = {
        name: 'file',
        action: `${ApiName}/api/v1/attach/upload`,
        headers: {
            authorization: `Bearer ${fulInfo?.accessToken}`,
        },

        onChange(info) {
            if (info?.file?.status === 'removed') {
                const result = ariza?.files?.filter((idAll) => idAll?.id !== info?.file?.response?.id);
                setAriza({...ariza, files: result})
                axios.delete(`${ApiName}/api/v1/attach/${info?.file?.response?.id}`, {
                    headers: {"Authorization": `Bearer ${fulInfo?.accessToken}`}
                }).then((res) => {
                    message.success("File o'chirildi")
                }).catch((error) => {
                    message.error(`${info.file.name} file delete failed.`);
                })
            } else if (info?.file?.status === "done") {
                ariza?.files.push({
                        fileId: info?.file?.response?.id,
                    }
                )
                message.success(`${info?.file?.name} File uploaded successfully`);
            } else if (info?.file?.status === 'error') {
                message.error(`${info?.file?.name} File upload failed.`);
            }
        },

    };

    useEffect(() => {
        const date = new Date();
        const options = {day: '2-digit', month: '2-digit', year: 'numeric'};
        if (batafsil || edite === true) {
            const formattedDate = new Date(ariza?.createdDate).toLocaleDateString('en-US', options);
            setDatee(formattedDate)
        } else {
            const formattedDate = date.toLocaleDateString('en-US', options);
            setDatee(formattedDate)
        }

    }, [batafsil, edite]);

    useEffect(() => {
        notify();
        setMessage('')
        setSucsessText('')
    }, [messagee, sucsessText,]);

    function notify() {
        if (sucsessText !== '') {
            toast.success(sucsessText)
        }
        if (messagee !== '') {
            toast.error(messagee)
        }
    }

    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current < dayjs().endOf('day');
    };

    const onChangeDate2 = (value, dateString) => {
        setAriza({...ariza, expDate: dateString})
    };

    const onChange = () => {
        const departmentID = fulInfo.roles[0] === "ROLE_OPERATOR" ? 7777 : fulInfo.department.id
        axios.get(`${ApiName}/api/application/get-as-excel`, {
            headers: {"Authorization": `Bearer ${fulInfo?.accessToken}`},
            params: {
                from: DateListe[0], to: DateListe[1], departmentId: departmentID, isCome: false
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

    const Delete = (e) => {
        axios.delete(`${ApiName}/api/application/${e}`, {
            headers: {"Authorization": `Bearer ${fulInfo.accessToken}`}
        }).then((res) => {
            console.log(res)
            if (res.data.isSuccess === true) {
                setSucsessText("Murojat o'chirildi")
            } else setMessage(res.data.message)
        }).catch((error) => {
            console.log(error)
            setMessage("O'chirishda xatolik")
        })
    };

    const verificationPost = () => {
        if (otp.length === 6) {
            console.log(verifiResponse)
            axios.post(`${ApiName}/api/application/verify-otp`, {
                phone: verifiResponse?.phone,
                code: otp,
                applicationId: verifiResponse?.id
            }, {
                headers: {"Authorization": `Bearer ${fulInfo.accessToken}`}
            }).then((response) => {
                console.log(response)
                if (response?.data?.isSuccess === true) {
                    setVerificatio(false)
                    form2.resetFields()
                    setOpen(false);
                    setOtp('')
                    setSucsessText("Murojaat tasdiqlandi")
                } else {
                    setMessage(response?.data?.message)
                    setOtp('')
                }
            }).catch((error) => {
                setMessage('Error')
            })
        } else {
            toast.warning("Tasdiqlash kodini to'liq kiriting")
        }
    }
    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Space>
                    <Select style={{width: 400}}
                            name="MurojatYuboriladigan"
                            onChange={(e) => {
                                setSRC({...SRC, departmentId: e})
                            }}
                            placeholder="Markaz / Bo'lim / Fakultet / Kafedra"
                            optionFilterProp="children"
                            filterOption={(input, option) => (option?.label?.toLowerCase() ?? '').startsWith(input.toLowerCase())}
                            filterSort={(optionA, optionB) =>
                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                            options={Department && Department.map((item, index) => (
                                {
                                    value: item.id,
                                    label: item.name
                                }))}
                    />
                    <Select
                        placeholder='Statusini tanlang'
                        style={{
                            width: 200,
                        }}
                        onChange={(e) => {
                            setSRC({...SRC, status: e})
                        }}
                        options={[
                            {
                                value: '',
                                label: 'Hammasi',
                            },
                            {
                                value: 'PROGRESS',
                                label: 'Jarayonda',
                            },
                            {
                                value: 'FINISHED',
                                label: 'Tugatilgan',
                            },
                            {
                                value: "COMMITTED",
                                label: 'Yaratilgan',
                            },
                        ]}
                    />
                </Space>
                <div className="d-flex">
                    <button type="button" className="button1" onClick={() => {
                        setOpen(true)
                    }}>
                        <span className="button__text">Murojatni yaratish</span>
                        <span className="button__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" strokeWidth="2"
                             strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" height="24"
                             fill="none" className="svg">
                            <line y2="19" y1="5" x2="12" x1="12"/>
                            <line y2="12" y1="12" x2="19" x1="5"/>
                        </svg>
                    </span>
                    </button>
                </div>
            </div>
            <Modal className='modalAddNew'
                   title={batafsil ? "Murojat" : "Murojat yaratish"} open={open} footer={null}
                   onCancel={() => {
                       setOpen(false);
                       setVerificatio(false)
                       setBatafsil(false)
                       setEdite(false)
                       setAriza({
                           fullName: '',
                           nameInfo: fulInfo?.currentRole==="ROLE_DEPARTMENT"? `["${fulInfo?.department?.name}"]`: '[]',
                           applicationType: 'Ariza',
                           phone: '',
                           expDate: '',
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
                {
                    !verificatio ? <div className='d-flex justify-content-between'>
                            {batafsil ? "" : <div className={`border w-50 p-3 mx-3`}>
                                <Form
                                    form={form} layout="vertical" ref={formRef} colon={false}
                                    onFinish={handleOk}
                                    fields={[
                                        {
                                            name: "MurojatchiniBo'limi",
                                            value: !ariza.nameInfo || ariza.nameInfo === "" ? [] : JSON.parse(ariza.nameInfo)?.map(i => ` ${i}`)
                                        },
                                        {
                                            name: "FISH",
                                            value: ariza?.fullName
                                        },
                                        {
                                            name: "Tel",
                                            value: ariza?.phone
                                        },
                                        {
                                            name: "MurojatYuboriladigan",
                                            value: ariza?.toDepartment?.name
                                        },
                                        {
                                            name: "xujjat",
                                            value: ariza?.applicationType
                                        },
                                        {
                                            name: "text",
                                            value: ariza?.description || ''
                                        },
                                        {
                                            name: "MurojatchiniDate",
                                            value: edite || ariza.expDate ? dayjs(new Date(ariza.expDate)) : ariza.expDate
                                        },
                                    ]}
                                >
                                    <Form.Item
                                        label="Murojat mudatini belgilang"
                                        name="MurojatchiniDate"
                                        rules={[{
                                            required: true,
                                            message: 'Malumot kiritilishi shart !!!'
                                        },]}>
                                        <DatePicker
                                            name="MurojatchiniDate"
                                            format="YYYY-MM-DD"
                                            style={{width: '100%'}}
                                            disabledDate={disabledDate}
                                            onChange={onChangeDate2}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="Murojatchini Kafedra, Bo'lim, Markaz / Fakultet, Guruh"
                                        name="MurojatchiniBo'limi"
                                        rules={[{
                                            required: true,
                                            message: 'Malumot kiritilishi shart !!!'
                                        },]}>
                                        <Select
                                            name="MurojatchiniBo'limi" mode="tags"
                                            disabled={fulInfo?.currentRole === "ROLE_DEPARTMENT"}
                                            placeholder="Markaz / Bo'lim / Fakultet / Kafedra / Guruh"
                                            onChange={(e) => {
                                                setAriza({...ariza, nameInfo: JSON.stringify(e)})
                                            }}
                                            filterOption={(input, option) => (option?.label?.toLowerCase() ?? '').startsWith(input.toLowerCase())}
                                            filterSort={(optionA, optionB) =>
                                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                                            options={Department && Department.map((item, index) => ({
                                                value: item.name,
                                                label: item.name
                                            }))}
                                        />
                                    </Form.Item>

                                    <Form.Item label="Murojatchi Familya Ism Sharif" name="FISH"
                                               rules={[{
                                                   required: true,
                                                   message: 'Malumot kiritilishi shart !!!'
                                               },]}>
                                        <Input type="text" name="FISH" placeholder="F.I.SH"
                                               onChange={(e) => {
                                                   setAriza({...ariza, fullName: e.target.value})
                                               }}/>
                                    </Form.Item>

                                    <Form.Item label="Murojatchi Telefon raqami" name="Tel"
                                               rules={[{required: true, message: 'Malumot kiritilishi shart !!!'}]}>
                                        <Input maxLength={13} type="text" placeholder="+998(**) *** ** **" name="Tel"
                                               onChange={(e) => {
                                                   setAriza({...ariza, phone: e.target.value})
                                               }}/>
                                    </Form.Item>

                                    <Form.Item label="Murojat yuboriladigan Markaz / Bo'lim / Fakultet / Kafedrani tanlang"
                                               name="MurojatYuboriladigan"
                                               rules={[{
                                                   required: true,
                                                   message: 'Malumot kiritilishi shart !!!'
                                               },]}>
                                        <Select className='w-100' showSearch name="MurojatYuboriladigan"
                                                onChange={(e) => {
                                                    handleChangeDepartme(e)
                                                }}
                                                placeholder="Markaz / Bo'lim / Fakultet / Kafedra"
                                                optionFilterProp="children"
                                                filterOption={(input, option) => (option?.label?.toLowerCase() ?? '').startsWith(input.toLowerCase())}
                                                filterSort={(optionA, optionB) =>
                                                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                                                options={Department && Department.map((item, index) => ({
                                                    value: item.id,
                                                    label: item.name
                                                }))}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="xujjat" label="Murojat xujjat turi"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Malumot kiritilishi shart !!!'
                                            },]}>
                                        <Select name="xujjat" className='w-100'
                                                onChange={(e) => {
                                                    setAriza({...ariza, applicationType: e})
                                                }}
                                                style={{
                                                    width: 120,
                                                }} allowClear
                                                options={[
                                                    {
                                                        value: 'Ariza',

                                                    },
                                                    {
                                                        value: 'Bildirgi'
                                                    },
                                                    {
                                                        value: 'Tushuntirish xati',
                                                    },
                                                    {
                                                        value: 'Xat',
                                                    },
                                                ]}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="text" label="Murojat mazmuni:"
                                        rules={[{required: true, message: 'Malumot kiritilishi shart !!!'},]}>
                                        <Editor
                                            apiKey='lz45wcy30h07262uctvyefas1jge012e0q3sbimcsfloward'
                                            onEditorChange={(content) => {
                                                form.setFieldValue('text', content)
                                                setAriza({...ariza, description: content})
                                            }}
                                            value={ariza?.description}
                                            init={{
                                                height: 300,
                                                menubar: false,
                                                plugins: [
                                                    'advlist', 'autolink', 'lists', 'link', 'charmap', 'preview',
                                                    'anchor', 'searchreplace', 'visualblocks', 'fullscreen',
                                                    'insertdatetime', 'media', 'table', 'wordcount'
                                                ],
                                                toolbar: 'undo redo | blocks | ' +
                                                    'bold italic forecolor | alignleft aligncenter ' +
                                                    'alignright alignjustify | bullist numlist outdent indent ',
                                                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                            }}
                                        />

                                    </Form.Item>

                                    {edite ? '' : <Form.Item name='file'>
                                        <Upload name='file' {...propsss}>
                                            <Button icon={<UploadOutlined/>}>File yuklash</Button>
                                        </Upload>
                                    </Form.Item>}


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
                            </div>}
                            <div className="w-50 border p-3 d-flex position-relative">
                                <div className="ariza border shadow">
                                    <div ref={componentRef} style={{ padding: '45px'}}>
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
                                    </div>
                                </div>
                                <button className="button1" type="button"
                                        style={{position: "absolute", bottom: 60, right: 40}}
                                        onClick={handlePrint}>
                                    <span className="button__text">Yuklab olish <br/> pechat qilish</span>
                                    <span className="button__icon"><svg xmlns="http://www.w3.org/2000/svg"
                                                                        viewBox="0 0 35 35"
                                                                        id="bdd05811-e15d-428c-bb53-8661459f9307"
                                                                        data-name="Layer 2" className="svg"><path
                                        d="M17.5,22.131a1.249,1.249,0,0,1-1.25-1.25V2.187a1.25,1.25,0,0,1,2.5,0V20.881A1.25,1.25,0,0,1,17.5,22.131Z"></path><path
                                        d="M17.5,22.693a3.189,3.189,0,0,1-2.262-.936L8.487,15.006a1.249,1.249,0,0,1,1.767-1.767l6.751,6.751a.7.7,0,0,0,.99,0l6.751-6.751a1.25,1.25,0,0,1,1.768,1.767l-6.752,6.751A3.191,3.191,0,0,1,17.5,22.693Z"></path><path
                                        d="M31.436,34.063H3.564A3.318,3.318,0,0,1,.25,30.749V22.011a1.25,1.25,0,0,1,2.5,0v8.738a.815.815,0,0,0,.814.814H31.436a.815.815,0,0,0,.814-.814V22.011a1.25,1.25,0,1,1,2.5,0v8.738A3.318,3.318,0,0,1,31.436,34.063Z"></path></svg></span>
                                </button>
                            </div>

                            {batafsil ?
                                <div className="border p-2 mx-2 w-50">
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
                                </div> : ""}
                        </div> :
                        <div className="d-flex align-items-center justify-content-center">
                            <Form form={form2} layout="vertical" ref={formRef} colon={false}>
                                <div className="otp">
                                    <Form.Item label="Tasdiqlash kodini kiriting">
                                        <OtpInput
                                            value={otp}
                                            onChange={setOtp}
                                            numInputs={6}
                                            placeholder={"******"}
                                            renderSeparator={<span>-</span>}
                                            renderInput={(props) => <input {...props} />}
                                        />
                                    </Form.Item>
                                </div>


                                <Button type="primary" onClick={verificationPost}>Tasdiqlash</Button>

                            </Form>
                        </div>
                }


            </Modal>
            <Drawer
                size={'large'} placement="right"
                title={`"${FileDrower?.exchangeApp?.department?.name}" dan kelgan ma'lumotlar`}
                onClose={() => setOpen1(false)} open={open1}
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
                <h6>Ma'lumot</h6>
                <div className='border p-3' dangerouslySetInnerHTML={{__html: FileDrower?.exchangeApp?.description}}/>
            </Drawer>

            <Table
                columns={columns}
                pagination={{
                    total: tableParams.pagination.total,
                    pageSize: 20,
                    onChange: (page, pageSize) => {
                        arizaGetList(page, pageSize);
                    }
                }}
                expandable={{
                    expandedRowRender: (record) => {
                        return (
                            <Steps direction="vertical"
                                   current={record.status !== "FINISHED" ? record?.exchangesApp?.length : record?.exchangesApp?.length + 1}
                                   status="wait"
                                   items={
                                       [...record?.exchangesApp?.map(item => (
                                           {
                                               title: item?.department?.name,
                                               description: item?.toDepartment?.name
                                           }
                                       )),
                                           {
                                               title: `Murojatga javob berish mudati ${record?.expDate}`,
                                               description: record.status !== "FINISHED" ?
                                                   ''
                                                   :
                                                   `Murojatga javob berilgan sana 
                                                   ${record.exchangesApp[record.exchangesApp.length - 1]?.createdDate?.split('T')[0]}`,
                                               icon: record.status !== "FINISHED" ?
                                                   <ClockCircleOutlined className="timeline-clock-icon"/> : '',
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
            <hr/>
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
                        // placeholder={["Bosh sana", 'Tugash sana']}
                        name="MurojatYuklash" format="YYYY-MM-DD" onChange={(value, dateString) => {
                        setDateListe(dateString)
                    }}/>
                </Form.Item>
                <Form.Item>
                    <button className="btn btn-success" type="submit">
                        <span className="button__text">Ma'lumotni yuklash</span>
                    </button>
                </Form.Item>

            </Form>
        </div>
    );
}

export default One;