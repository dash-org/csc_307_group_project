import React from "react";
import "./dash.css";

import calendar from "../Images/calendar.png";
import chat from "../Images/chat.png";
import controlPanel from "../Images/control-panel.png";
import googleWebSearch from "../Images/google-web-search.png";
import highImportance from "../Images/high-importance.png";
import playlist from "../Images/playlist.png";
import plus from "../Images/plus.png";
import search from "../Images/search.png";
import settings from "../Images/settings.png";
import shoppingBag from "../Images/shopping-bag.png";
import testAccount from "../Images/test-account.png";

export const DashboardEmpty = () => {
  return (
    <div className="dashboard-root">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-brand">SIDER</div>

        <div className="sidebar-subtitle">Inventory Dashboard</div>

        <nav className="sidebar-nav" aria-label="Main">

          <button className="nav-item" onClick={() => (window.location.href = "/home")}>
            <img src={controlPanel} alt="" />
            <span>Home</span>
          </button>

          <button className="nav-item">
            <img src={calendar} alt="" />
            <span>Reminders</span>
          </button>

          {/* change later */}
          <button className="nav-item" onClick={() => (window.location.href = "/inventory")}>
            <img src={shoppingBag} alt="" />
            <span>Shopping List</span>
          </button>

          <button className="nav-item">
            <img src={playlist} alt="" />
            <span>Members</span>
          </button>

          <button className="nav-item">
            <img src={chat} alt="" />
            <span>Chat</span>
          </button>

          <button className="nav-item">
            <img src={settings} alt="" />
            <span>Settings</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button className="nav-item">
            <img src={highImportance} alt="" />
            <span>About</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">

        {/* NEW TOP NAV (MATCHING HOMEPAGE) */}
        <header className="top-nav">
          <div className="nav-buttons">
            <button onClick={() => (window.location.href = "/home")}>Home</button>
            <button className="active">Dashboard</button>
            <button>Supplies</button>
          </div>
          <img className="profile-icon" src={testAccount} alt="Profile" />
        </header>

        <section className="cards-layout">

          {/* INVENTORY */}
          <div className="card card-inventory">
            <div className="card-header">
              <h3>Inventory</h3>
              <button className="icon-btn">
                <img src={googleWebSearch} alt="" />
              </button>
            </div>

            <div className="card-body center">
              <div className="empty-text">Empty cabinets..</div>
            </div>

            <div className="card-footer">
              <button className="footer-add">
                <img src={plus} alt="" />
              </button>
            </div>
          </div>

          {/* TO-DO */}
          <div className="card card-todo">
            <div className="card-header">
              <h3>To-Do</h3>
              <button className="icon-btn">
                <img src={plus} alt="" />
              </button>
            </div>
            <div className="card-body center">
              <div className="empty-text">Nothing to do..</div>
            </div>
          </div>

          {/* LOW STOCK */}
          <div className="card card-lowstock">
            <div className="card-header">
              <h3>Low Stock Alerts</h3>
              <button className="icon-btn">
                <img src={highImportance} alt="" />
              </button>
            </div>
            <div className="card-body center">
              <div className="empty-text">No low-stock items..</div>
            </div>
          </div>

        </section>
      </main>
    </div>
  );
};
