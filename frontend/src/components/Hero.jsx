import React, { useEffect } from 'react'
import "../styles/Hero.scss"
import AOS from 'aos';
import 'aos/dist/aos.css';

const Hero = () => {
    useEffect(() => {
        AOS.init();
    }, [])
    return (
        <div className='Hero'>
            <div className="left"
                data-aos="fade-right"
                data-aos-duration="1000"
                data-aos-delay="300" 
                data-aos-easing="ease-in-sine"
            >
                <div className="head">
                    <p>Currently Serving in Hyderabad</p>
                    <h3>INDIA'S FIRST FOOD CATERING APP</h3>
                </div>
                <div className="mobile-show">
                    <img src="/assets/CMP.png" alt="" />
                </div>
                <div className="content">
                    <p>Order food from your favorite restaurants and get it delivered to your doorstep. Enjoy the best of food from a wide variety of cuisines. Get the best deals and discounts on your favorite food.Order now and get a chance to win exciting prizes.</p>

                    <button>Order Now</button>
                </div>
            </div>
            <div className="right"
                data-aos="fade-left"
                 data-aos-duration="1000"
                 data-aos-delay="300" 
                data-aos-easing="ease-in-sine"
            >
                <img src="/assets/CMP.png" alt="" />
            </div>
        </div>
    )
}

export default Hero