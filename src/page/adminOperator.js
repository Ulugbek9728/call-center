import React, {useEffect, useState} from 'react';
import {
    UploadOutlined,
    UserOutlined, LineChartOutlined, CheckSquareOutlined,
    DownloadOutlined, UserAddOutlined, SnippetsOutlined, LogoutOutlined,
} from '@ant-design/icons';


import {Layout, Input, Avatar} from 'antd';
import "../style/admin.scss";

import {NavLink, Route, Routes, useNavigate} from "react-router-dom";
import One from "./One";
import AddDeportment from "./addDeportment";
import GetList from "./getList";
import Statistika from "./statistika";
import GetListRector from "./getListRector";
import axios from "axios";
import {ApiName} from "../APIname";
import TypeService from "./TypeService";
import {toast} from "react-toastify";


const {} = Input;

const {Header, Content, Sider} = Layout;


function AdminOperator(props) {
    const navigate = useNavigate();
    const [fulInfo] = useState(JSON.parse(localStorage.getItem("myCat")));
    const [RollName, setRollName] = useState('');

    const items = [
        //operator
        {
            label: "Joyida xal qilingan murojatlar",
            key: "1",
            icon: <CheckSquareOutlined/>,
            access: ['ROLE_OPERATOR'],
            nav:"/operator/TypeService"
        },
        {
            label: "Yuborilgan murojatlar",
            key: "2",
            icon: <UploadOutlined/>,
            access: ['ROLE_OPERATOR'],
            nav:"/operator/addFile"
        },
        {
            label: "Statistika",
            key: "3",
            icon: <LineChartOutlined/>,
            access: ['ROLE_OPERATOR'],
            nav:"/operator/statistika"
        },

        //bo'lim
        {
            label: "Yuborilgan murojatlar",
            key: "1",
            icon: <UploadOutlined/>,
            access: ["ROLE_DEPARTMENT"],
            nav:"/department/addFileDepartment"
        },
        {
            label: "Kelgan murojatlar",
            key: "2",
            icon: <DownloadOutlined/>,
            access: ['ROLE_DEPARTMENT'],
            nav:"/department/getFileDepartment"
        },
        {
            label: "Statistika",
            key: "3",
            icon: <LineChartOutlined/>,
            access: ['ROLE_DEPARTMENT'],
            nav:"/department/statistika"
        },

        //rector
        {
            label: "Joyida xal qilingan murojatlar",
            key: "1",
            icon: <CheckSquareOutlined/>,
            access: ["ROLE_RECTOR"],
            nav:"/adminRector/TypeService"
        },
        {
            label: "Kelgan murojatlar",
            key: "2",
            icon: <SnippetsOutlined/>,
            access: ['ROLE_RECTOR'],
            nav:"/adminRector/getappeals"
        },
        {
            label: "Murojatlar",
            key: "3",
            icon: <SnippetsOutlined/>,
            access: ["ROLE_RECTOR"],
            nav:"/adminRector/appeals"
        },

        //admin
        {
            label: "Joyida xal qilingan murojatlar",
            key: "1",
            icon: <CheckSquareOutlined/>,
            access: ["ROLE_ADMIN"],
            nav:"/adminAll/TypeService"
        },
        {
            label: "Hodim qo'shish",
            key: "2",
            icon: <UserAddOutlined/>,
            access: ['ROLE_ADMIN'],
            nav:"/adminAll/userAdd"

        },
        {
            label: "Murojatlar",
            key: "3",
            icon: <SnippetsOutlined/>,
            access: ['ROLE_ADMIN'],
            nav:"/adminAll/appeals"
        },
        {
            label: "Statistika",
            key: "4",
            icon: <LineChartOutlined/>,
            access: ['ROLE_ADMIN'],
            nav:"/adminAll/statistika"
        },

    ];
    useEffect(() => {
        if (fulInfo?.currentRole?.includes("ROLE_OPERATOR")) {
            setRollName('Operator')
        } else if (fulInfo?.currentRole?.includes("ROLE_DEPARTMENT")) {
            setRollName(fulInfo?.department?.name)

        } else if (fulInfo?.currentRole?.includes("ROLE_RECTOR")) {
            setRollName('Rektor')

        } else if (fulInfo?.currentRole?.includes("ROLE_ADMIN")) {
            setRollName('ADMINI')
        }
    }, [])
    let newWindow;
    function LogOut() {
        openNewWindow(); // Yangi oynani ochish
        setTimeout(closeWindow, 100); // 0.1 sekunddan so'ng oynani yopish
        localStorage.removeItem("myCat");

    }

    function openNewWindow() {
        newWindow = window.open('https://hemis.tdtu.uz/dashboard/logout', '_blank');
    }

    function closeWindow() {
        newWindow.close(); // Yangi oynani yopish
        navigate("/")
    }
    function changeRole(e) {
        let value
        axios.post(`${ApiName}/api/change-role/${e}`, '',
            {headers: {"Authorization": `Bearer ${fulInfo?.accessToken}`}}
        ).then((res) => {
            console.log(res)
            value = {
                ...fulInfo,
                currentRole: e,
                accessToken: res?.data?.data?.accessToken
            }
            localStorage.setItem("myCat", JSON.stringify(value));
            if (e === 'ROLE_OPERATOR') {
                navigate('/operator/TypeService')
            }
            else if (e === 'ROLE_RECTOR') {navigate('/adminRector/TypeService')}
            else if (e === 'ROLE_ADMIN') {navigate('/adminAll/TypeService')}
            else if (e === 'ROLE_DEPARTMENT') {navigate('/department/addFileDepartment')}
            window.location.reload()

        }).catch((error) => {
            console.log(error)
            toast.error(error?.response?.data?.message)
        })
    }


    return (
        <Layout>
            <Sider style={{height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0,}}>
                <div className='verticalMenu'>
                    {items.filter(item => item.access?.includes(fulInfo?.currentRole))
                        .map(item => (

                            <NavLink key={item.key} to={`${item.nav}`}>
                                <span className='mx-2'>{item.label}</span>
                            </NavLink>
                            )
                        )}
                </div>
            </Sider>
            <Layout className="site-layout" style={{marginLeft: 220,}}>
                <Header>
                    <div className='d-flex justify-content-between'>
                        <div className="">
                            <span>{RollName}</span>
                        </div>
                        <div className="w-50 d-flex justify-content-end">

                            <div className="dropleft">
                                {
                                    fulInfo?.imageUrl === '' ?
                                        <Avatar size={54} icon={<UserOutlined/>}
                                                className="btn btn-secondary dropdown-toggle p-0"
                                                type="button" id="dropdownMenuButton" data-toggle="dropdown"
                                                aria-haspopup="true" aria-expanded="false"/>
                                        :
                                        <div className="btn btn-secondary dropdown-toggle img p-0"
                                             id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true"
                                             aria-expanded="false"><img width={50} src={fulInfo?.imageUrl}
                                                                        alt="userImg"/>
                                        </div>
                                }

                                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    <span style={{height: 40, alignItems: "center", display: "flex"}}
                                          className='dropdown-item'>{fulInfo?.fullName}
                                    </span>
                                    {
                                        fulInfo?.roles.map((item, index) => (
                                            <span key={index}
                                                  style={{
                                                      height: 40,
                                                      alignItems: "center",
                                                      display: "flex",
                                                      cursor: "pointer"
                                                  }}
                                                  className='dropdown-item'
                                                  onClick={() => {
                                                      changeRole(item)
                                                  }}>
                                        {item === 'ROLE_DEPARTMENT' ? "BO'LIM ADMIN" : item === 'ROLE_RECTOR' ? 'RECTOR' : item === 'ROLE_ADMIN' ? 'ADMIN' : item === 'ROLE_OPERATOR' ? 'OPERATOR' : ''}
                                    </span>
                                        ))
                                    }

                                    <a style={{height: 40, alignItems: "center", display: "flex"}}
                                       className='dropdown-item' onClick={LogOut}
                                       href="#">PLATFORMADAN CHIQISH <LogoutOutlined className='mx-4'/></a>

                                </div>

                            </div>
                        </div>

                    </div>
                </Header>
                <Content style={{
                    margin: '20px 20px 20px 0',
                    overflow: 'initial',
                }}>
                    <Routes>
                        <Route path={"/TypeService"} element={<TypeService/>}/>
                        <Route path={"/addFile"} element={<One/>}/>
                        <Route path={"/addFileDepartment"} element={<One/>}/>
                        <Route path={"/getFileDepartment"} element={<GetList/>}/>
                        <Route path={"/appeals"} element={<GetList/>}/>
                        <Route path={"/getappeals"} element={<GetListRector/>}/>
                        <Route path={"/userAdd"} element={<AddDeportment/>}/>
                        <Route path={"/statistika"} element={<Statistika/>}/>
                    </Routes>
                </Content>
            </Layout>
        </Layout>
    )
        ;
}

export default AdminOperator;
