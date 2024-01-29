import React from 'react';
import Navbar from "../componenta/navbar";
import "../style/tekshirish.scss"
import {Button, Form, Input, Steps} from 'antd';


function Tekshirish(props) {

    const description = 'This is a description.';

    return (
        <div className='home'>
            <div className="liner"/>

            <div className='container'>
                <div className="row">

                    <Navbar/>

                    <div className="tekshirish">

                        <Form
                            layout="vertical"
                            labelCol={{
                                flex: '35px',
                            }}
                            labelAlign="left"
                            labelWrap
                            wrapperCol={{
                                flex: 5,
                            }}
                            colon={false}
                        >
                            <Form.Item
                                label="Telefon raqami"
                                name="Telefon raqam kiritilishi shart !!!"
                                rules={[{required: true,},]}>
                                <Input/>
                            </Form.Item>

                            <Form.Item
                                label="Ariza raqami"
                                name="Ariza raqam kiritilishi shart !!!"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Tekshirish
                                </Button>
                            </Form.Item>
                        </Form>
                        <Steps
                            size="small"
                            current={2}
                            status="error"
                            items={[
                                {
                                    title: 'Start',
                                    description

                                },
                                {
                                    title: 'In Progress',
                                    description
                                },
                                {
                                    title: 'Waiting',
                                    description
                                },
                                {
                                    title: 'Finished',
                                    description
                                },
                            ]}
                        />

                    </div>
                   
                </div>

            </div>

        </div>
    );
}

export default Tekshirish;