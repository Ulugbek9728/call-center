import React from 'react';
import "../style/loading.scss"
import bg from "../img/logo.png";


function Loading(props) {
    return (
        <div className="loding">
            <div className="ring">
                <img src={bg} alt="logo"/>
                <span></span>
            </div>
        </div>
    );
}

export default Loading;