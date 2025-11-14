import React from 'react';
import './managemember.css';

export const PantrySetupInvited = () => {
  return (
    <div className="pantry-setup-invited">
      <div className="text-wrapper">SIDER</div>

      <p className="div">Invite Others to Your Pantry</p>

      <div className="rectangle" />

      <div className="frame">
        <div className="frame-2">
          <div className="text-wrapper-2">Email Address</div>

          <div className="div-wrapper">
            <div className="text-wrapper-3">address@example.com</div>
          </div>
        </div>

        <div className="frame-3">
          <div className="text-wrapper-2">Role</div>

          <div className="frame-4">
            <div className="text-wrapper-4">Collaborator</div>

            <div className="caret-down"></div>
          </div>
        </div>
      </div>

      <div className="frame-5">
        <div className="text-wrapper-4">Invite</div>
      </div>

      <div className="text-wrapper-5">Pending invitations</div>

      <div className="frame-6">
        <div className="frame-7">
          <div className="rectangle-2" />

          <div className="rectangle-3" />
        </div>

        <div className="text-wrapper-6">Resend</div>
      </div>

      <div className="frame-8">
        <div className="frame-9">
          <div className="rectangle-4" />

          <div className="rectangle-3" />
        </div>

        <div className="text-wrapper-6">Resend</div>
      </div>

      <div className="frame-10">
        <div className="frame-11">
          <div className="text-wrapper-4">Back</div>
        </div>

        <div className="frame-wrapper">
          <div className="frame-12">
            <div className="text-wrapper-4">Done</div>
          </div>
        </div>
      </div>
    </div>
  );
};
