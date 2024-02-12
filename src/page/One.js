import React, {useEffect, useState, useRef} from 'react';
import { useReactToPrint } from 'react-to-print';

import {Input, Space, Table, Select, Modal, message, Upload, Button, Steps, Skeleton } from 'antd';
import {UploadOutlined, LoadingOutlined} from '@ant-design/icons';
import {ApiName} from "../APIname";
import axios from "axios";



const {Search} = Input;


const onSearch = (value, _e, info) => console.log(info?.source, value);

function One(props) {
    const componentRef = useRef();
    const handlePrint = useReactToPrint({content: () => componentRef.current,});

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


    const handleChangeDepartme = (e) => {
        const result = Department.filter((word) => word.id === e);
        setAriza({...ariza, toDepartment: result[0]})
    };


    useEffect(() => {
        DepartmenGet()
        arizaGetList()
    }, []);

    function DepartmenGet() {
        axios.get(`https://api-id.tdtu.uz/api/department?structureCode=ALL`, {}).then((response) => {
            setDepartment(response.data);
        }).catch((error) => {
            console.log(error)
        });
    }

    function arizaGetList() {
        axios.get(`${ApiName}/api/application`, {
            headers: {"Authorization": `Bearer ${fulInfo.accessToken}`}

        }).then((response) => {
            setArizaList(response.data.data.content)
            // setPageSize(response.data.pageable.pageSize)
            console.log(response.data)
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
            title: 'Tel raqami',
            dataIndex: 'phone',
        },
        {
            title: "seeAll",
            render: (item, record, index) => (
                <button className='btn btn-outline-success' onClick={(e) => {
                    console.log(item);
                    setAriza(item)
                    setEdite(true)
                    setOpen(true)
                }}>
                    See
                </button>),
        },
    ];

    const handleChange = (value) => {
        console.log(`selected ${value}`);
    };

    const handleOk = () => {
        setConfirmLoading(true);
        // eslint-disable-next-line no-unused-expressions
        edite ? setTimeout(() => {
                setOpen(false);
                setConfirmLoading(false);
                setEdite(false)
            }, 2000) :
            axios.post(`${ApiName}/api/application`, ariza, {
                headers: {"Authorization": `Bearer ${fulInfo.accessToken}`}
            }).then((response) => {
                console.log(response);
                if (response.data.message === "Success") {
                    setTimeout(() => {
                        setOpen(false);
                        setConfirmLoading(false);
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
                    }, 2000);
                }
            }).catch((error) => {
                console.log(error)
                setConfirmLoading(false);
            })


    };

    const propss = {

        name: 'file',
        action: `${ApiName}/api/v1/attach/upload`,

        headers: {
            authorization: `Bearer ${fulInfo.accessToken}`,
        },
        onChange(info) {
            if (info.file.status === 'removed') {
                const result = ariza.files.filter((idAll) => idAll.id !== info.file.response.id);
                setAriza({...ariza, files: result})

                axios.delete(`${ApiName}/api/v1/attach/${info.file.response.id}`, {
                    headers: {"Authorization": `Bearer ${fulInfo.accessToken}`}
                }).then((res) => {
                    console.log(res)
                    message.success("File o'chirildi")
                }).catch((error) => {
                    console.log(error)
                    message.error(`${info.file.name} file delete failed.`);
                })
            }

            if (info.file.status === 'done') {
                console.log(info.file.response)
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
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };

        if (edite=== true){
            const formattedDate = new Date(ariza?.createdDate).toLocaleDateString('en-US', options);
            setDatee(formattedDate)
        }
        else{
            const formattedDate = date.toLocaleDateString('en-US', options);
            setDatee(formattedDate)
        }

    }, [edite]);

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
                <button className='btn btn-success'
                        onClick={() => {setOpen(true)}}>
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
                                <label form="ID" className="form-label">Markaz / Bo'lim / Fakultet / Kafedra ga yuborish</label>
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
                            <Button icon={<UploadOutlined/>}>Click to Upload</Button>
                        </Upload>

                    </div>}
                    <div className="w-50 border d-flex">
                        <div className=" ariza border shadow px-5 py-3" >
                            <div ref={componentRef} >
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
                                <div className="contentAriza">{ariza.description!=''? ariza.description : <Skeleton />} </div>
                            </div>

                            <span className='date'>sana: {Datee}</span>
                        </div>
                        <button style={{height: 50, width: 200}} className='btn btn-success' onClick={handlePrint}>Ma'lumotlarni yuklash</button>
                    </div>



                    {edite ?
                        <ul className="a w-50">
                            {ariza.files && ariza.files.map((item, index) => {
                                return<li key={index}>
                                    <a href={`${item.file.url}`} target={"_blank"}>File {index+1}</a>
                                </li>

                            })}

                        </ul> : ""}
                </div>
            </Modal>

            <Table
                columns={columns}
                pagination={pageSize}
                expandable={{
                    expandedRowRender: (record) => (
                        <Steps
                            status="error"
                            items={[
                                {
                                    title: 'Start',
                                    status: 'finish',

                                },
                                {
                                    title: 'In Progress',
                                    status: 'finish',
                                },
                                {
                                    title: 'Waiting',
                                    status: 'process',
                                    icon: <LoadingOutlined/>,
                                },
                                {
                                    title: 'Finished',
                                    status: 'wait',
                                },
                            ]}
                        />)
                }}
                dataSource={ArizaList?.map(item => {
                    return {...item, key: item.id}
                })}
            />
        </div>
    );
}

export default One;