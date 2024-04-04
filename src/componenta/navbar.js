import React from 'react';
import {Link} from "react-router-dom";

function Navbar(props) {


    return (
        <nav className="navbar navbar-expand-md navbar-light">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand">
                    <img  src="./logo.png" alt=""/>
                </Link>

                <button className="navbar-toggler" data-toggle="collapse" data-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" aria-current="page" to="/">Bosh sahifa</Link>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Menu1</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Menu2</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Menu3</a>
                        </li>

                    </ul>
                    <div className="d-flex">
                            <a href='#' className="btn btn-outline-success" type="submit">+998(94) 222-21-13</a>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;