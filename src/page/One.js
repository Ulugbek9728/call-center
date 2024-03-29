import React, {useEffect, useState, useRef} from 'react';
import {useReactToPrint} from 'react-to-print';

import {
    Space, Table, Select, Modal, Upload, Button, Steps, Skeleton,
    message, Empty, Drawer, Form, DatePicker
} from 'antd';
import {UploadOutlined, ClockCircleOutlined, CaretRightOutlined} from '@ant-design/icons';
import {ApiName} from "../APIname";
import axios from "axios";
import {toast} from "react-toastify";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);
const {RangePicker} = DatePicker;

function One(props) {
    const formRef = useRef(null);
    const [form] = Form.useForm();
    const [form1] = Form.useForm();

    const componentRef = useRef();
    const handlePrint = useReactToPrint({content: () => componentRef.current,});

    const [messagee, setMessage] = useState('');
    const [sucsessText, setSucsessText] = useState('');

    const [pageSize, setPageSize] = useState();
    const [Department, setDepartment] = useState([]);
    const [fulInfo] = useState(JSON.parse(localStorage.getItem("myCat")));

    const [open, setOpen] = useState(false);
    const [edite, setEdite] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [ariza, setAriza] = useState({
        fullName: '',
        nameInfo: '[]',
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


    function arizaFileList(id) {
        axios.get(`${ApiName}/api/v1/exchange-application/files-by-application`, {
            headers: {"Authorization": `Bearer ${fulInfo?.accessToken}`},
            params: {
                appId: id
            }

        }).then((response) => {
            setItemFileListe(response.data.data)
            console.log(response)
        }).catch((error) => {
            console.log(error)
        });
    }

    const handleChangeDepartme = (e) => {
        const result = Department.filter((word) => word.id === e);
        setAriza({...ariza, toDepartment: result[0]})
    };


    useEffect(() => {
        if (fulInfo?.roles?.includes('ROLE_DEPARTMENT')) {
            setAriza({...ariza, fullName: fulInfo.fullName})
        }
        DepartmenGet()
        arizaGetList()
    }, [sucsessText, SRC]);

    function DepartmenGet() {
        axios.get(`https://api-id.tdtu.uz/api/department?structureCode=ALL`, {}).then((response) => {
            setDepartment(response.data);
        }).catch((error) => {
            console.log(error)
        });
    }

    function arizaGetList() {
        axios.get(`${ApiName}/api/application`, {
            headers: {"Authorization": `Bearer ${fulInfo?.accessToken}`},
            params: SRC
        }).then((response) => {
            setArizaList(response.data.data.content)
            console.log(response.data.data.content)
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
            render: (item, record, index) => (<>{item.toDepartment?.name}</>),
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
                    arizaFileList(item.id)
                    console.log(item)
                    setAriza(item)
                    setEdite(true)
                    setOpen(true)
                }}>
                    Ko'rish
                </button>),
        },

    ];

    const handleOk = () => {
        setConfirmLoading(true);
        edite ? setTimeout(() => {
                setOpen(false);
                setConfirmLoading(false);
                setEdite(false)
            }, 1000) :
            axios.post(`${ApiName}/api/application`, ariza, {
                headers: {"Authorization": `Bearer ${fulInfo.accessToken}`}
            }).then((response) => {
                console.log(response);
                if (response.data.message === "Success") {
                    form.resetFields()
                    setOpen(false);
                    setConfirmLoading(false);
                    setSucsessText('File yuborildi')
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
                console.log(error)
                setMessage('File error')
                setConfirmLoading(false);
            })
    };

    const propss = {

        name: 'file',
        action: `${ApiName}/api/v1/attach/upload`,

        headers: {
            authorization: `Bearer ${fulInfo?.accessToken}`,
        },
        onChange(info) {
            if (info.file.status === 'removed') {
                const result = ariza.files.filter((idAll) => idAll.id !== info.file.response.id);
                setAriza({...ariza, files: result})

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
                ariza.files.push({
                        fileId: info.file.response.id,
                    }
                )
                message.success(`${info.file.name} File uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} File upload failed.`);
            }
        },
    };


    useEffect(() => {
        const date = new Date();
        const options = {day: '2-digit', month: '2-digit', year: 'numeric'};

        if (edite === true) {
            const formattedDate = new Date(ariza?.createdDate).toLocaleDateString('en-US', options);
            setDatee(formattedDate)
        } else {
            const formattedDate = date.toLocaleDateString('en-US', options);
            setDatee(formattedDate)
        }

    }, [edite]);

    useEffect(() => {
        setMessage('')
        setSucsessText('')
        notify();
    }, [message, sucsessText,]);

    function notify() {
        if (sucsessText !== '') {
            toast.success(sucsessText)
        }
        if (messagee !== '') {
            toast.error(message)
        }
    }

    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current < dayjs().endOf('day');
    };

    const onChangeDate2 = (value, dateString) => {
        console.log(dateString)
        setAriza({...ariza, expDate: dateString})
    };

    const onChangeDate = (value, dateString) => {
        setDateListe(dateString)
    };
    const onChange = () => {
        const departmentID= fulInfo.roles[0]==="ROLE_OPERATOR"? 7777 :fulInfo.department.id
        axios.get(`${ApiName}/api/application/get-as-excel`, {
            headers: {"Authorization": `Bearer ${fulInfo?.accessToken}`},
            params:{from:DateListe[0], to:DateListe[1], departmentId:departmentID},
            responseType:'blob'
        } ).then((response) => {
            console.log(response)

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

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Space>
                    <Select style={{width: 400}}
                        // showSearch
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
                            width: 400,
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
                <button className='btn btn-success' onClick={() => {
                    setOpen(true)
                }}>
                    Murojatni yaratish
                </button>
            </div>
            <Modal className='modalAddNew'
                   title={edite ? "Ariza" : "Ariza qo'shish"} open={open} footer={null}
                   confirmLoading={confirmLoading} onCancel={() => {
                setOpen(false);
                setEdite(false)
                setAriza({
                    fullName: '',
                    nameInfo: '',
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
                <div className='d-flex justify-content-between'>
                    {edite ? "" : <div className="border w-50 p-3 mx-3">
                        <Form
                            form={form} layout="vertical" ref={formRef} colon={false}
                            onFinish={handleOk}>
                            <Form.Item
                                label="Murojat mudatini belgilang"
                                name="MurojatchiniDate"
                                rules={[{
                                    required: true,
                                    message: 'Malumot kiritilishi shart !!!'
                                },]}>
                                <DatePicker name="MurojatchiniDate"
                                             style={{width: '100%',}}
                                             disabledDate={disabledDate}
                                            onChange={onChangeDate2}/>
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
                                    placeholder="Markaz / Bo'lim / Fakultet / Kafedra / Guruh"
                                    style={{width: '100%',}}
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
                                       rules={[
                                           {
                                               required: true,
                                               message: 'Malumot kiritilishi shart !!!'

                                           },]}>
                                <input type="text" value={ariza?.fullName} className="form-control" name="FISH"
                                       placeholder="F.I.SH"
                                       onChange={(e) => {
                                           setAriza({...ariza, fullName: e.target.value})
                                       }}/>
                            </Form.Item>

                            <Form.Item label="Murojatchi Telefon raqami" name="Tel"
                                       rules={[
                                           {
                                               required: true,
                                               message: 'Malumot kiritilishi shart !!!'

                                           },]}>
                                <input type="text" value={ariza?.phone} className="form-control"
                                       placeholder="+998(**) *** ** **" name="Tel"
                                       onChange={(e) => {
                                           setAriza({...ariza, phone: e.target.value})
                                       }}/>
                            </Form.Item>
                            <Form.Item label="Murojat yuboriladigan Markaz / Bo'lim / Fakultet / Kafedrani tanlang"
                                       name="MurojatYuboriladigan"
                                       rules={[
                                           {
                                               required: true,
                                               message: 'Malumot kiritilishi shart !!!'
                                           },]}>
                                <Select className='w-100'
                                        showSearch
                                        name="MurojatYuboriladigan"
                                        value={ariza.toDepartment?.name}
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
                                name="xujjat"
                                label="Murojat xujjat turi"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Malumot kiritilishi shart !!!'
                                    },]}>

                                <Select
                                    name="xujjat"
                                    className='w-100'
                                    value={ariza.documentType}
                                    onChange={(e) => {
                                        setAriza({...ariza, applicationType: e})
                                    }}
                                    style={{
                                        width: 120,
                                    }}
                                    allowClear
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
                                rules={[
                                    {
                                        required: true,
                                        message: 'Malumot kiritilishi shart !!!'
                                    },]}>
                                <textarea className="form-control" rows="8" id="comment" name="text"
                                          value={ariza.description}
                                          onChange={(e) => {
                                              setAriza({...ariza, description: e.target.value})
                                          }}/>
                            </Form.Item>

                            <Form.Item name='file'>
                                <Upload name='file' {...propss}>
                                    <Button icon={<UploadOutlined/>}>File yuklash</Button>
                                </Upload>
                            </Form.Item>

                            <Form.Item>
                                <Button className='p-4 d-flex align-items-center justify-content-center'
                                        type="primary"
                                        htmlType="submit">
                                    Ma'lumotni yuborish
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>}
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
                                className='btn btn-success' onClick={handlePrint}>Yuklab olish / pechat
                        </button>
                    </div>

                    {edite ?
                        <div className="border p-2 mx-2 w-50">
                            {
                                ItemFileListe == '' ? <Empty/> :
                                    ItemFileListe && ItemFileListe.map((item, index) => {
                                        return <div className="" key={index}>
                                            <div className="card-header" onClick={() => {
                                                setFileDrower(item)
                                                setOpen1(true)
                                            }}>
                                                <h6 className="mb-0">
                                                    {item.exchangeApp.department.name}
                                                </h6>
                                                <CaretRightOutlined/>
                                            </div>

                                            <div>
                                            </div>
                                        </div>
                                    })
                            }
                        </div> : ""}
                </div>
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
                <p className='border p-3'>
                    {FileDrower?.exchangeApp?.description}
                </p>
            </Drawer>

            <Table
                columns={columns} pagination={pageSize}
                expandable={{
                    expandedRowRender: (record) => {
                        return (
                            <Steps direction="vertical"
                                   current={record?.exchangesApp?.length}
                                   status="wait"
                                   items={
                                       [...record?.exchangesApp?.map(item => (
                                           {
                                               title: item?.department?.name,
                                               description: item?.toDepartment?.name
                                           }
                                       )),
                                           {
                                               title: record?.expDate,
                                               icon: <ClockCircleOutlined className="timeline-clock-icon" />,
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
    );
}

export default One;