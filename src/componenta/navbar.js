import React from 'react';
import {Link} from "react-router-dom";

import LanguageSwitcher from "./LanguageSwitcher/index.js";
import { useTranslation } from "react-i18next";
import bg from "../img/logo.png";



function Navbar(props) {

    const { t } = useTranslation();

    return (
        <div>
        <nav className="navbar">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand">
                    <img  src={bg} alt="logo"/>
                    <h2 >
                        {t("Home.logo1")} <br/> {t("Home.logo2")}
                    </h2>

                </Link>

                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <Link className="nav-link" aria-current="page" to="/"></Link>
                    </li>
                </ul>
                <LanguageSwitcher />

            </div>
        </nav>

        </div>
    );
}

export default Navbar;