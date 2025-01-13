import React, {useEffect, useState} from 'react';
import {Input, Modal, Select, Space, Table, Switch, Popconfirm} from "antd";
import axios from "axios";
import {ApiName} from "../APIname";
import {toast} from "react-toastify";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";


const {Search} = Input;

function AddDeportment(props) {
    const [fulInfo] = useState(JSON.parse(localStorage.getItem("myCat")));
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 20,
            total: 20
        },
    });

    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [message, setMessage] = useState('');
    const [sucsessText, setSucsessText] = useState('');

    const [Department, setDepartment] = useState([]);
    const [addEmployee, setaddEmployee] = useState({});
    const [employeeType, setemployeeType] = useState('');
    const [employeeListe, setemployeeListe] = useState([]);
    const [userListe, setUserListe] = useState([]);

    useEffect(() => {
        DepartmenGet();
        user(1, 20)
    }, [sucsessText]);

    useEffect(() => {
        EmployeeGet()
    }, [employeeType, addEmployee]);

    function DepartmenGet() {
        axios.get(`${ApiName}/api/department?structureCode=ALL`, {}).then((response) => {
            setDepartment(response.data);
        }).catch((error) => {
            console.log(error)
        });
    }

    function user(page, pageSize) {
        axios.get(`${ApiName}/api/employee`, {
            headers: {"Authorization": `Bearer ${fulInfo?.accessToken}`},
            params: {
                size: pageSize,
                page: page - 1
            }
        }).then((response) => {
            setUserListe(response?.data?.content);
            setTableParams({
                ...tableParams,
                pagination: {
                    pageSize: response.data.size,
                    total: response.data.totalElements
                }
            })
        }).catch((error) => {
            console.log(error)
        });
    }

    const onSearch = (value, _e, info) => {
        axios.get(`${ApiName}/api/employee`, {
            headers: {"Authorization": `Bearer ${fulInfo?.accessToken}`},
            params: {
                search: value
            }

        }).then((response) => {
            console.log(response.data);
            setUserListe(response.data.content);
        }).catch((error) => {
            console.log(error)
        });
    };

    const EmployeeGet = () => {
        axios.get(`${ApiName}/api/employee/search`, {
            headers: {"Authorization": `Bearer ${fulInfo?.accessToken}`},
            params: {
                type: employeeType,
                departmentId: addEmployee?.department?.id,
                size: 200,
            }

        }).then((response) => {
            setemployeeListe(response.data.content);
        }).catch((error) => {
            console.log(error)
        });
    };

    const handleChangeDepartme = (e) => {
        const result = Department.filter((word) => word.id === e);
        setaddEmployee({...addEmployee, department: result[0]})
    };

    function changeEmploye(e) {
        const result = employeeListe.filter((word) => word.id === e);
        setaddEmployee({
            ...addEmployee,
            firstName: result[0].firstName,
            secondName: result[0].secondName,
            thirdName: result[0].thirdName,
            shortname: result[0].shortName,
            fullName: result[0].fullName,
            login: result[0].employeeIdNumber,
            imageUrl: result[0].image,
        })
    }

    const handleOk = () => {
        axios.post(`${ApiName}/api/employee`, addEmployee, {
            headers: {"Authorization": `Bearer ${fulInfo.accessToken}`}
        }).then((response) => {
            console.log(response);
            // setSucsessText("Ma'lumotlar qo'shildi")
            if (response.data.message === "Success") {
                setOpen(false);
                setaddEmployee({})
                setemployeeListe([])
                setSucsessText("Ma'lumotlar qo'shildi")
            } else {
                setMessage(response.data.message)
            }
        }).catch((error) => {
            console.log(error)
            setMessage("error Employee")
        })
    };
    const handleOk1 = () => {

        axios.put(`${ApiName}/api/employee`, {profileId: addEmployee.id, roles: addEmployee.roles}, {
            headers: {"Authorization": `Bearer ${fulInfo.accessToken}`}
        }).then((response) => {

            setOpen1(false);
            EmployeeGet()
            getRoleUser()
        }).catch((error) => {
            console.log(error)
            setMessage("error Edite")
        })
    };
    function getRoleUser() {
        let value

        axios.get(`${ApiName}/api/employee/current`, {
            headers: {"Authorization": `Bearer ${fulInfo?.accessToken}`},
        }).then((response) => {
            value={...fulInfo, roles:response.data.data.roles}
            localStorage.setItem("myCat", JSON.stringify(value));
            window.location.reload()
        }).catch((error) => {
            console.log(error)
        });

    }
    const Delete = (e) => {
        axios.delete(`${ApiName}/api/employee/${e}`, {
            headers: {"Authorization": `Bearer ${fulInfo.accessToken}`}
        }).then((response) => {
            setSucsessText("Ma'lumotlar o'chirildi")
            setOpen1(false);
        }).catch((error) => {
            console.log(error)
            setMessage("error Delete")
        })

    };

    useEffect(() => {
        setMessage('')
        setSucsessText('')
        notify();
    }, [message, sucsessText,]);

    function notify() {
        if (sucsessText !== '') {
            toast.success(sucsessText)
        }
        if (message !== '') {
            toast.error(message)
        }
    }

    const columns = [
        {
            title: '№',
            width: 50,
            render: (item, record, index) => (<>{index + 1}</>)
        },
        {
            title: 'Role',
            dataIndex: 'roles',
            width: 150
        },
        {
            title: "Bo'lim / Markaz",
            render: (item, record, index) => (<>{item.department?.name}</>),
            width: 300,
        },
        {
            title: 'Hodim F.I.SH',
            dataIndex: 'fullName',
        },
        {
            title: 'Rasm',
            render: (item, record, index) => (
                <img src={item.imageUrl} width={100} alt=""/>
            )
        },
        {
            title: "seeAll",
            render: (item, record, index) => (
                <div className="d-flex">
                    <button className="editBtn"
                            onClick={() => {
                                setOpen1(true)
                                setaddEmployee(item)
                            }}>
                        <svg height="1em" viewBox="0 0 512 512">
                            <path
                                d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"
                            ></path>
                        </svg>
                    </button>

                    <Popconfirm
                        title="Hodimni o'chirish" description="Hodimni o'chirishni tasdiqlaysizmi?"
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

                    </Popconfirm>


                </div>)

        },
    ];

    function chengStatusEmployee(e, status) {
        if (e === true){
            addEmployee.roles.push(status)
        }
        else {
            const filteredArray = addEmployee?.roles.filter(item => item !== status);
            setaddEmployee({...addEmployee, roles:filteredArray}
                )
        }
    }


    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Space>
                    <Search placeholder="F.I.SH bo'yicha qidiruv" allowClear onSearch={onSearch} style={{width: 400,}}/>
                </Space>
                <button type="button" className="button1"
                        onClick={() => {
                            setOpen(true)
                        }}>
                    <span className="button__text">Hodim yaratish</span>
                    <span className="button__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" strokeWidth="2"
                             strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" height="24"
                             fill="none"
                             className="svg"><line y2="19" y1="5" x2="12" x1="12"></line><line y2="12" y1="12" x2="19"
                                                                                               x1="5"></line></svg></span>
                </button>
            </div>
            <Modal className='w-50' title={"Hodim qo'shish"} open={open} onOk={handleOk} onCancel={() => {
                setOpen(false);
                setemployeeListe([]);
                setaddEmployee({})
            }}>
                <form>
                    <label className="form-label">Markaz / Bo'lim / Fakultet / Kafedra</label>
                    <br/>
                    <Select className='w-100' showSearch value={addEmployee.department?.name}
                            onChange={(e) => {
                                handleChangeDepartme(e)
                                // console.log(e)
                            }}
                            placeholder="Markaz / Bo'lim / Fakultet / Kafedra" optionFilterProp="children"
                            filterOption={(input, option) => (option?.label?.toLowerCase() ?? '').startsWith(input.toLowerCase())}
                            filterSort={(optionA, optionB) =>
                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                            options={Department && Department.map((item, index) => ({
                                value: item.id,
                                label: item.name
                            }))}
                    />
                    <label className="form-label mt-4">Lavozimni tanlang</label>
                    <br/>
                    <Select className='w-100' placeholder="O'qituvchi / Ishchi"
                            onChange={(e) => {
                                setemployeeType(e)
                            }}
                            options={[
                                {
                                    value: 'teacher',
                                    label: "O'qituvchi"
                                },
                                {
                                    value: 'employee',
                                    label: "Hodim"
                                },

                            ]}/>

                    <label form="ID" className="form-label mt-4">Hodimni biriktiring</label>
                    <br/>
                    <Select className='w-100'
                            showSearch
                            value={addEmployee?.fullName}
                            onChange={(e) => {
                                changeEmploye(e)
                            }}
                            placeholder="Hodimni biriktiring"
                            optionFilterProp="children"

                            filterOption={(input, option) => (option?.label?.toLowerCase() ?? '').startsWith(input.toLowerCase())}
                            filterSort={(optionA, optionB) =>
                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                            }
                            options={employeeListe && employeeListe.map((item, index) => ({
                                value: item.id,
                                label: item.fullName
                            }))}
                    />
                    <label form="ID" className="form-label mt-4">Rolini tanlang</label>
                    <br/>
                    <Select className='w-100'
                            onChange={(e) => {
                                setaddEmployee({
                                    ...addEmployee,
                                    roles: [e]
                                })
                            }}
                            options={[
                                {
                                    value: 'ROLE_RECTOR',
                                    label: "Rektor"
                                },
                                {
                                    value: 'ROLE_ADMIN',
                                    label: "Admin"
                                },
                                {
                                    value: 'ROLE_OPERATOR',
                                    label: "Operator"
                                },
                                {
                                    value: 'ROLE_DEPARTMENT',
                                    label: "Markaz / Bo'lim / Fakultet / Kafedra"
                                }
                            ]}/>
                </form>
            </Modal>
            {open1 ? (<Modal className='w-25' title={"Hodimni ro'lini o'zgartirish"} open={open1} onOk={handleOk1}
                     onCancel={() => {
                         setOpen1(false);
                         setaddEmployee({})
                     }}>
                <div className="d-block">
                    <Switch
                        defaultChecked={addEmployee?.roles?.includes('ROLE_RECTOR')}
                        onClick={(e) => {
                            chengStatusEmployee(e, 'ROLE_RECTOR')
                        }}
                    />
                    <span className='mx-3'>Rector</span> <br/>
                    <Switch
                        defaultChecked={addEmployee?.roles?.includes('ROLE_ADMIN')}
                        onClick={(e) => {
                            chengStatusEmployee(e, 'ROLE_ADMIN')
                        }}
                    />
                    <span className='mx-3'>Admin</span> <br/>
                    <Switch
                        defaultChecked={addEmployee?.roles?.includes('ROLE_OPERATOR')}
                        onClick={(e) => {
                            chengStatusEmployee(e, 'ROLE_OPERATOR')
                        }}
                    />
                    <span className='mx-3 '>Operator</span> <br/>
                    <Switch
                        defaultChecked={addEmployee?.roles?.includes('ROLE_DEPARTMENT')}
                        onClick={(e) => {
                            chengStatusEmployee(e, 'ROLE_DEPARTMENT')
                        }}
                    />
                    <span className='mx-3'>Bo'lim admin</span>
                </div>
            </Modal>) : null}

            <Table
                columns={columns}
                pagination={
                    {
                        total: tableParams.pagination.total,
                        pageSize: 20,
                        onChange: (page, pageSize) => {
                            user(page, pageSize);
                        }
                    }
                }
                dataSource={userListe?.map(item => {
                    return {...item, key: item.id}
                })}
            />
        </div>
    );
}

export default AddDeportment;