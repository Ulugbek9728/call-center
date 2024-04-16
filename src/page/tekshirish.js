import React, {useEffect, useState} from 'react';
import Navbar from "../componenta/navbar";
import "../style/tekshirish.scss"
import {Form, Input, Drawer,} from 'antd';
import axios from "axios";
import {ApiName} from "../APIname";
import {toast} from "react-toastify";
import AOS from "aos";
import {ReactTyped} from "react-typed";
import {useTranslation} from "react-i18next";



function Tekshirish(props) {
    const { t } = useTranslation();
    const formRef = React.useRef(null);

    const [messagee, setMessage] = useState('');
    const [sucsessText, setSucsessText] = useState('');
    const [open, setOpen] = useState(false);
    const [response, setResponse] = useState({
        exchangesApp: []
    });

    useEffect(() => {
        AOS.init()

    });

    const onClose = () => {
        setOpen(false);
    };

    function Login(values) {
        const requestData = {
            phone: values?.Telefon,
            application_number: values?.Ariza
        };
        axios.get(`${ApiName}/api/application/check`, {
            params: requestData
        }).then((response) => {
            console.log(response.data)
            if (response.data.isSuccess === true) {
                if (response.data.data.status === 'FINISHED') {
                    setOpen(true);
                    setResponse(response.data?.data)
                } else if (response.data.data.status === 'PROGRESS') {
                    setSucsessText("Murojatingiz ko'rib chiqilmoqda")
                } else {
                    setSucsessText("Murojatingiz kutish holatida")
                }

            } else {
                setMessage(response.data.message)

            }


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
                    <hr/>
                    <div className="lin"/>

                    <div className="tekshirish"
                         data-aos="zoom-in"
                         data-aos-duration="700"
                         data-aos-easing="ease-in-sine">
                        <div className="left">
                            <h2>{t("Home.ViewApplication")}</h2>

                            <ReactTyped className='text'
                                        strings={[t("Home.ViewApplicationText")]}
                                        typeSpeed={50}/>
                        </div>
                        <div className="rightebox">
                            <h2 className='text-center mb-5'>{t("Home.CheckApplication")}</h2>
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
                                    label={t("Home.PhoneNumber")}
                                    name="Telefon"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("Home.PhoneNumberCheck")

                                        },]}>
                                    <Input
                                        name="Telefon"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={t("Home.ApplicationNumber")}
                                    name="Ariza"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("Home.ApplicationNumberCheck")
                                        },
                                    ]}
                                >
                                    <Input type='number' name="Ariza"/>
                                </Form.Item>

                                <Form.Item>
                                    <button  className='button mt-4 px-5'>
                                        {t("Home.CheckButton")}
                                    </button>
                                </Form.Item>
                            </Form>

                        </div>


                    </div>
                    <Drawer className='z-3' title="Murojat natijasi" size='large' onClose={onClose} open={open}>
                        <h6>"{response?.exchangesApp[0]?.department?.name}" dan kelgan ma'lumotlar</h6>
                        <hr/>
                        <h6>Izoh</h6>
                        <p>{response?.exchangesApp[0]?.description}</p>

                        <h6>Fayillar ro'yxati</h6>
                        <ol>
                            {response?.files && response?.files.map((item, index) => {
                                return <li key={index}>
                                    <a href={item.file.url}
                                       target={"_blank"}>{item.file.filename}</a>
                                </li>
                            })}

                        </ol>

                    </Drawer>

                </div>

            </div>

        </div>
    );
}

export default Tekshirish;