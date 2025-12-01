import './sign.css';
import { useNavigate } from 'react-router-dom';
import { Button } from '../Components/Button/button';
import { FormField } from '../Components/FormField/formfield';
import React, { useState } from 'react';

export const SignCentered = (props) => {
  const navigate = useNavigate();
  const [creds, setCreds] = useState({
    username: '',
    pwd: '',
  });

  return (
    <div className="sign-up">
      <header className="header">
        <div className="div">SIDER</div>
      </header>

      <div className="main">
        <div className="section-header">
          <div className="text-wrapper-2">Sign Up</div>

          <p className="p">
            Let's get your kitchen organized. It only takes a minute to set up
            your first pantry.
          </p>
        </div>

        <div className="form">
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
          </div>

          <Button
            buttonText="Sign Up"
            className="button-instance"
            hierarchy="primary"
            onClick={submitForm}
          />
          <div className="log-in-prompt">
            <div className="text-wrapper-3">Already have an account?</div>

            <Button
              buttonText="Log In"
              className="design-component-instance-node"
              hierarchy="tertiary"
              onClick={() => navigate('/login')}
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
      default:
        break;
    }
  }

  function submitForm() {
    props.handleSubmit(creds).then(() => navigate('/login'));
    setCreds({ username: '', pwd: '' });
  }
};
