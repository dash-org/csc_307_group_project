import React from "react";
import "./home.css";

import calendar from "../Images/calendar.png";
import chat from "../Images/chat.png";
import controlPanel from "../Images/control-panel.png";
import highImportance from "../Images/high-importance.png";
import playlist from "../Images/playlist.png";
import plus from "../Images/plus.png";
import settings from "../Images/settings.png";
import shoppingBag from "../Images/shopping-bag.png";
import testAccount from "../Images/test-account.png";

export const HomepageBlank = () => {
  return (
    <div className="home-container">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-brand">SIDER</div>
        <div className="sidebar-subtitle">Home</div>

        <nav className="sidebar-nav" aria-label="Main">
          <button className="nav-item" onClick={() => (window.location.href = "/home")}>
            <img src={controlPanel} alt="Home" />
            <span>Home</span>
          </button>

          <button className="nav-item">
            <img src={calendar} alt="Reminders" />
            <span>Reminders</span>
          </button>

          <button className="nav-item" onClick={() => (window.location.href = "/inventory")}>
            <img src={shoppingBag} alt="Shopping List" />
            <span>Shopping List</span>
          </button>

          <button className="nav-item">
            <img src={playlist} alt="Members" />
            <span>Members</span>
          </button>

          <button className="nav-item">
            <img src={chat} alt="Chat" />
            <span>Chat</span>
          </button>

          <button className="nav-item">
            <img src={settings} alt="Settings" />
            <span>Settings</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button className="nav-item">
            <img src={highImportance} alt="About" />
            <span>About</span>
          </button>
        </div>
      </aside>


      {/* MAIN SECTION */}
      <main className="main-content">

        {/* TOP NAV */}
        <div className="top-nav">
          <div className="nav-buttons">
            <button className="active">Home</button>
            <button 
              onClick={() => { window.location.href = '/dash';}}> 
              Dashboard </button>
            <button>Supplies</button>
          </div>

          <img className="profile-icon" src={testAccount} alt="Profile" />
        </div>

        {/* PANTRIES HEADER */}
        <h2 className="section-title">Pantries</h2>

        {/* FILTER BAR */}
        <div className="filter-bar">
          <select><option>Anyone</option></select>
          <input placeholder="Search..." />
          <input placeholder="Filter..." />
          <button className="add-btn">
            <img src={plus} alt="Add" />
          </button>
        </div>

        {/* EMPTY MESSAGE */}
        <div className="empty-message">
          Couldn’t find any pantries. Start one now.
        </div>

      </main>

    </div>
  );
};
