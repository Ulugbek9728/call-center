import React from 'react';
import {
    AppstoreOutlined, BarChartOutlined,
    CloudOutlined, ShopOutlined,
    TeamOutlined, UploadOutlined,
    UserOutlined, VideoCameraOutlined,
} from '@ant-design/icons';

import { Layout, Menu, theme } from 'antd';

import "../style/admin.scss"


const { Header, Content, Sider } = Layout;
const items = [
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
    BarChartOutlined,

].map((icon, index) => ({
    key: String(index + 1),
    icon: React.createElement(icon),
    label: `nav ${index + 1}`,
}));


function Admin(props) {
    const {
        token: { colorBgContainer, borderRadiusLG },} = theme.useToken();
    return (
        <Layout>
            <Sider style={{height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0,}}>
                <Menu  mode="inline" defaultSelectedKeys={['1']} items={items} />
            </Sider>
            <Layout className="site-layout"
                style={{
                    marginLeft: 200,
                }}
            >
                <Header>
                    <span className="HeaderTitle text-light">TTJ Admin paneli</span>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px 0',
                        overflow: 'initial',
                    }}
                >
                    <div
                        style={{
                            padding: 24,
                            textAlign: 'center',
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <p>long content</p>
                        {
                            // indicates very long content
                            Array.from(
                                {
                                    length: 100,
                                },
                                (_, index) => (
                                    <React.Fragment key={index}>
                                        {index % 20 === 0 && index ? 'more' : '...'}
                                        <br />
                                    </React.Fragment>
                                ),
                            )
                        }
                    </div>

                </Content>
            </Layout>
        </Layout>
    );
}

export default Admin;