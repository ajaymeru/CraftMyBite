import React from 'react'
import Slider from 'react-slick'
import "../styles/Testimonials.scss"
import testimonialsData from "../testimonials.json"

const Testimonials = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        cssEase: "cubic-bezier(0.645, 0.045, 0.355, 1.000)",
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    }

    return (
        <div className='Testimonials'>
            <h2>What our customers say</h2>
            
            <Slider {...settings} className="cards">
                {testimonialsData.testimonials.map((testimonial, index) => (
                    <div className="testimonial-card" key={index}>
                        <img src={testimonial.image} alt={testimonial.name} />
                        <h4>{testimonial.name}</h4>
                        <p className="location">{testimonial.location}</p>
                        <p className="review">"{testimonial.review}"</p>
                        <p className="rating">⭐ {testimonial.rating}</p>
                    </div>
                ))}
            </Slider>
        </div>
    )
}

export default Testimonials