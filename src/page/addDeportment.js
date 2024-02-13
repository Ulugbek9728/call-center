import React, {useEffect, useState} from 'react';
import {Input, Modal, Select, Space, Table, Switch} from "antd";
import axios from "axios";
import {ApiName} from "../APIname";
import {toast} from "react-toastify";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";


const {Search} = Input;

function AddDeportment(props) {
    const [fulInfo] = useState(JSON.parse(localStorage.getItem("myCat")));
    const [pageSize, setPageSize] = useState();

    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [edite, setEdite] = useState(false);
    const [message, setMessage] = useState('');
    const [sucsessText, setSucsessText] = useState('');

    const [Department, setDepartment] = useState([]);
    const [addEmployee, setaddEmployee] = useState({});
    const [employeeType, setemployeeType] = useState('');
    const [employeeListe, setemployeeListe] = useState([]);
    const [userListe, setUserListe] = useState([]);
    const [deleteID, setDeleteID] = useState('');

    useEffect(() => {
        DepartmenGet();
        user()
    }, [sucsessText]);

    useEffect(() => {
        EmployeeGet()
    }, [employeeType, addEmployee]);

    function DepartmenGet() {
        axios.get(`https://api-id.tdtu.uz/api/department?structureCode=ALL`, {}).then((response) => {
            setDepartment(response.data);
        }).catch((error) => {
            console.log(error)
        });
    }

    function user() {
        axios.get(`${ApiName}/api/employee`, {
            headers: {"Authorization": `Bearer ${fulInfo.accessToken}`},
        }).then((response) => {
            setUserListe(response.data.content);
            console.log(response.data.content);
        }).catch((error) => {
            console.log(error)
        });
    }

    const onSearch = (value, _e, info) => {
        axios.get(`${ApiName}/api/employee`, {
            headers: {"Authorization": `Bearer ${fulInfo.accessToken}`},
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
            headers: {"Authorization": `Bearer ${fulInfo.accessToken}`},
            params: {
                type: employeeType,
                departmentId: addEmployee?.department?.id
            }

        }).then((response) => {
            // console.log(response.data);
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
        if (edite===true){
            axios.put(`${ApiName}/api/employee`, {profileId:addEmployee.id, roles:addEmployee.roles},{
                headers: {"Authorization": `Bearer ${fulInfo.accessToken}`}
            }).then((response) => {
                console.log(response);
                setSucsessText("Hodim roli o'zgardi")
                setOpen1(false);

            }).catch((error) => {
                console.log(error)
                setMessage("error Edite")
            })
        }
        else {
            axios.delete(`${ApiName}/api/employee/${deleteID}`, {
                headers: {"Authorization": `Bearer ${fulInfo.accessToken}`}
            }).then((response) => {
                console.log(response);
                setSucsessText("Ma'lumotlar o'chirildi")
                setOpen1(false);

            }).catch((error) => {
                console.log(error)
                setMessage("error Delete")
            })
        }


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
            title: 'FISH',
            dataIndex: 'fullName',
        },
        {
            title: 'Login',
            dataIndex: 'login',
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
                <div className="">
                    <button className='btn btn-outline-warning mx-1'
                            onClick={() => {
                                setOpen1(true)
                                setEdite(true)
                                setDeleteID(item.id)
                                setaddEmployee(item)
                            }}
                    >
                        <EditOutlined/>
                    </button>
                    <button className='btn btn-outline-danger mx-1'
                            onClick={() => {
                                setOpen1(true)
                                setDeleteID(item.id)
                            }}
                    >
                        <DeleteOutlined/>
                    </button>
                </div>)

        },
    ];

    return (
        <div>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <Space>
                    <Search placeholder="F.I.SH bo'yicha qidiruv" allowClear onSearch={onSearch} style={{width: 400,}}/>
                </Space>
                <button className='btn btn-success' onClick={() => {
                    setOpen(true)
                }}>
                    Add New
                </button>
            </div>

            <Modal className='w-50'
                   title={"Hodim qo'shish"} open={open} onOk={handleOk}
                   onCancel={() => {
                       setOpen(false);
                       setemployeeListe([])
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
                            ]}
                    />

                </form>
            </Modal>

            <Modal className='w-25'
                   title={edite === true ? "Hodimni ro'lini o'zgartirish" : "Hodimni o'chirishni tasdiqlang"}
                   open={open1} onOk={handleOk1}
                   onCancel={() => {
                       setOpen1(false);
                   }}>
                {edite === true ? <div className="d-block">
                        <Switch
                            checked={addEmployee?.roles?.includes('ROLE_ADMIN')}
                            onClick={() => {
                                setaddEmployee({...addEmployee, roles: ['ROLE_ADMIN']})
                            }}
                        />
                        <span>Admin</span> <br/>
                        <Switch
                            checked={addEmployee?.roles?.includes('ROLE_OPERATOR')}
                            onClick={() => {
                                setaddEmployee({...addEmployee, roles: ['ROLE_OPERATOR']})
                            }}
                        />
                        <span>Operator</span> <br/>
                        <Switch
                            checked={addEmployee?.roles?.includes('ROLE_DEPARTMENT')}
                            onClick={() => {
                                setaddEmployee({...addEmployee, roles: ['ROLE_DEPARTMENT']})

                            }}
                        />
                        <span>Bo'lim admin</span>
                    </div> :
                    <h4 className='text-danger'>Hodimni o'chirmoqchimisiz !!!</h4>}

            </Modal>

            <Table
                columns={columns}
                pagination={pageSize}
                dataSource={userListe?.map(item => {
                    return {...item, key: item.id}
                })}
            />
        </div>
    );
}

export default AddDeportment;