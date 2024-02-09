import React, {useState} from 'react';
import {Button, Input, Modal, Select, Skeleton, Space, Upload} from "antd";
import axios from "axios";
import {ApiName} from "../APIname";
import {UploadOutlined} from "@ant-design/icons";


const {Search} = Input;

function AddDeportment(props) {
    const [open, setOpen] = useState(false);
    const [edite, setEdite] = useState(false);

    const [confirmLoading, setConfirmLoading] = useState(false);

    const onSearch = (value, _e, info) => {
        console.log(info?.source, value)
    };

    const handleOk = () => {
        setConfirmLoading(true);

        setTimeout(() => {
            setOpen(false);
            setConfirmLoading(false);
        }, 2000);
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
                </Space>
                <button className='btn btn-success'
                        onClick={() => {setOpen(true)}}>
                    Add New
                </button>
            </div>

            <Modal className='modalAddNew'
                   title={edite ? "Hodim o'zgartirish" : "Hodim qo'shish"} open={open} onOk={handleOk}
                   confirmLoading={confirmLoading} onCancel={() => {
                setOpen(false);
                setEdite(false)
            }}>
                <div className='d-flex justify-content-between'>
                    123 test
                </div>
            </Modal>
        </div>
    );
}

export default AddDeportment;