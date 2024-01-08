import React, {useState} from 'react';
import {Input, Space, Table, Select, Modal, message, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';


const { Search,TextArea } = Input;


const onSearch = (value, _e, info) => console.log(info?.source, value);

function One(props) {
    const [pageSize, setPageSize] = useState('');

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const columns = [
        {
            title: '№',
            dataIndex: 'm',
            width: 50,
        }, {
            title: 'Name',
            dataIndex: 'name',
            width: 150,
        },
        {
            title: 'Age',
            dataIndex: 'age',
            width: 150,
        },
        {
            title: 'Address',
            dataIndex: 'address',
        },
    ];
    const data = [];
    for (let i = 0; i < 100; i++) {
        data.push({
            key: i,
            m :`${i+1}`,
            name: `Edward King ${i}`,
            age: 32,
            address: `London, Park Lane no. ${i}`,
        });
    }
    const handleChange = (value) => {
        console.log(`selected ${value}`);
    };
    const handleOk = () => {
        setConfirmLoading(true);
        setTimeout(() => {
            setOpen(false);
            setConfirmLoading(false);
        }, 2000);
    };
    const propss = {
        name: 'file',
        action: '#',
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
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
                <button className='btn btn-success' onClick={()=>{setOpen(true)}}>
                    Add New
                </button>
            </div>
            <Modal className='modalAddNew'
                title="Ariza qo'shish" open={open} onOk={handleOk}
                confirmLoading={confirmLoading} onCancel={()=>setOpen(false)}>

                <div className='d-flex justify-content-between'>
                    <div className="border w-50 p-3 mx-3">
                        <form>
                            <div className="mb-3 mt-3">
                                <label form="FISH" className="form-label">Familya Ism Sharif</label>
                                <input type="text" className="form-control" id="FISH" placeholder="F.I.SH" name="email"/>
                            </div>
                            <div className="mb-3">
                                <label form="pwd" className="form-label">Tel</label>
                                <input type="text" className="form-control" id="pwd" placeholder="+998(**) *** ** **" name="pswd"/>
                            </div>
                            <div className="mb-3">
                                <label form="ID" className="form-label">Markaz / Bo'lim</label>
                                <select className="form-select">
                                    <option>Markaz / Bo'lim</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label form="xujjat" className="form-label">Xujjat turi</label>
                                <select className="form-select">
                                    <option>Xujjat turi</option>
                                    <option>Ariza</option>
                                    <option>Bildirgi</option>
                                    <option>Tushuntirish xati</option>
                                    <option>Xat</option>
                                </select>
                            </div>
                            <label htmlFor="comment">Comments:</label>
                            <textarea className="form-control" rows="10" id="comment" name="text"></textarea>
                        </form>
                        <Upload {...propss}>
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>

                    </div>
                    <div className="border w-50 p-3 mx-3">123</div>
                </div>
            </Modal>


            <Table
                columns={columns}
                dataSource={data}
                pagination={pageSize}
                onChange={(e)=>{
                   setPageSize(e.pageSize)}}
                scroll={{y: 600,}}
            />
        </div>
    );
}

export default One;