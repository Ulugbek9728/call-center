import React, {useEffect, useState} from 'react';
import {useNavigate, useSearchParams} from "react-router-dom";
import axios from "axios";
import {ApiName} from "../APIname";
import {toast} from "react-toastify";
import Navbar from "./navbar";
import Loading from "./loading";
import bg from "../img/404error1.svg";


function Auth(props) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState('');
    const [sucsessText, setSucsessText] = useState('');

    const [loading, setLoading] = useState(false);

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
                localStorage.setItem("myCat", JSON.stringify(response.data.data));
                console.log(response.data.data)
                if (response.data?.data?.currentRole === 'ROLE_OPERATOR') {
                    navigate("/operator/TypeService")
                }
                if (response.data?.data?.currentRole === 'ROLE_RECTOR') {
                    navigate("/adminRector/getappeals")
                }
                if (response.data?.data?.currentRole === 'ROLE_ADMIN') {
                    navigate("/adminAll/userAdd")
                }
                if (response.data?.data?.currentRole === 'ROLE_DEPARTMENT') {
                    navigate("/department/addFileDepartment")
                }
            } else {
                setLoading(false)
                setMessage(response.data.message)
            }
        }).catch((error) => {
            console.log(error);
            setLoading(false)

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
            {loading === true ? <Loading/> : <div className="home">
                <div className="container">
                    <div className="row d-flex align-items-center justify-content-center">
                        <Navbar/>

                        <img className='w-50' src={bg} alt='gif'/>
                    </div>

                </div>
            </div>}

        </>

    );
}

export default Auth;