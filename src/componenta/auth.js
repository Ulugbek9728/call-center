import React, {useEffect, useState} from 'react';
import {useNavigate, useSearchParams} from "react-router-dom";
import axios from "axios";
import {ApiName} from "../APIname";
import {toast} from "react-toastify";
import Navbar from "./navbar";

function Auth(props) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState('');
    const [sucsessText, setSucsessText] = useState('');
    window.onload = (event) => {
        getEmploee()
    };
    function getEmploee() {
        axios.get(`${ApiName}/api/auth/login`, {
            params: {
                code: searchParams.get('code'),
                state: searchParams.get('state')
            }
        }).then((response) => {
            // console.log(response.data?.data?.roles[0])
            console.log(response.data)
            if (response.data.isSuccess === true) {
                localStorage.setItem("myCat", JSON.stringify(response.data.data));
                if (response.data?.data?.roles[0]==='ROLE_OPERATOR'){
                    navigate("/operator")
                }
                if (response.data?.data?.roles[0]==='ROLE_ADMIN'){
                    navigate("/adminAll")
                }
            }
            else {

                setMessage(response.data.message)

            }
        }).catch((error) => {
            console.log(error);

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
        <div className="home">
            <div className="container">
                <div className="row d-flex align-items-center justify-content-center">
                    <Navbar/>

                    <img className='w-50' src="./404error1.svg" alt=""/>
                </div>

            </div>
        </div>


    );
}

export default Auth;