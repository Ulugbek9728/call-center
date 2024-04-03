import React, {useEffect} from 'react';
import Navbar from "../componenta/navbar";
import AOS from "aos";
import "aos/dist/aos.css";
import '../style/home.scss'
import {Link} from "react-router-dom";
import {ApiName} from "../APIname";

function Home(props) {
    useEffect(() => {
        AOS.init()
    });

    return (
        <div className='home'>

            <div className='container'>
                <div className="row">

                    <Navbar/>

                    <div className="col-lg-6 col-md-5 col-12">
                        <img className='gif' src="./Consent.gif" alt=""/>
                    </div>
                    <div className="col-lg-6 col-md-7 col-12 righte"
                         data-aos="zoom-in"
                         data-aos-duration="700"
                         data-aos-easing="ease-in-sine">
                        <div className="">
                            <div className="title">
                                Islom Karimov nomidagi
                                Toshkent Davlat Texnika Universiteti Registrator bo‘limi platformasi
                            </div>
                            <div className="text">
                                Akademik faoliyat va registrator bo‘limi universitetning asosiy xizmatlarini talabalarga bir joydan turib tezkor, samarali va shaffof tarzda amalga oshirishdan iborat.
                            </div>
                        </div>

                        <div className="d-flex justify-content-between kirish">
                                                                                                                                  {/*${ApiName}*/}
                            <a href={`https://hemis.tdtu.uz/oauth/authorize?response_type=code&client_id=4&state=auth_state&redirect_uri=http://localhost:3000/auth`}>
                                Sahifaga Kirish</a>
                            <Link to='/tekshirish'>
                                Ariza holatini tekshirish</Link>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Home;