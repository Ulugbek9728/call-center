import React, {useEffect, useRef, useState} from 'react';
import {Input, Space, Steps, Table, Modal, Skeleton, Collapse, theme, Segmented, Upload, Button, message} from "antd";
import {LoadingOutlined, CaretRightOutlined, UploadOutlined} from "@ant-design/icons";
import axios from "axios";
import {ApiName} from "../APIname";
import {useReactToPrint} from "react-to-print";

const {Search} = Input;

const getItems = (panelStyle) => [
    {
        key: '1',
        label: 'This is panel header 1',
        children: <p>1</p>,
        style: panelStyle,
    },
    {
        key: '2',
        label: 'This is panel header 2',
        children: <p>2</p>,
        style: panelStyle,
    },
    {
        key: '3',
        label: 'This is panel header 3',
        children: <p>3</p>,
        style: panelStyle,
    },
];
function GetList(props) {
    const componentRef = useRef();
    const handlePrint = useReactToPrint({content: () => componentRef.current,});

    const [fulInfo] = useState(JSON.parse(localStorage.getItem("myCat")));
    const [pageSize, setPageSize] = useState();
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
        exchangeType: "SEND",
        description: "string",
        files: [
        ]

    });
    const [Datee, setDatee] = useState();
    const [value, setValue] = useState('Javob berish');


    useEffect(() => {
        const options = {day: '2-digit', month: '2-digit', year: 'numeric'};

        const formattedDate = new Date(ariza?.createdDate).toLocaleDateString('en-US', options);
        setDatee(formattedDate)


    }, [Open]);

    const handleOk = () => {
        setOpen(false);
    };

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
                    setArizaSend({...arizaSend,
                        applicationId:item.id})
                    setAriza(item)
                    setOpen(true)
                }}>
                    See
                </button>),
        },
    ];

    const { token } = theme.useToken();
    const panelStyle = {
        marginBottom: 24,
        background: "#c3e7ff",
        borderRadius: token.borderRadiusLG,
        border: 'none',
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
                </Space>
            </div>
            <Modal className='modalAddNew' title="File mazmuni" open={Open} onOk={handleOk} onCancel={() => {
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


                    {/*<ul className="a w-50">*/}
                    {/*    {ariza.files && ariza.files.map((item, index) => {*/}
                    {/*        return <li key={index}>*/}
                    {/*            <a href={`${item.file.url}`} target={"_blank"}>File {index + 1}</a>*/}
                    {/*        </li>*/}

                    {/*    })}*/}

                    {/*</ul>*/}
                    <div className="w-50 px-4">

                        <div className="collapseAll border">
                            <Collapse
                                bordered={false}
                                defaultActiveKey={['1']}
                                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                                style={{
                                    background: "white",
                                }}
                                items={getItems(panelStyle)}
                            />
                        </div>

                        <Segmented options={["Javob berish", "Boshqa bo'limga o'tkazish"]} value={value} onChange={setValue} block/>
                        <label htmlFor="comment" className='mt-2'>Javob mazmuni:</label>
                        <textarea className="form-control mt-2" rows="6" id="comment" name="text"

                                  // onChange={(e) => {
                                  //     setAriza({...ariza, description: e.target.value})
                                  // }}
                        />
                        <Upload {...propss}>
                            <Button icon={<UploadOutlined/>}>Click to Upload</Button>
                        </Upload>
                    </div>

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
    )
        ;
}

export default GetList;