import React, {useState} from 'react';
import {
    UploadOutlined,
    UserOutlined,
    DownloadOutlined, UserAddOutlined,
} from '@ant-design/icons';


import {Layout, Menu, Input, Avatar} from 'antd';
import "../style/admin.scss";

import {Route, Routes, useNavigate} from "react-router-dom";
import One from "./One";
import AddDeportment from "./addDeportment";
import GetList from "./getList";


const {} = Input;

const {Header, Content, Sider} = Layout;


function AdminOperator(props) {
    const navigate = useNavigate();
    const [fulInfo] = useState(JSON.parse(localStorage.getItem("myCat")));


    const items = [
        {
            label: "Yuborilgan arizalar",
            key: "1",
            icon: <UploadOutlined/>,
            access: ['ROLE_DEPARTMENT', 'ROLE_OPERATOR']
        },
        {
            label: "User qo'shish",
            key: "1",
            icon: <UserAddOutlined/>,
            access: ['ROLE_ADMIN']
        },
        {
            label: "Kelgan arizalar",
            key: "2",
            icon: <DownloadOutlined/>,
            access: ['ROLE_DEPARTMENT']
        },

        // {
        //     label: "menu",
        //     key: "3",
        //     icon: <DownloadOutlined/>,
        //     access: ['ROLE_DEPARTMENT', 'ROLE_ADMIN']
        // },

    ];


    return (
        <Layout>
            <Sider style={{height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0,}}>
                <Menu mode="inline" defaultSelectedKeys={['1']}
                      items={items.filter(item => item.access?.includes(fulInfo?.roles[0]))}
                      onClick={(into) => {
                          if (into.key === "1") {
                              if (fulInfo?.roles?.includes("ROLE_OPERATOR")) {
                                  navigate("/operator/addFile")
                              }
                              else if (fulInfo?.roles?.includes("ROLE_DEPARTMENT")) {
                                  navigate("/department/addFileDepartment")
                              }
                              else if (fulInfo?.roles?.includes("ROLE_ADMIN")) {
                                  navigate("/adminAll/userAdd")
                              }
                              // else {
                              //     navigate("/auth/")
                              // }
                          } else if (into.key === "2") {
                              if (fulInfo?.roles?.includes("ROLE_ADMIN")) {
                                  navigate("/adminAll/123")
                              }
                              else if (fulInfo?.roles?.includes("ROLE_DEPARTMENT")) {
                                  navigate("/adminAll/getFileDepartment")
                              }
                          }
                      }}/>
            </Sider>
            <Layout className="site-layout" style={{
                marginLeft: 220,
            }}>
                <Header>
                    <div className='d-flex justify-content-between'>
                        <div className="">
                            <span className=''
                            >{fulInfo?.roles[0]}</span>
                        </div>
                        <div className="w-50 d-flex justify-content-end">
                            <span className='mx-2'>{fulInfo?.fullName}</span>
                            {
                                fulInfo?.imageUrl === '' ?
                                    <Avatar size={54} icon={<UserOutlined/>}/>
                                    :
                                    <div className="img"><img width={50} src={fulInfo?.imageUrl} alt=""/></div>
                            }

                        </div>

                    </div>
                </Header>
                <Content style={{
                    margin: '20px 20px 20px 0',
                    overflow: 'initial',
                }}>
                    <Routes>
                        <Route path={"/addFile"} element={<One/>}/>
                        <Route path={"/addFileDepartment"} element={<One/>}/>
                        <Route path={"/getFileDepartment"} element={<GetList/>}/>
                        <Route path={"/userAdd"} element={<AddDeportment/>}/>

                    </Routes>
                </Content>
            </Layout>
        </Layout>
    );
}

export default AdminOperator;