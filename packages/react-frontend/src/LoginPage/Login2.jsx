import './login.css';
import { useNavigate } from 'react-router-dom';
import { Button } from '../Components/Button/button';
import { FormField } from '../Components/FormField/formfield';
import React, { useState } from 'react';

export const LoginCentered = (props) => {
  /*
  This is very similar to a form, 
  we need a useState to render what the user types
  or when they submit
  */
  const navigate = useNavigate();
  const [creds, setCreds] = useState({
    username: '',
    pwd: '',
  });

  return (
    <div className="log-in">
      <header className="header">
        <div className="div">SIDER</div>
      </header>

      <div className="main">
        <div className="section-header">
          <div className="text-wrapper-2">Log In</div>
          <p className="p">Pick up where you left off managing your kitchen.</p>
        </div>

        <div className="form">
          {/* props.error is passed down from MyApp.jsx
           after a failed login attempt, the page is rerendered to props.error = 1*/}
          <div
            className="error-dialog"
            style={{ display: props.error ? 'block' : 'none' }}
          >
            <p className="dialog-text">
              The username or password you entered is incorrect.
            </p>
          </div>
          <div className="form-fields">
            <FormField
              className="form-field-instance"
              label="Username"
              name="username"
              value={creds.username}
              placeholder="Username"
              onChange={handleChange}
            />
            <FormField
              className="form-field-instance"
              label="Password"
              inputType="password"
              name="password"
              value={creds.pwd}
              placeholder="Password"
              onChange={handleChange}
            />
            <Button
              buttonText="Forgot Password?"
              className="button-instance"
              hierarchy="tertiary"
            />
          </div>

          <Button
            buttonText={props.buttonLabel || 'Log In'}
            className="design-component-instance-node"
            hierarchy="primary"
            onClick={submitForm}
          />
          <div className="redirect">
            <div className="text-wrapper-3">Don’t have an account?</div>

            <Button
              buttonText="Sign Up"
              className="button-instance"
              hierarchy="tertiary"
              onClick={() => navigate('/signup')}
            />
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
      default:
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
