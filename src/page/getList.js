import React, {useEffect, useState} from 'react';
import {Input, Space, Steps, Table} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import axios from "axios";
import {ApiName} from "../APIname";

const {Search} = Input;

function GetList(props) {

    const [fulInfo] = useState(JSON.parse(localStorage.getItem("myCat")));
    const [pageSize, setPageSize] = useState();
    const [ArizaList, setArizaList] = useState([]);



    const onSearch = (value, _e, info) => {
        console.log(info?.source, value);
    }

    useEffect(() => {
        arizaGetList()
    }, []);

    function arizaGetList() {
        axios.get(`${ApiName}/api/application`, {
            headers: {"Authorization": `Bearer ${fulInfo?.accessToken}`}

        }).then((response) => {
            console.log(response.data)
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
            title: 'Tel raqami',
            dataIndex: 'phone',
        },
        {
            title: "seeAll",
            render: (item, record, index) => (
                <button className='btn btn-outline-success' onClick={(e) => {
                    console.log(item);

                }}>
                    See
                </button>),
        },
    ];

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
            </div>

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

export default GetList;