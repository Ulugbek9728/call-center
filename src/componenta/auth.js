import React, {useEffect, useState} from 'react';
import {useNavigate, useSearchParams} from "react-router-dom";
import axios from "axios";
import {ApiName} from "../APIname";
import {toast} from "react-toastify";
import Navbar from "./navbar";
import Loading from "./loading";

function Auth(props) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState('');
    const [sucsessText, setSucsessText] = useState('');

    const [loading, setLoading] = useState(false);
    const [login, setLogin] = useState(false);

    useEffect(() => {

            getEmploee()

    }, []);
    function getEmploee() {
        setLoading(true)
        axios.get(`${ApiName}/api/auth/login`, {
            params: {
                code: searchParams.get('code'),
                state: searchParams.get('state')
            }
        }).then((response) => {
            if (response.data.isSuccess === true) {
                setLoading(false)
                setLogin(true)
                localStorage.setItem("myCat", JSON.stringify(response.data.data));
                if (response.data?.data?.roles[0]==='ROLE_OPERATOR'){
                    navigate("/operator/addFile")
                }
                if (response.data?.data?.roles[0]==='ROLE_ADMIN'){
                    navigate("/adminAll/userAdd")
                }
                if (response.data?.data?.roles[0]==='ROLE_DEPARTMENT'){
                    navigate("/department/addFileDepartment")
                }
            }
            else {
                setLoading(false)
                setMessage(response.data.message)
            }
        }).catch((error) => {
            console.log(error);
            setLoading(false)
            setMessage("Serverda o'zgartirish olib borilmoqda")

        })
    }


    useEffect(() => {
        setMessage('')
        setSucsessText('')
        notify();
    }, [message, sucsessText,]);

    function notify() {
        if (sucsessText !== '') {
            toast.success(sucsessText)
        }
        if (message !== '') {
            toast.error(message)
        }
    }

    return (
        <>
            {loading===true ? <Loading/> :  <div className="home">
                <div className="container">
                    <div className="row d-flex align-items-center justify-content-center">
                        <Navbar/>

                        <img className='w-50' src="./404error1.svg" alt=""/>
                    </div>

                </div>
            </div>}

        </>

    );
}

export default Auth;