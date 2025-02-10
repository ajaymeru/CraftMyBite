import React from 'react'
import "../styles/Hero.scss"

const Hero = () => {
    return (
        <div className='Hero'>
            <div className="left">
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
            <div className="right">
                <img src="/assets/CMP.png" alt="" />
            </div>
        </div>
    )
}

export default Hero