import './sign.css';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

export const SignCentered = (props) => {
  // This format was derived from LoginPage, so checkout out the Login2.jsx for additional documentation
  const navigate = useNavigate();
  const [creds, setCreds] = useState({
    username: '',
    pwd: '',
  });

  return (
    <div className="login-centered" data-model-id="1:26">
      <div className="text-wrapper">SIDER</div>

      <div className="frame">
        <div className="div">Better kitchen management.</div>

        <div className="frame-2">
          <div className="text-wrapper-2">Sign Up</div>

          <div className="frame-3">
            <div className="frame-4">
              <div className="frame-5">
                <div className="frame-6">
                  <div className="text-wrapper-3">Username</div>

                  <input
                    className="div-wrapper"
                    type="text"
                    name="username"
                    id="username"
                    placeholder="Username"
                    value={creds.username}
                    onChange={handleChange}
                  />
                </div>

                <div className="frame-7">
                  <div className="text-wrapper-3">Password</div>
                  <input
                    className="div-wrapper"
                    type="password"
                    name="password"
                    id="password"
                    value={creds.pwd}
                    placeholder="Password"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <input
              type="button"
              className="frame-8"
              value={props.buttonLabel || 'Sign Up'}
              onClick={submitForm}
            />
          </div>
        </div>
      </div>
    </div>
  );

  function handleChange(event) {
    const { name, value } = event.target;
    switch (name) {
      case 'username':
        setCreds({ ...creds, username: value });
        break;
      case 'password':
        setCreds({ ...creds, pwd: value });
        break;
    }
  }

  function submitForm() {
    props.handleSubmit(creds).then(() => navigate('/'));
    setCreds({ username: '', pwd: '' });
  }
};
