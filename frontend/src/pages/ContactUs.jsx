import React, { useState } from "react";
import "./AboutContactStyles.css";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: false,
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    // For now, we'll just simulate a successful submission

    setFormStatus({
      submitted: true,
      error: false,
      message: "Thank you for your message! We will get back to you soon.",
    });

    // Reset form after submission
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Contact Us</h1>
        <p>Have questions or feedback? We'd love to hear from you.</p>
      </div>

      <div className="content-section">
        <div className="contact-grid">
          <div className="contact-info">
            <h2>Get In Touch</h2>
            <p>
              We're here to help and answer any questions you might have. We
              look forward to hearing from you.
            </p>

            <div className="contact-method">
              <i className="fas fa-envelope"></i>
              <div>
                <h3>Email Us</h3>
                <p>support@digitaltypeassessment.com</p>
              </div>
            </div>

            <div className="contact-method">
              <i className="fas fa-phone-alt"></i>
              <div>
                <h3>Call Us</h3>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>

            <div className="contact-method">
              <i className="fas fa-map-marker-alt"></i>
              <div>
                <h3>Visit Us</h3>
                <p>
                  123 Tech Plaza, Suite 400
                  <br />
                  San Francisco, CA 94105
                </p>
              </div>
            </div>

            <div className="social-links">
              <h3>Connect With Us</h3>
              <div className="social-icons">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            <h2>Send Us a Message</h2>
            {formStatus.submitted ? (
              <div className="form-success-message">{formStatus.message}</div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Your Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Your Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="submit-btn">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
