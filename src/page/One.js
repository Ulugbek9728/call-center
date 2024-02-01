import React, {useEffect, useState} from 'react';
import {Input, Space, Table, Select, Modal, message, Upload, Button} from 'antd';
import {UploadOutlined} from '@ant-design/icons';
import {ApiName} from "../APIname";
import axios from "axios";


const {Search} = Input;


const onSearch = (value, _e, info) => console.log(info?.source, value);

function One(props) {
    const [pageSize, setPageSize] = useState('');
    const [Department, setDepartment] = useState([]);
    const [fulInfo] = useState(JSON.parse(localStorage.getItem("myCat")));

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [ariza, setAriza] = useState({
        fullName:'',
        applicationType:'Ariza',
        phone:'',
        description:'',
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


    useEffect(() => {
        DepartmenGet()
        arizaGetList()
    }, []);

    function DepartmenGet() {
        axios.get(`https://api-id.tdtu.uz/api/department?structureCode=ALL`,{

        }).then((response) => {
            // console.log(response)
            setDepartment(response.data);
        }).catch((error) => {
            // console.log(error)
        });
    }

    function arizaGetList() {
        axios.get(`${ApiName}/api/application`,{
            headers: {"Authorization": `Bearer ${fulInfo.accessToken}`}

        }).then((response) => {
            console.log(response.data.data.content)
            setArizaList(response.data.data.content)
        }).catch((error) => {
            // console.log(error)
        });
    }

    const columns = [
        {
            title: '№',
            dataIndex: '',
            width: 50,
        },
        {
            title: 'File turi',
            dataIndex: 'documentType',
            width: 150,
        },
        {
            title: 'FISH',
            dataIndex: 'name',
            width: 150,
        },

        {
            title: 'Tel raqami',
            dataIndex: 'phone',
        },
    ];

    const handleChange = (value) => {
        console.log(`selected ${value}`);
    };

    const handleChangeDepartme = (e) => {
        const result = Department.filter((word) => word.id === e);
        setAriza({...ariza, toDepartment: result[0]})
    };
    const handleOk = () => {
        setConfirmLoading(true);
        axios.post(`${ApiName}/api/application`, ariza, {
            headers: {"Authorization": `Bearer ${fulInfo.accessToken}`}
        }).then((response) => {
            console.log(response);
            if (response.data.message==="Success"){
                setTimeout(() => {
                    setOpen(false);
                    setConfirmLoading(false);
                    setAriza({fullName:'',
                        applicationType:'Ariza',
                        phone:'',
                        description:'',
                        toDepartment: {
                            id: '',
                            nam: '',
                            code: "",
                            structureType: {
                                code: "",
                                name: ""
                            }
                        },
                        files: []})
                }, 2000);


            }
        }).catch((error) => {
            console.log(error)
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
             const result=ariza.files.filter((idAll) => idAll.id !== info.file.response.id);
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
                       fileId:info.file.response.id,
               }
                   )
                message.success(`${info.file.name} File uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} File upload failed.`);
            }
        },
    };

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
                <button className='btn btn-success' onClick={() => {
                    setOpen(true)
                }}>
                    Add New
                </button>
            </div>
            <Modal className='modalAddNew'
                   title="Ariza qo'shish" open={open} onOk={handleOk}
                   confirmLoading={confirmLoading} onCancel={() => setOpen(false)}>

                <div className='d-flex justify-content-between'>
                    <div className="border w-50 p-3 mx-3">
                        <form>
                            <div className="mb-3 mt-3">
                                <label form="FISH" className="form-label">Familya Ism Sharif</label>
                                <input type="text" value={ariza?.fullName} className="form-control" id="FISH" placeholder="F.I.SH" name="email"
                                       onChange={(e)=>{
                                           setAriza({...ariza, fullName: e.target.value})}}/>
                            </div>
                            <div className="mb-3">
                                <label form="pwd" className="form-label">Tel</label>
                                <input type="text" value={ariza?.phone} className="form-control" id="pwd" placeholder="+998(**) *** ** **" name="pswd"
                                       onChange={(e)=>{
                                           setAriza({...ariza, phone: e.target.value})}}/>
                            </div>
                            <div className="mb-3">
                                <label form="ID" className="form-label">Markaz / Bo'lim</label>
                                <br/>
                                <Select className='w-100'
                                    showSearch
                                    onChange={(e) => {handleChangeDepartme(e)}}
                                    placeholder="Markaz / Bo'lim"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => (option?.label?.toLowerCase() ?? '').startsWith(input.toLowerCase())}
                                    filterSort={(optionA, optionB) =>
                                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                    }
                                    options={Department && Department.map((item, index) =>({value:item.id, label:item.name}))}
                                />
                            </div>
                            <div className="mb-3">
                                <label form="xujjat" className="form-label">Xujjat turi</label>
                                <select className="form-select"
                                        onChange={(e)=>{
                                            setAriza({...ariza, applicationType: e.target.value})}}>
                                    <option>Xujjat turi</option>
                                    <option>Ariza</option>
                                    <option>Bildirgi</option>
                                    <option>Tushuntirish xati</option>
                                    <option>Xat</option>
                                </select>
                            </div>
                            <label htmlFor="comment">Ariza mazmuni:</label>
                            <textarea className="form-control" rows="10" id="comment" name="text" value={ariza.description}
                                      onChange={(e)=>{
                                          setAriza({...ariza, description: e.target.value})}}/>
                        </form>
                        <Upload {...propss}>
                            <Button icon={<UploadOutlined/>}>Click to Upload</Button>
                        </Upload>

                    </div>
                    <div className="border w-50  mx-3 d-flex justify-content-center">
                        <div className="border w-75 px-5 py-3">
                            <div className="d-flex">
                                <div className="w-50"></div>
                                <div className="w-50 contentAriza">
                                    Islom karimov nomidagi Toshkent davlat texnika universiteti rektori M.S.Turabdjanovga
                                    <span> R.T.T.M boshlig'i</span> <span>{ariza?.fullName}</span> dan
                                </div>
                            </div>
                            <h4 className="ariza text-center mt-3">
                                {ariza?.applicationType}
                            </h4>
                            <p className="contentAriza">{ariza.description}</p>

                        </div>
                    </div>
                </div>
            </Modal>

            <Table
                columns={columns}
                dataSource={ArizaList}
                pagination={pageSize}
                onChange={(e) => {
                    setPageSize(e.pageSize)
                }}
                scroll={{y: 650,}}
            />
        </div>
    );
}

export default One;