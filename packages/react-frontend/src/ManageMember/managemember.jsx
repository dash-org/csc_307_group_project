import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './managemember.css';

export const PantrySetupInvited = (props) => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('viewer'); // default

  const { kitchenId } = useParams();

  function submitForm() {
    props.handleSubmit(username, role, kitchenId);
  }

  return (
    <div className="pantry-setup-invited">
      <div className="text-wrapper">SIDER</div>

      <p className="div">Add Others to Your Pantry</p>

      <div
        className="error"
        style={{
          display: props.error ? 'block' : 'none',
          textAlign: 'center',
          margin: '0 auto',
        }}
      >
        Username doesn't exist, or action is not permitted
      </div>

      <div className="rectangle" />

      <div className="frame">
        {/* Username */}
        <div className="frame-2">
          <div className="text-wrapper-2">Username</div>

          <div className="div-wrapper">
            <input
              className="text-wrapper-3 username-input"
              placeholder="e.g Jack Daniels"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>

        {/* Role */}
        <div className="frame-3">
          <div className="text-wrapper-2">Role</div>

          <div className="frame-4">
            <select
              className="text-wrapper-4 role-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>

            <div className="caret-down"></div>
          </div>
        </div>
      </div>

      {/* Back / Done */}
      <div className="frame-10">
        <button
          type="button"
          className="frame-11"
          onClick={() => {
            window.location.href = `/kitchens/${kitchenId}`;
          }}
        >
          <div className="text-wrapper-4">Back</div>
        </button>

        <div className="frame-wrapper">
          <button type="button" className="frame-12" onClick={submitForm}>
            <div className="text-wrapper-4">Done</div>
          </button>
        </div>
      </div>
    </div>
  );
};
