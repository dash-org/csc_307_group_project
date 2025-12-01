import './home.css';
import React, { useState, useEffect, useCallback } from 'react';
import calendar from '../Images/calendar.png';
import chat from '../Images/chat.png';
import controlPanel from '../Images/control-panel.png';
import highImportance from '../Images/high-importance.png';
// import playlist from '../Images/playlist.png';
import plus from '../Images/plus.png';
import settings from '../Images/settings.png';
import shoppingBag from '../Images/shopping-bag.png';
import testAccount from '../Images/test-account.png';
import { HomeGrid } from './homeGrid';

export const HomepageBlank = (props) => {
  const [kitchens, setKitchens] = useState([]);

  const fetchKitchens = useCallback(() => {
    const promise = fetch(`${props.API_PREFIX}/kitchens`, {
      headers: props.addAuthHeader(),
    });
    return promise;
  }, [props]);

  useEffect(() => {
    console.log('jofifd');
    fetchKitchens()
      .then((res) => (res.status === 200 ? res.json() : undefined))
      .then((json) => {
        if (json) {
          setKitchens(json['kitchens_list']);
        } else {
          setKitchens(null);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [fetchKitchens]);

  function deleteOneKitchen(_id) {
    // const trash = kitchens.at(index);
    const promise = fetch(`${props.API_PREFIX}/kitchens/${_id}`, {
      method: `DELETE`,
      headers: props.addAuthHeader(),
    });

    promise
      .then((res) => {
        if (res.status == 204) {
          const updated = kitchens.filter((kitchen) => {
            return kitchen._id !== _id;
          });
          setKitchens(updated);
        }
      })
      .catch((error) => console.log(error));
  }

  return (
    <div className="homepage-blank">
      {/* Main layout */}
      <div className="home-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-brand">SIDER</div>
          <div className="sidebar-subtitle">Homepage</div>
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


        {/* Main content */}
        <main className="main-content">
          {/* Top navigation */}
          <header className="top-nav">
            <nav className="nav-buttons">
              <button className="active" onClick={() => (window.location.href = "/home")}>
              Home
              </button>
            </nav>
            {/* User profile*/}
            <button
              className="home-profile"
              onClick={() => {
                window.location.href = '/login';
              }} >
              <span className="hb-user-name">{props.currentUser}</span>
              <img className="profile-icon" src={testAccount} alt="User avatar" />
            </button>
          </header>
          
          {/* Main header */}
          <div className="hb-main-header">
            <div>
              <h1 className="hb-title">Kitchens</h1>
              {/* <p className="hb-subtitle">
                Couldn’t find any kitchens. Start one now.
              </p> */}
            </div>

            <button
              className="hb-add-button"
              onClick={() => {
                window.location.href = '/kitchens/create';
              }}
            >
              <img src={plus} alt="" className="hb-add-icon" />
              <span>Start a kitchen</span>
            </button>
          </div>
          <HomeGrid
            kitchens={kitchens}
            removeKitchen={deleteOneKitchen}
          ></HomeGrid>

          {/* Content card / empty state */}
          {/* <section className="hb-card">
            <p className="hb-card-text">
              You don’t have any kitchens set up. Create one to start tracking
              supplies, members, and shopping lists.
            </p>
          </section> */}
        </main>
      </div>
    </div>
  );
};
