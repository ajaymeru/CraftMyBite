import React, { useState } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import "../styles/ContactUs.scss";

const ContactUs = () => {
  return (
    <div className="ContactUs">
      <div className="contact-container">
        
        <div className="contact-details">
          <h2>Contact Us</h2>
          <p>We’re always here to help you!</p>
          <div className="details">

            <div className="detail">
              <FaPhoneAlt className="icon" />
              <div>
                <h4>Contact Number</h4>
                <p>+91-8988988889</p>
              </div>
            </div>

            <div className="detail">
              <FaEnvelope className="icon" />
              <div>
                <h4>Email</h4>
                <p>craftmyplate@gmail.com</p>
              </div>
            </div>

            <div className="detail">
              <FaMapMarkerAlt className="icon" />
              <div>
                <h4>Address</h4>
                <p>
                  Plot No. 310, S. No. 66/3, Prashant Hills,<br />
                  Raidurg, Hyderabad<br />
                  Pincode: 500032
                </p>
              </div>
            </div>

          </div>
          <p className="extra">We’d love to hear from you!</p>
        </div>

        <div className="contact-form">
          <form>
            <fieldset>
              <legend>Get in Touch</legend>

              <div className="form-group">
                <div className="input-container">
                  <input type="text" id="name" name="name" required />
                  <label htmlFor="name">Name</label>
                </div>
              </div>

              <div className="form-group">
                <div className="input-container">
                  <input type="email" id="email" name="email" required />
                  <label htmlFor="email">Email</label>
                </div>
              </div>

              <div className="form-group">
                <div className="input-container">
                  <input type="text" id="subject" name="subject" required />
                  <label htmlFor="subject">Subject</label>
                </div>
              </div>

              <div className="form-group">
                <div className="input-container">
                  <textarea id="message" name="message" rows="4" required></textarea>
                  <label htmlFor="message">Message</label>
                </div>
              </div>

              <button type="submit">Send Message</button>
            </fieldset>
          </form>
        </div>

      </div>
    </div>
  );
};

export default ContactUs;
