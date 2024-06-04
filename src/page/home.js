import React, {useEffect, useState} from 'react';
import Navbar from "../componenta/navbar";
import AOS from "aos";
import "aos/dist/aos.css";
import '../style/home.scss'
import {Link} from "react-router-dom";
import {ApiName} from "../APIname";
import {ReactTyped} from "react-typed";
import {useTranslation} from "react-i18next";


function Home(props) {
    useEffect(() => {
        AOS.init()

    });
    const { t } = useTranslation();


    return (
        <div className='home'>

            <div className='container'>
                <div className="row">


                    <Navbar/>
                    <hr/>
                    <div className="lin"/>
                    <div className="col-lg-6 col-md-5 col-12">
                        <img className='gif' src="./Consent.gif" alt="gif"/>
                    </div>
                    <div className="col-lg-6 col-md-7 col-12 righte"
                         data-aos="zoom-in"
                         data-aos-duration="700"
                         data-aos-easing="ease-in-sine">
                        <div className="">
                            <h1 className="title">
                                {t("Home.DepartmentName")}

                            </h1>
                            <ReactTyped className='text'
                                        strings={[t('Home.Departmenttext')]}
                                        typeSpeed={50}/>
                        </div>

                        <div className="d-flex justify-content-between kirish">
                            {/*/!*${ApiName}*!/  http://localhost:3000/*/}
                            <a className='button'
                               href={`https://hemis.tdtu.uz/oauth/authorize?response_type=code&client_id=4&state=auth_state&redirect_uri=${ApiName}/auth`}>
                                {t("Home.EnterPage")}
                            </a>
                            <Link className='button' to='/tekshirish'>
                                {t("Home.CheckApplication")}
                            </Link>
                        </div>

                    </div>
                </div>

            </div>

        </div>
    );
}

export default Home;