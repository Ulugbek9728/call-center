import React, {useEffect, useState, useRef} from 'react';
import {useReactToPrint} from 'react-to-print';

import {Input, Space, Table, Select, Modal, Upload, Button, Steps, Skeleton, message, Empty, Drawer} from 'antd';
import {UploadOutlined, LoadingOutlined, CaretRightOutlined} from '@ant-design/icons';
import {ApiName} from "../APIname";
import axios from "axios";
import {toast} from "react-toastify";


const {Search} = Input;


const onSearch = (value, _e, info) => console.log(info?.source, value);

function One(props) {
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
    const [ArizaList, setArizaList] = useState([]);
    const [Datee, setDatee] = useState();
    const [ItemFileListe, setItemFileListe] = useState([]);
    const [FileDrower, setFileDrower] = useState([]);

    const [open1, setOpen1] = useState(false);


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
        if (fulInfo?.roles?.includes('ROLE_DEPARTMENT')){
            setAriza({...ariza, fullName: fulInfo.fullName})
        }
        DepartmenGet()
        arizaGetList()
    }, [sucsessText]);

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
            params:{
                isCome: false}

        }).then((response) => {
            setArizaList(response.data.data.content)
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

    const handleChange = (value) => {
        console.log(`selected ${value}`);
    };

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
                    setTimeout(() => {
                        setOpen(false);
                        setConfirmLoading(false);
                        setSucsessText('File yuborildi')
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
                    }, 1000);
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
            }

           else if (info.file.status === 'done') {
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

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Space>
                    <Search
                        placeholder="input search text" allowClear
                        onSearch={onSearch}
                        style={{width: 400,}}
                    />
                    <Select
                        defaultValue="lucy"
                        style={{
                            width: 400,
                        }}
                        onChange={handleChange}
                        options={[
                            {
                                value: 'jack',
                                label: 'Jack',
                            },
                            {
                                value: 'lucy',
                                label: 'Lucy',
                            },
                            {
                                value: 'Yiminghe',
                                label: 'yiminghe',
                            },
                            {
                                value: 'disabled',
                                label: 'Disabled',
                                disabled: true,
                            },
                        ]}
                    />
                </Space>
                <button className='btn btn-success' onClick={() => {setOpen(true)}}>
                    Add New
                </button>
            </div>
            <Modal className='modalAddNew'
                   title={edite ? "Ariza" : "Ariza qo'shish"} open={open} onOk={handleOk}
                   confirmLoading={confirmLoading} onCancel={() => {
                setOpen(false);
                setEdite(false)
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
                <div className='d-flex justify-content-between'>
                    {edite ? "" : <div className="border w-50 p-3 mx-3">
                        <form>
                            <div className="mb-3 mt-3">
                                <label form="FISH" className="form-label">Familya Ism Sharif</label>
                                <input type="text" value={ariza?.fullName} className="form-control" id="FISH"
                                       placeholder="F.I.SH" name="email"
                                       onChange={(e) => {
                                           setAriza({...ariza, fullName: e.target.value})
                                       }}/>
                            </div>
                            <div className="mb-3">
                                <label form="pwd" className="form-label">Tel</label>
                                <input type="text" value={ariza?.phone} className="form-control" id="pwd"
                                       placeholder="+998(**) *** ** **" name="pswd"
                                       onChange={(e) => {
                                           setAriza({...ariza, phone: e.target.value})
                                       }}/>
                            </div>
                            <div className="mb-3">
                                <label form="ID" className="form-label">Markaz / Bo'lim / Fakultet / Kafedra ga
                                    yuborish</label>
                                <br/>
                                <Select className='w-100'
                                        showSearch
                                        value={ariza.toDepartment?.name}

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
                            </div>
                            <div className="mb-3">
                                <label form="xujjat" className="form-label">Xujjat turi</label>

                                <Select
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

                            </div>
                            <label htmlFor="comment">Ariza mazmuni:</label>
                            <textarea className="form-control" rows="10" id="comment" name="text"
                                      value={ariza.description}
                                      onChange={(e) => {
                                          setAriza({...ariza, description: e.target.value})
                                      }}/>
                        </form>
                        <Upload {...propss}>
                            <Button icon={<UploadOutlined/>}>File yuklash</Button>
                        </Upload>

                    </div>}
                    <div className="w-50 border d-flex">
                        <div className=" ariza border shadow px-5 py-3">
                            <div ref={componentRef}>
                                <div className="d-flex">
                                    <div className="w-50"></div>
                                    <div className="w-50 contentAriza">
                                        Islom karimov nomidagi Toshkent davlat texnika universiteti rektori
                                        M.S.Turabdjanovga <span>{ariza.fullName}</span> dan
                                    </div>
                                </div>
                                <h4 className="text-center mt-3">
                                    {ariza.applicationType}
                                </h4>
                                <div className="contentAriza">{ariza.description != '' ? ariza.description :
                                    <Skeleton/>} </div>
                            </div>

                            <span className='date'>sana: {Datee}</span>
                        </div>
                        <button style={{height: 50, width: 200}} className='btn btn-success'
                                onClick={handlePrint}>Yuklab olish / pechat
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
                <h6>Ma'lumot</h6>
                <p className='border p-3'>
                    {FileDrower?.exchangeApp?.description}
                </p>
            </Drawer>

            <Table
                columns={columns}
                pagination={pageSize}
                expandable={{
                    expandedRowRender: (record) => (
                        <Steps
                            current={record?.exchangesApp?.length}
                            status="wait"
                            items={
                                [...record?.exchangesApp?.map(item => (
                                    {
                                        title: item?.department?.name
                                    }
                                )),
                                    {
                                        title: 'Finish',
                                        icon: <LoadingOutlined/>,
                                    }
                                ]
                            }
                        />
                        )
                }}
                dataSource={ArizaList?.map(item => {
                    return {...item, key: item.id}
                })}
            />
        </div>
    );
}

export default One;