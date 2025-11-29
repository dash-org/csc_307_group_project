import React, { useState, useRef, useEffect } from "react";
import "./inventory.css";

import calendar from "../Images/calendar.png";
import controlPanel from "../Images/control-panel.png";
import highImportance from "../Images/high-importance.png";
import playlist from "../Images/playlist.png";
import plus from "../Images/plus.png";
import searchIcon from "../Images/search.png";
import settings from "../Images/settings.png";
import shoppingBag from "../Images/shopping-bag.png";
import chat from "../Images/chat.png";
import testAccount from "../Images/test-account.png";

export const InventoryEmpty = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const searchRef = useRef(null);

  const handleSearch = () => {
    alert("Searching for: " + searchText);
    setSearchText("");
  };

  // Close search if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
              <div className="search-container" ref={searchRef}>
                {showSearch ? (
                  <div className="search-input-wrapper">
                    <input
                      type="text"
                      placeholder="Search items..."
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      autoFocus
                    />
                    <button onClick={handleSearch}>Go</button>
                  </div>
                ) : (
                  <button className="icon-btn" onClick={() => setShowSearch(true)}>
                    <img src={searchIcon} alt="Search" />
                  </button>
                )}
              </div>
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
