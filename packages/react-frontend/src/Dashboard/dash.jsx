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

        <nav className="sidebar-nav" aria-label="Main">
          <button className="nav-item" onClick={() => (window.location.href = "/")}>
            <img src={controlPanel} alt="" />
            <span>Home</span>
          </button>

          <button className="nav-item">
            <img src={calendar} alt="" />
            <span>Reminders</span>
          </button>

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

      {/* MAIN */}
      <main className="dashboard-main">
        {/* TOP NAV */}
        <header className="topnav">
          <div className="topnav-left">
            <h1 className="site-title">SIDER</h1>
            <div className="tabs">
              <button className="tab">Home</button>
              <button className="tab active">Dashboard</button>
              <button className="tab">Supplies</button>
            </div>
          </div>

          <div className="topnav-right">
            <div className="search-wrapper">
              <img src={search} alt="" className="search-icon" />
              <input className="search-input" placeholder="Search Tasks" />
            </div>
            <img className="profile" src={testAccount} alt="Profile" />
          </div>
        </header>

        {/* SUBTITLE */}
        <div className="page-subtitle">Inventory Dashboard</div>

        {/* CARDS GRID */}
        <section className="cards-layout">
          {/* BIG INVENTORY CARD */}
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

          {/* TODO CARD */}
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

          {/* LOW STOCK CARD */}
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
