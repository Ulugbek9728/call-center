import React, {useEffect, useState} from 'react';
import {
    UploadOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {useSearchParams} from 'react-router-dom';
import axios from "axios";

import { Layout, Menu,Input, Avatar,Space } from 'antd';
import "../style/admin.scss";
import {Route, Routes, useNavigate} from "react-router-dom";
import One from "./One";
import {ApiName} from "../APIname";
import data from "bootstrap/js/src/dom/data";
import {useDispatch, useSelector} from "react-redux";

const { Search } = Input;

const { Header, Content, Sider } = Layout;
const items = [
    {
        label:"One",
        key:"1",
        icon:<UserOutlined />
    },
    {
        label:"Two",
        key:"2",
        icon:<UploadOutlined />
    },

];




function Admin(props) {
    const navigate = useNavigate();
    const [fulInfo, setfulInfo] = useState(JSON.parse(localStorage.getItem("myCat")));
    console.log(fulInfo)




    return (
        <Layout>
            <Sider style={{height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0,}}>
                <Menu  mode="inline" defaultSelectedKeys={['1']} items={items}
                       onClick={(into)=>{
                           if (into.key === "1"){ navigate("/operatorAdmin/");}
                       }}/>
            </Sider>
            <Layout className="site-layout" style={{
                    marginLeft: 200,
                }}>
                <Header>


                    <div className='d-flex justify-content-end'>
                        <Space direction="vertical" size={16}>
                            <Space wrap size={16}>
                                {
                                    fulInfo?.fullName
                                }
                                {
                                    fulInfo===''? <Avatar size={54} icon={<UserOutlined />} />:
                                        <div className="img">
                                            <img src={fulInfo?.imageUrl} alt=""/>
                                        </div>
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

                        <Route path={"/"} element={ <One/>}/>

                    </Routes>
                </Content>
            </Layout>
        </Layout>
    );
}

export default Admin;