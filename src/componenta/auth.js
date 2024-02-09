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
            // console.log(response.data?.data?.roles[0])
            // console.log(response.data)
            if (response.data.isSuccess === true) {
                localStorage.setItem("myCat", JSON.stringify(response.data.data));
                if (response.data?.data?.roles[0]==='ROLE_OPERATOR'){
                    navigate("/operator")
                }
                if (response.data?.data?.roles[0]==='ROLE_ADMIN'){
                    navigate("/adminAll")
                }
                // navigate("/admin")
            }
            else {
                navigate("/")

            }
        }).catch((error) => {
            console.log(error);

        })
    }
    return (
        <div>

        </div>
    );
}

export default Auth;