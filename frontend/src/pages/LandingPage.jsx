import React from 'react'
import "../styles/LandingPage.scss"
import Hero from '../components/Hero'
import Categories from '../components/Categories'
import Testimonials from '../components/Testimonials'
import ContactUs from '../components/ContactUs'

const LandingPage = () => {
    return (
        <div className='LandingPage'>
            <Hero />
            <Categories />
            <Testimonials />
            <ContactUs />
        </div>
    )
}

export default LandingPage