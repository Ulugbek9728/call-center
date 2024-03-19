import React, {useEffect} from 'react';
import Navbar from "../componenta/navbar";
import AOS from "aos";
import "aos/dist/aos.css";
import '../style/home.scss'
import {Link} from "react-router-dom";

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
                        <div className="" >
                            <div className="title">
                                Build Your Business Modern, Faster And Reliable
                            </div>
                            <div className="text">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid beatae commodi cumque ea,
                                eaque ex excepturi expedita explicabo iusto labore libero minima minus natus necessitatibus
                                quia quis quos similique voluptas. Debitis?
                            </div>
                        </div>

                        <div className="d-flex justify-content-between kirish">
                            <a href={`https://hemis.tdtu.uz/oauth/authorize?response_type=code&client_id=4&state=auth_state&redirect_uri=https://r-office.tdtu.uz/auth`}>
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