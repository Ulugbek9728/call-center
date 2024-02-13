import React, { useState} from 'react';
import {
    UploadOutlined,
    UserOutlined,
    DownloadOutlined,
} from '@ant-design/icons';


import { Layout, Menu,Input, Avatar,Space } from 'antd';
import "../style/admin.scss";
import {Route, Routes, useNavigate} from "react-router-dom";
import AddDeportment from "./addDeportment";


const { } = Input;

const { Header, Content, Sider } = Layout;
const items = [
    {
        label:"Bo'lim qo'shish",
        key:"1",
        icon:<UploadOutlined />
    },
    {
        label:"123",
        key:"2",
        icon:<DownloadOutlined />
    },

];


function Admin(props) {
    const navigate = useNavigate();
    const [fulInfo] = useState(JSON.parse(localStorage.getItem("myCat")));

    return (
        <Layout>
            <Sider style={{height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0,}}>
                <Menu  mode="inline" defaultSelectedKeys={['1']} items={items}
                       onClick={(into)=>{
                           if (into.key === "1"){ navigate("/adminAll");}}}/>
            </Sider>
            <Layout className="site-layout" style={{
                marginLeft: 200,
            }}>
                <Header>
                    <div className='d-flex justify-content-end'>
                        <Space direction="vertical" size={16}>
                            <Space wrap size={16}>
                                {fulInfo?.shortName}
                                {
                                    fulInfo.imageUrl===''?
                                        <Avatar size={54} icon={<UserOutlined />} />
                                        :
                                        <div className="img"><img src={fulInfo?.imageUrl} alt=""/></div>
                                }


                            </Space>

                        </Space>
                    </div>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px 0',
                        overflow: 'initial',
                    }}
                >
                    <Routes>
                        <Route path={"/"} element={ <AddDeportment/>}/>

                    </Routes>
                </Content>
            </Layout>
        </Layout>
    );
}

export default Admin;