import './login.css';
import React, { useState } from 'react';

export const LoginCentered = (props) => {
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
          <div className="text-wrapper-2">Log In</div>

          <div
            className="error"
            style={{ display: props.error ? 'block' : 'none' }}
          >
            Incorrect Password or Username
          </div>

          <div className="frame-3">
            <div className="frame-4">
              <div className="frame-5">
                <div className="frame-6">
                  <div className="text-wrapper-3">Username</div>

                  {/* <div className="div-wrapper"> */}
                  <input
                    className="div-wrapper"
                    type="text"
                    name="username"
                    id="username"
                    placeholder="Username"
                    value={creds.username}
                    onChange={handleChange}
                  />
                  {/* <div className="text-wrapper-4">Username</div> */}
                  {/* </div> */}
                </div>

                <div className="frame-7">
                  <div className="text-wrapper-3">Password</div>

                  {/* <div className="div-wrapper">
                    <div className="text-wrapper-4">Password</div>
                  </div> */}
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

              <div className="text-wrapper-5">Forgot Password?</div>
            </div>

            {/* <div className="frame-8"> */}
            {/* <div className="text-wrapper-6">Log In</div> */}
            <input
              type="button"
              className="frame-8"
              value={props.buttonLabel || 'Log In'}
              onClick={submitForm}
            />
            {/* </div> */}

            <p className="don-t-have-an">
              <span className="span">Don’t have an account? </span>
              <a className="text-wrapper-7" href="http://localhost:5173/signup">
                {' '}
                Create an account{' '}
              </a>

              {/* <span className="text-wrapper-7">Create an account</span> */}
            </p>
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
    props.handleSubmit(creds);
    setCreds({ username: '', pwd: '' });
  }
};
