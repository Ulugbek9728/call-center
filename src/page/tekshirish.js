import React, {useEffect, useState} from 'react';
import Navbar from "../componenta/navbar";
import "../style/tekshirish.scss"
import {Button, Form, Input, message,} from 'antd';
import axios from "axios";
import {ApiName} from "../APIname";
import {toast} from "react-toastify";


function Tekshirish(props) {
    const formRef = React.useRef(null);

    const [messagee, setMessage] = useState('');
    const [sucsessText, setSucsessText] = useState('');

    function Login(values) {
        const requestData = {
            phone: values?.Telefon,
            application_number: values?.Ariza
        };
        axios.get(`${ApiName}/api/application/check`,{
            params:requestData
        }).then((response) => {
            if (response.data.isSuccess === true){

            }
            else {
                setMessage(response.data.message)

            }
            console.log(response)

        }).catch((error) => {

            console.log(error)
        })
    }
    useEffect(() => {
        notify();
        setMessage('')
        setSucsessText('')

    }, [messagee, sucsessText,]);

    function notify() {
        if (sucsessText !== '') {
            toast.success(sucsessText)
        }
        if (messagee !== '') {
            toast.error(messagee)
        }
    }

    return (
        <div className='home'>
            <div className="liner"/>

            <div className='container'>
                <div className="row">

                    <Navbar/>

                    <div className="tekshirish">
                        <div className="left">
                            <h2>Build Your Business Modern, Faster And Reliable</h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A alias amet animi asperiores
                                delectus dicta dolore ducimus ea est harum, hic illum incidunt iure laboriosam libero
                                optio perferendis quae quam quia repellat repudiandae sapiente sed soluta totam vitae?
                                Aliquid animi aperiam commodi debitis dolorem dolorum, ea earum, esse, laudantium libero
                                omnis pariatur quibusdam quis suscipit temporibus vel voluptate.
                                <br/>
                                <br/>
                                Accusantium deserunt
                                dolorem explicabo, fugit impedit magnam molestiae natus nesciunt nostrum pariatur
                                possimus, quasi qui reprehenderit saepe sed suscipit tempore ut vel. Ipsa neque nobis
                                optio reiciendis, repellendus tempora voluptate. Ab amet aut deleniti dignissimos
                                doloribus, error exercitationem explicabo nam tempora veniam?</p>
                        </div>
                        <div className="rightebox">
                            <Form
                                layout="vertical"
                                ref={formRef}
                                labelCol={{
                                    flex: '35px',
                                }}
                                labelAlign="left"
                                labelWrap
                                wrapperCol={{
                                    flex: 5,
                                }}
                                colon={false}
                                onFinish={Login}
                            >
                                <Form.Item
                                    label="Telefon raqami"
                                    name="Telefon"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Telefon raqam kiritilishi shart !!!'

                                        },]}>
                                    <Input
                                        name="Telefon"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Ariza raqami"
                                    name="Ariza"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Ariza raqam kiritilishi shart !!!'
                                        },
                                    ]}
                                >
                                    <Input type='number' name="Ariza"/>
                                </Form.Item>

                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                    >
                                        Tekshirish
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>


                    </div>

                </div>

            </div>

        </div>
    );
}

export default Tekshirish;