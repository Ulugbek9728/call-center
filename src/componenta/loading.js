import React from 'react';
import "../style/loading.scss"

function Loading(props) {
    return (
        <div className="loding">
            <div className="ring">
                <img src="/logo.png" alt=""/>
                <span></span>
            </div>
        </div>
    );
}

export default Loading;