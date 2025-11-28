import './login.css';
import React, { useState } from 'react';

export const LoginCentered = (props) => {
  /*
  This is very similar to a form, 
  we need a useState to render what the user types
  or when they submit
  */
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
          {/* props.error is passed down from MyApp.jsx
           after a failed login attempt, the page is rerendered to props.error = 1*/}
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

                  <input // This is the username box that can be filled by the user
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

                  <input // This is the password box that can be filled by the user
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

            <input // This is the submit button
              type="button"
              className="frame-8"
              value={props.buttonLabel || 'Log In'}
              onClick={submitForm}
            />

            <p className="don-t-have-an">
              <span className="span">Don’t have an account? </span>
              <a className="text-wrapper-7" href="http://localhost:5173/signup">
                {' '}
                Create an account{' '}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  /*
  handleChange is called anytime the user types into either the username box or the password box,
  so we handle the update by rendering the change with useState setCreds()
   */

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

  /*
  submitForm() resets the password and username boxes,
  the function signupUser() is then ran as it was passed down as a prop from MyApp.jsx
   */
  function submitForm() {
    props.handleSubmit(creds);
    setCreds({ username: '', pwd: '' });
  }
};
