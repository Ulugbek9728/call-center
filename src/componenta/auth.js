import React from 'react';
import {useNavigate, useSearchParams} from "react-router-dom";
import axios from "axios";
import {ApiName} from "../APIname";

function Auth(props) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

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
            if (response.data.isSuccess === true) {
                localStorage.setItem("myCat", JSON.stringify(response.data.data));
                navigate("/admin")
            }
        }).catch((error) => {
            console.log(error);
            navigate("/admin")
        })
    }
    return (
        <div>

        </div>
    );
}

export default Auth;