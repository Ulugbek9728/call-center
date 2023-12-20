import React from 'react';
import Navbar from "../componenta/navbar";
import '../style/home.scss'

function Home(props) {
    return (
        <div className='home'>
            <div className="liner"/>

            <div className='container'>
                <div className="row">

                    <Navbar/>
                    <div className="col-6">
                        <img className='gif' src="./Consent.gif" alt=""/>
                    </div>
                    <div className="col-6 righte">
                        <div className="title">
                            Build Your Business Modern, Faster And Reliable
                        </div>
                        <div className="text">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid beatae commodi cumque ea,
                            eaque ex excepturi expedita explicabo iusto labore libero minima minus natus necessitatibus
                            quia quis quos similique voluptas. Debitis?
                        </div>
                        <a href='/operatorAdmin'>Sahifaga Kirish</a>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default Home;