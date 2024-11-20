import React, {useRef, useState} from 'react';
import {DatePicker, Form} from "antd";
import axios from "axios";
import {ApiName} from "../APIname";

function ExelInplase(props) {
    const [fulInfo] = useState(JSON.parse(localStorage.getItem("myCat")));

    const formRef = useRef(null);
    const [form] = Form.useForm();
    const [DateListe, setDateListe] = useState(['', '']);

    const onChange = () => {
        axios.get(`${ApiName}/api/application/in-place/get-as-excel`, {
            headers: {"Authorization": `Bearer ${fulInfo?.accessToken}`},
            params: {
                from: DateListe[0],
                to: DateListe[1],
            },
            responseType: 'blob'
        }).then((response) => {
            const link = document.createElement('a');
            const blob = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
            const url = URL.createObjectURL(blob);

            link.href = url;
            link.setAttribute('download', `arizalar_${DateListe[0]}_${DateListe[1]}.xlsx`);
            document.body.appendChild(link);
            link.click();
        }).catch((error) => {
            console.log(error)
        });
    };
    return (
        <div>
            <Form form={form} layout="vertical" ref={formRef} colon={false}
                  onFinish={onChange}
            >
                <Form.Item label="Murojaatlarni yuklash mudatini belgilang"
                           name="MurojatYuklash"
                           rules={[{
                               required: true,
                               message: 'Malumot kiritilishi shart !!!'
                           },]}>
                    <DatePicker.RangePicker
                        name="MurojatYuklash" format="YYYY-MM-DD" onChange={(value, dateString)=> {
                        setDateListe(dateString)
                    }}/>
                </Form.Item>
                <Form.Item>
                    <button className="btn btn-success" type="submit">
                        <span className="button__text">Ma'lumotni yuklash</span>
                    </button>
                </Form.Item>

            </Form>

        </div>
    );
}

export default ExelInplase;