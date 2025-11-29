import React from "react";
import "./inventory.css"; // separate CSS for inventory

import calendar from "../Images/calendar.png";
import controlPanel from "../Images/control-panel.png";
import highImportance from "../Images/high-importance.png";
import playlist from "../Images/playlist.png";
import plus from "../Images/plus.png";
import search from "../Images/search.png";
import settings from "../Images/settings.png";
import shoppingBag from "../Images/shopping-bag.png";
import chat from "../Images/chat.png";
import testAccount from "../Images/test-account.png";

export const InventoryEmpty = () => {
  return (
    <div className="dashboard-root">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-brand">SIDER</div>
        <div className="sidebar-subtitle">Inventory</div>

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
            <img src={shoppingBag} alt="Inventory" />
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

      {/* MAIN */}
      <main className="dashboard-main">
        <header className="top-nav">
          <div className="nav-buttons">
            <button onClick={() => (window.location.href = "/home")}>Home</button>
            <button onClick={() => (window.location.href = "/dash")}>Dashboard</button>
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
                <img src={search} alt="Search" />
              </button>
            </div>

            <div className="card-body center">
              <div className="empty-text">Empty drawers..</div>
            </div>

            <div className="card-footer">
              <button className="footer-add">
                <img src={plus} alt="Add" />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
