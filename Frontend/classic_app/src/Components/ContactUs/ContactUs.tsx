import React, { useState } from "react";
import "./ContactUs.css";

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    alert("Your message has been sent!");
    setFormData({ name: "", email: "", message: "" }); // Reset the form
  };

  return (
    <div className="contact-us-container">
      <div className="contact-us">
        <h1>Contact Us</h1>
        <p>If you have any questions, feel free to reach out to us via the form below or our social media.</p>

        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleInputChange}
            required
          ></textarea>
          <button type="submit" className="submit-button">
            Send Message
          </button>
        </form>

        <div className="social-media-icons">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12.075c0 5.574-4.26 10.075-9.525 10.075-5.272 0-9.525-4.501-9.525-10.075s4.26-10.075 9.525-10.075c5.265 0 9.525 4.501 9.525 10.075zm-13.5 0c0 2.845 2.2 5.075 5.025 5.075 2.9 0 5.025-2.23 5.025-5.075s-2.125-5.075-5.025-5.075c-2.825 0-5.025 2.23-5.025 5.075zm7.15 1.773h1.253v3.573h-1.253v-3.573zm1.253-2.553c.674 0 1.014-.375 1.014-.914-.004-.55-.344-.922-.991-.922-.689 0-1.01.417-1.01.922 0 .539.328.914 1.014.914z" />
            </svg>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.444 4.834c-.875.389-1.77.653-2.688.773.968-.578 1.709-1.493 2.057-2.586-.907.538-1.914.922-2.986 1.131-.854-.912-2.073-1.475-3.421-1.475-2.66 0-4.809 2.151-4.809 4.809 0 .376.043.743.128 1.095-4.002-.2-7.547-2.12-9.917-5.033-.415.712-.651 1.544-.651 2.428 0 1.672.85 3.145 2.145 4.008-.791-.025-1.537-.242-2.188-.604-.001.02-.001.043-.001.064 0 2.345 1.669 4.3 3.89 4.743-.407.109-.838.168-1.273.168-.311 0-.617-.031-.919-.089.617 1.933 2.41 3.34 4.522 3.38-1.664 1.307-3.756 2.086-6.032 2.086-.392 0-.779-.023-1.161-.068 2.151 1.38 4.706 2.184 7.44 2.184 8.927 0 13.808-7.39 13.808-13.808 0-.21-.006-.42-.017-.63.946-.683 1.765-1.542 2.418-2.52z" />
            </svg>
          </a>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.228 0h-20.456c-.639 0-1.141.502-1.141 1.141v21.718c0 .639.502 1.141 1.141 1.141h20.456c.639 0 1.141-.502 1.141-1.141v-21.718c0-.639-.502-1.141-1.141-1.141zm-13.56 20.25h-3.63v-12.75h3.63v12.75zm-1.81-14.51c-1.02 0-1.86-.84-1.86-1.86 0-1.02.84-1.86 1.86-1.86 1.02 0 1.86.84 1.86 1.86 0 1.02-.84 1.86-1.86 1.86zm12.21 14.51h-3.63v-6.75c0-1.61-.57-2.71-1.88-2.71-1.02 0-1.58.73-1.84 1.43-.1.24-.12.58-.12.92v7.16h-3.63v-12.75h3.63v1.69c1.27-.98 3.16-1.31 4.91-.72 1.78.68 2.98 2.56 2.98 5.04v7.75z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
