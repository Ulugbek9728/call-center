import React, {useEffect, useRef, useState} from 'react';
import {
    Button,
    DatePicker,
    Divider,
    Empty,
    Form,
    Input,
    Modal,
    Popconfirm,
    Select,
    Skeleton,
    Space,
    Upload
} from "antd";
import axios from "axios";
import {ApiName} from "../APIname";
import {toast} from "react-toastify";
import dayjs from "dayjs";
import {ArrowRightOutlined, CaretRightOutlined, PlusOutlined, UploadOutlined} from "@ant-design/icons";

function TypeService(props) {
    const [fulInfo] = useState(JSON.parse(localStorage.getItem("myCat")));

    const formRef = useRef(null);
    const [form] = Form.useForm();
    const [form1] = Form.useForm();

    const [batafsil, setBatafsil] = useState(false);

    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [messagee, setMessage] = useState('');
    const [sucsessText, setSucsessText] = useState('');
    const [edite, setEdite] = useState(false);
    const [editeServis, setEditeServis] = useState(null);

    const [Department, setDepartment] = useState([]);
    const [ariza, setAriza] = useState({});
    const [items, setItems] = useState(null);

    function getTyupeAriza() {
        axios.get(`${ApiName}/api/classifier`, {
            headers: {"Authorization": `Bearer ${fulInfo.accessToken}`}
        }).then((response) => {
            // setItems(response.data)
            setItems(response?.data[0]?.items)
        }).catch((error) => {
            console.log(error)
        });
    }

    function DepartmenGet() {
        axios.get(`https://api-id.tdtu.uz/api/department?structureCode=ALL`, {}).then((response) => {
            setDepartment(response.data);
        }).catch((error) => {
            console.log(error)
        });
    }

    useEffect(() => {
        getTyupeAriza()
        DepartmenGet()
        notify();
        setMessage('')
        setSucsessText('')
    }, [messagee, sucsessText,]);

    const handleOk = (value) => {
        console.log(value)
        if (edite === true) {
            // axios.put(`${ApiName}/api/application/${ariza?.id}`, ariza, {
            //     headers: {"Authorization": `Bearer ${fulInfo.accessToken}`}
            // }).then((response) => {
            //     console.log(response)
            //     form.resetFields()
            //     setOpen(false);
            //     setSucsessText("Murojat o'zgardi")
            //     setAriza({
            //         fullName: '',
            //         applicationType: 'Ariza',
            //         phone: '',
            //         expDate: '',
            //         description: '',
            //         toDepartment: {
            //             id: '',
            //             nam: '',
            //             code: "",
            //             structureType: {
            //                 code: "",
            //                 name: ""
            //             }
            //         },
            //         files: []
            //     })
            //     setEdite(false)
            //     if (response?.data?.isSuccess === true) {
            //         setSucsessText("Murojat o'zgardi")
            //     } else {
            //         setMessage(response?.data?.message)
            //     }
            // }).catch((error) => {
            //     console.log(error)
            //     setMessage(error?.response?.data?.message)
            // })
        } else {
            axios.post(`${ApiName}/api/application/create/in-place`, {
                fullName:value?.fullName,
                nameInfo:JSON.stringify(value?.nameInfo),
                phone:value?.phone,
                typeOfService:value?.typeOfService,
            }, {
                headers: {"Authorization": `Bearer ${fulInfo.accessToken}`}
            }).then((response) => {
                console.log(response)
                if (response.data.message === "Success") {
                    form.resetFields()
                    setOpen(false);
                    setSucsessText('Murojat saqlandi')
                }
            }).catch((error) => {
                console.log(error)
                setMessage('Creat error')
            })
        }
    };

    const handleOk1 = (value) => {
        console.log(value)
        if (edite===true){
            axios.put(`${ApiName}/api/classifier/${editeServis?.id}`, {
                name:value?.TypeServic
                },
                {
                        headers: {"Authorization": `Bearer ${fulInfo.accessToken}`}
                    })
                .then((response) => {
                        console.log(response)
                    setEditeServis(null)
                    setEdite(false)
                    form1.resetFields()
                    setSucsessText("Malumot o'zgardi")

                }).catch((error) => {
                        console.log(error)
                setMessage('Edite error')

                // setMessage(error?.response?.data?.message)
                    })
        }
        else {
            axios.post(`${ApiName}/api/classifier/single`, {
                id:1,
                item:{
                    name:value?.TypeServic
                }
            }, {
                headers: {"Authorization": `Bearer ${fulInfo.accessToken}`}
            }).then((response) => {
                if (response?.data?.isSuccess ===true){
                    setSucsessText("Malumot qo'shildi")
                    form1.resetFields()
                }
            }).catch((error) => {
                console.log(error)
                setMessage('Delete error')

            })
        }

    }

    const DeleteServise = (e) => {
        axios.delete(`${ApiName}/api/classifier/${e}`, {
            headers: {"Authorization": `Bearer ${fulInfo.accessToken}`}
        }).then((res) => {
            console.log(res)

            if (res.status === 204) {
                setSucsessText("Murojat o'chirildi")
            } else setMessage(res.data.message)
        }).catch((error) => {
            console.log(error)
            setMessage("O'chirishda xatolik")
        })
    };

    function notify() {
        if (sucsessText !== '') {
            toast.success(sucsessText)
        }
        if (messagee !== '') {
            toast.error(messagee)
        }
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Space>
                    <Select
                        placeholder='Statusini tanlang'
                        style={{
                            width: 200,
                        }}
                        options={[
                            {
                                value: '',
                                label: 'Hammasi',
                            },
                            {
                                value: 'PROGRESS',
                                label: 'Jarayonda',
                            },
                            {
                                value: 'FINISHED',
                                label: 'Tugatilgan',
                            },
                            {
                                value: "COMMITTED",
                                label: 'Yaratilgan',
                            },
                        ]}
                    />
                </Space>
                <div className="d-flex">
                    <button type="button" className="button1 mx-2"
                            onClick={() => {
                                setOpen1(true)
                            }}>
                        <span className="button__text">Xizmat turini yaratish</span>
                        <span className="button__icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" strokeWidth="2"
                                 strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" height="24"
                                 fill="none" className="svg">
                                <line y2="19" y1="5" x2="12" x1="12"/>
                                <line y2="12" y1="12" x2="19" x1="5"/>
                            </svg>
                        </span>
                    </button>
                    <button type="button" className="button1"
                            onClick={() => {
                                setOpen(true)
                            }}>
                        <span className="button__text">Joyida hal qilingan murojat yaratish</span>
                        <span className="button__icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" strokeWidth="2"
                                 strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" height="24"
                                 fill="none" className="svg">
                                <line y2="19" y1="5" x2="12" x1="12"/>
                                <line y2="12" y1="12" x2="19" x1="5"/>
                            </svg>
                        </span>
                    </button>
                </div>
            </div>
            <Modal className={'modalAddNew1'}
                   title={batafsil ? "Murojat" : "Murojat yaratish"} open={open} footer={null}
                   onCancel={() => {
                       setOpen(false);
                       setBatafsil(false)
                       setEdite(false)
                   }}>
                <div className='d-flex justify-content-between'>
                    {batafsil ? "" : <div className={`border w-100 p-3 mx-3`}>
                        <Form
                            form={form} layout="vertical" ref={formRef} colon={false}
                            onFinish={handleOk}
                            // fields={[
                            //     {
                            //         name: "MurojatchiniBo'limi",
                            //         value: !ariza.nameInfo || ariza.nameInfo === "" ? [] : JSON.parse(ariza.nameInfo)?.map(i => ` ${i}`)
                            //     },
                            //     {
                            //         name: "FISH",
                            //         value: ariza?.fullName
                            //     },
                            //     {
                            //         name: "Tel",
                            //         value: ariza?.phone
                            //     },
                            //     {
                            //         name: "MurojatYuboriladigan",
                            //         value: ariza?.toDepartment?.name
                            //     },
                            //     {
                            //         name: "xujjat",
                            //         value: ariza?.applicationType
                            //     },
                            //     {
                            //         name: "text",
                            //         value: ariza?.description
                            //     },
                            //     {
                            //         name: "MurojatchiniDate",
                            //         value: edite || ariza.expDate ? dayjs(new Date(ariza.expDate)) : ariza.expDate
                            //     },
                            // ]}
                        >
                            <Form.Item
                                label="Murojatchini Kafedra, Bo'lim, Markaz / Fakultet, Guruh"
                                name="nameInfo"
                                rules={[{
                                    required: true,
                                    message: 'Malumot kiritilishi shart !!!'
                                },]}>
                                <Select
                                    name="nameInfo" mode="tags"
                                    placeholder="Markaz / Bo'lim / Fakultet / Kafedra / Guruh"
                                    filterOption={(input, option) => (option?.label?.toLowerCase() ?? '').startsWith(input.toLowerCase())}
                                    filterSort={(optionA, optionB) =>
                                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                                    options={Department && Department.map((item, index) => ({
                                        value: item.name,
                                        label: item.name
                                    }))}
                                />
                            </Form.Item>

                            <Form.Item label="Murojatchi Familya Ism Sharif" name="fullName"
                                       rules={[{
                                           required: true,
                                           message: 'Malumot kiritilishi shart !!!'
                                       },]}>
                                <Input type="text" name="fullName" placeholder="F.I.SH"/>
                            </Form.Item>

                            <Form.Item label="Murojatchi Telefon raqami" name="phone"
                                       rules={[
                                           {
                                               required: true,
                                               message: 'Malumot kiritilishi shart !!!'

                                           },]}>
                                <Input type="text" placeholder="+998(**) *** ** **" name="phone"/>
                            </Form.Item>
                            <Form.Item label="Xizmat turi" name="typeOfService"
                                       rules={[{required: true, message: 'Malumot kiritilishi shart !!!'},]}>
                                <Select
                                    name='typeOfService'
                                    placeholder="Joyida xal qilingan xizmat turini tanlang"
                                    options={items?.map((item) => ({
                                        label: item?.name,
                                        value: item?.id,
                                    }))}
                                />
                            </Form.Item>


                            <Form.Item>
                                <button className='button2' type='submit'>
                                    <div className="svg-wrapper-1">
                                        <div className="svg-wrapper">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                width="24"
                                                height="24"
                                            >
                                                <path fill="none" d="M0 0h24v24H0z"></path>
                                                <path
                                                    fill="currentColor"
                                                    d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                                                ></path>
                                            </svg>
                                        </div>
                                    </div>
                                    <span>Ma'lumotni yuborish</span>
                                </button>
                            </Form.Item>
                        </Form>
                    </div>}
                </div>
            </Modal>
            <Modal className={'modalAddNew1'}
                   title={"Xizmat turini yaratish"}
                   open={open1}
                   onOk={()=>setOpen1(false)}
                   onCancel={() => {
                       setOpen1(false);
                       setEdite(false)
                       setEditeServis(null)
                       form1.resetFields()
                   }}>
                <div className='d-flex justify-content-between'>
                    <div className={`border w-100 p-3 mx-3`}>
                        <Form
                            form={form1} layout="vertical" ref={formRef} colon={false}
                            onFinish={handleOk1}
                            fields={[
                                {
                                    name: "TypeServic",
                                    value: edite? editeServis?.name : ''
                                },
                            ]}
                        >
                            <Form.Item label="Xizmat turi nomi" name="TypeServic"
                                       rules={[{required: true, message: 'Malumot kiritilishi shart !!!'},]}>
                                <Input type="text" name="TypeServic" placeholder="Xizmat turi nomini yozing"/>
                            </Form.Item>
                            <Form.Item>
                                <button className={`btn ${edite ? 'btn-warning':'btn-success'} `} type='submit'>
                                    <span>
                                        {edite? "O'zgartirish":"Qo'shish"}
                                    </span>
                                </button>
                            </Form.Item>
                        </Form>
                        {
                            items?.map((item, index) => (
                                <div key={index}
                                     className="border-bottom d-flex align-items-center justify-content-between">
                                    <span>{item?.name}</span>
                                    <div className="d-flex justify-content-end">
                                        <Popconfirm
                                            title="Xizmat turini o'chirish"
                                            description="Xizmat turini o'chirishni tasdiqlaysizmi?"
                                            onConfirm={(e) => DeleteServise(item.id)}
                                            okText="Ha" cancelText="Yo'q"
                                        >
                                            <button className="deletSmoll mx-4">
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

                                            {/*<button className='btn btn-danger'><DeleteOutlined/></button>*/}
                                        </Popconfirm>
                                        <button className="editBtnSmoll "
                                                onClick={() => {
                                                    setEdite(true)
                                                    setEditeServis(item)
                                                }}>
                                            <svg height="1em" viewBox="0 0 512 512">
                                                <path
                                                    d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"
                                                ></path>
                                            </svg>
                                        </button>
                                    </div>

                                </div>
                            ))
                        }
                    </div>
                </div>

            </Modal>
        </div>
    );
}

export default TypeService;