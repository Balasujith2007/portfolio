import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import emailjs from '@emailjs/browser';
import { 
  FaMapMarkerAlt, FaEnvelope, FaPhone, 
  FaGithub, FaLinkedin 
} from 'react-icons/fa';
import './Contact.css';

// Initialize EmailJS with public key
if (typeof window !== 'undefined') {
  emailjs.init('hWoQqwbkmXW_v7gh6');
}

const Contact = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const formRef = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const [formData, setFormData] = useState({
    from_name: '',
    from_email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    console.log('Form data being sent:', formData);
    console.log('Service ID:', 'service_jhnpxxj');
    console.log('Template ID:', 'template_cmqge4');

    try {
      // EmailJS credentials configured
      const result = await emailjs.sendForm(
        'service_jhnpxxj',        // EmailJS Service ID
        'template_ermvgd4',       // EmailJS Template ID
        formRef.current
      );

      console.log('EmailJS result:', result);

      if (result.text === 'OK') {
        setSubmitStatus('success');
        setFormData({ from_name: '', from_email: '', subject: '', message: '' });
      }
    } catch (error) {
      console.error('Email send error:', error);
      console.error('Error details:', error.text);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  const contactInfo = [
    {
      icon: <FaMapMarkerAlt />,
      title: 'Location',
      content: 'Coimbatore, India - 641402'
    },
    {
      icon: <FaEnvelope />,
      title: 'Email',
      content: 'kit28.24bad026@gmail.com',
      link: 'mailto:kit28.24bad026@gmail.com'
    },
    {
      icon: <FaPhone />,
      title: 'Phone',
      content: '+91 7358095641',
      link: 'tel:+917358095641'
    }
  ];

  return (
    <section className="contact" id="contact">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Get In Touch</h2>

          <div className="contact-content">
            <motion.div
              className="contact-info"
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="contact-intro">
                <h3>Let's Connect</h3>
                <p>
                  I'm always open to discussing new projects, creative ideas, 
                  or opportunities to be part of your vision.
                </p>
              </div>

              {contactInfo.map((info, index) => (
                <div key={index} className="contact-item">
                  <div className="contact-icon">{info.icon}</div>
                  <div className="contact-details">
                    <h4>{info.title}</h4>
                    {info.link ? (
                      <a href={info.link}>{info.content}</a>
                    ) : (
                      <p>{info.content}</p>
                    )}
                  </div>
                </div>
              ))}

              <div className="contact-social">
                <a 
                  href="https://github.com/BalasujithGowri-11" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <FaGithub />
                </a>
                <a 
                  href="https://www.linkedin.com/in/bala-sujith-91a241335/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <FaLinkedin />
                </a>
              </div>
            </motion.div>

            <motion.form
              ref={formRef}
              className="contact-form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <div className="form-group">
                <input
                  type="text"
                  name="from_name"
                  placeholder="Your Name"
                  value={formData.from_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="email"
                  name="from_email"
                  placeholder="Your Email"
                  value={formData.from_email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              {submitStatus === 'success' && (
                <div className="status-message success">
                  ✓ Message sent successfully! I'll get back to you soon.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="status-message error">
                  ✗ Failed to send message. Please try again or email me directly.
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
