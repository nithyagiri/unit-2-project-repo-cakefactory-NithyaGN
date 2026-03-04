import { useState } from "react";
import {useNavigate} from "react-router";
import { FaFacebook } from "react-icons/fa";
import { MdLocationOn, MdPhone, MdEmail, MdAccessTime } from "react-icons/md";
import Select from "../../forms/input/Select.jsx";
import Input from "../../forms/input/Input.jsx";
import Button from "../../forms/input/Button.jsx";
import "./contact.css";


const ContactPage = () => {
  const navigate =useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    reason: "",
    message: ""
  });

  const [errors, setErrors] = useState({});

  // Handle changes to form inputs and clear existing error for that field
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); 
  };

  // Validating form fields before submission
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(formData.email)) newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else {
      const phonePattern = /^[0-9]{10}$/;
      if (!phonePattern.test(formData.phone)) newErrors.phone = "Enter a valid 10-digit phone number";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
       // Display errors if validation fails
      setErrors(validationErrors);
    } else {
       // Clear errors and reset form after successful submission
      setErrors({});
      setFormData({ name: "", email: "", phone: "", reason: "", message: "" });
    }
  };

  return (
    <main className="contact-page-full">
      <h1>Contact Us</h1>

      <section className="contact-columns">
        {/* Left column: Contact info + Map */}
        <div className="contact-left">
          <div className="contact-info">
            <p><MdLocationOn size={20} /> <strong>Address:</strong> 2027 Edwards St, St. Louis, MO 63110</p>
            <p><MdPhone size={20} /> <strong>Phone:</strong> 245-666-1234</p>
            <p><MdEmail size={20} /> <strong>Email:</strong> mailtocakefactory@gmail.com</p>
            <p><MdAccessTime size={20} /> <strong>Hours:</strong> Mon-Fri: 6:00 AM-5:00 PM | Sat: 8:00 AM-5:00 PM | Sun: Closed</p>
            <p><FaFacebook size={20} /> <strong>Facebook:</strong> <a href="https://www.facebook.com/profile.php?id=61583264956563">Facebook Page</a></p>
          </div>
          <div className="map-container">
            <h1>Google maps direction:</h1>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2190.0000000000005!2d‑90.275083071945!3d38.616329365603!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87d8b46f1cbf24f1%3A0x0000000000000000!2s2027+Edwards+St%2C+St.+Louis%2C+MO+63110!5e0!3m2!1sen!2sus!4v1700000000000"
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map"
            ></iframe>
          </div>
        </div>

        {/* Right column: Form */}
        <div className="contact-right">
          <h2>Send Us a Message</h2>
          <form onSubmit={handleSubmit}>
  <table>
    <tbody>
      <tr>
        <td><label>Name:</label></td>
        <td>
          <Input
            label=""
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder="Enter your name"
            type="text"
          />
          {errors.name && <div className="error">{errors.name}</div>}
        </td>
      </tr>
      <tr>
        <td><label>Email:</label></td>
        <td>
          <Input
            label=""
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            type="email"
            placeholder="you@example.com"
          />
          {errors.email && <div className="error">{errors.email}</div>}
        </td>
      </tr>
      <tr>
        <td><label>Phone:</label></td>
        <td>
          <Input
            label=""
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            type="tel"
            placeholder="1234567890"
          />
          {errors.phone && <div className="error">{errors.phone}</div>}
        </td>
      </tr>
      <tr>
        <td><label>Reason for Contact:</label></td>
        <td>
          <Select
            label=""
            value={formData.reason}
            onChange={(e) =>
              setFormData({ ...formData, reason: e.target.value })
            }
            options={[
              { label: "Place an order", value: "place an order" },
              { label: "Questions about order", value: "questions about order" },
              { label: "Wholesale inquiry", value: "wholesale inquiry" },
              { label: "Speak to management", value: "speak to management" },
              { label: "Other", value: "other" }
            ]}
          />
        </td>
      </tr>
      <tr>
        <td><label>Message:</label></td>
        <td>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
            ></textarea>
        </td>
      </tr>
      <tr>
        <td colSpan="2" style={{ textAlign: "center" }}>
          <Button label="Submit" className="common-btn" type="submit" />
          
        </td>
      </tr>

    </tbody>
  </table>
</form>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;