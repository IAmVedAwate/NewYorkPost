import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState(null);
  const [message2, setMessage2] = useState(null);
  const [termsChecked, settermsChecked] = useState(false);
  const navigate = useNavigate();

  // Handle form data changes
  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Toggle terms and conditions checkbox
  const toggleTerms = () => {
    settermsChecked(!termsChecked);
  };

  // Handle form submission
  const onSubmit = async e => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      try {
        const res = await axios.post('http://localhost:5000/api/auth/signup', formData);
        setMessage(res.data.msg);
        setMessage2(res.data.token);
        alert(res.data.msg);
        localStorage.setItem('token', res.data.token);
        navigate('/posts');
      } catch (err) {
        setMessage(err.response.data.msg);
      }
    }
  };

  return (
    <>
      {message2 && <div style={{ position: "absolute", marginTop: "-100px", marginLeft: "-545px", width: "200px", paddingBottom: "20px", color: "black" }}><h3>Token:</h3><p>{message2}</p></div>}
      <div style={{ padding: "40px", backgroundColor: "white", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.7)", borderRadius: "20px" }}>
        {message && <div style={{ paddingBottom: "20px", color: message2 ? "#00FF00" : "red" }}>{message}</div>}
        <form onSubmit={onSubmit} className="container-sm">
          <div className="mb-3">
            <input type="text" className="form-control" placeholder="Username" name="username" value={formData.username} onChange={onChange} required />
          </div>
          <div className="mb-3">
            <input type="email" className="form-control" placeholder="Email" name="email" value={formData.email} onChange={onChange} required />
          </div>
          <div className="mb-3">
            <input type="password" className="form-control" placeholder="Password" name="password" value={formData.password} onChange={onChange} required />
          </div>
          <div className="mb-3">
            <input type="password" className="form-control" placeholder="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={onChange} required />
          </div>
          <div className="mb-3 form-check">
            <input type="checkbox" className="form-check-input" id="termsCheck" checked={termsChecked} onChange={toggleTerms} required />
            <label className="form-check-label" htmlFor="termsCheck">I agree to the Terms and Conditions</label>
          </div>
          <button type="submit" className={`btn btn-primary mb-3 ${!termsChecked && 'disabled'}`} disabled={!termsChecked}>Signup</button>
        </form>
      </div>
    </>
  );
};

export default Signup;
