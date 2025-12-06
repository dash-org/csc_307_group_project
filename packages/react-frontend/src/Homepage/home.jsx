import './home.css';
import React, { useState, useEffect, useCallback } from 'react';
import calendar from '../Images/calendar.png';
import chat from '../Images/chat.png';
import controlPanel from '../Images/control-panel.png';
import highImportance from '../Images/high-importance.png';
import plus from '../Images/plus.png';
import settings from '../Images/settings.png';
import shoppingBag from '../Images/shopping-bag.png';
import testAccount from '../Images/test-account.png';
import { HomeGrid } from './homeGrid';

export const HomepageBlank = (props) => {
  const [kitchens, setKitchens] = useState([]);

  /*
  fetchKitchens will make a get request with the header populated by addAuthHeader, which means that the request format will change
  everytime addAuthHeader/token changes
  */
  const fetchKitchens = useCallback(() => {
    const promise = fetch(`${props.API_PREFIX}/kitchens`, {
      headers: props.addAuthHeader(),
    });
    return promise;
  }, [props]);

  /*
  This useffect depends on fetchKitchens, which means it runs every time the token changes
  The token is set upon loading the page, so this use effect will run at the start of the page every time
  We get to set the kitchens being displayed based on the response from fetchKitchens()
   */

  useEffect(() => {
    console.log('jofifd');
    fetchKitchens()
      .then((res) => (res.status === 200 ? res.json() : undefined))
      .then((json) => {
        if (json) {
          setKitchens(json['kitchens_list']); // We expect a list of kitchens from the backend
        } else {
          setKitchens(null);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [fetchKitchens]);

  /*
  A very generic delete function that calls the backend api for deleting a kitchen, 
  and if it succeeds then we also remove it on the frontend without needing to reload
  */
  function deleteOneKitchen(_id) {
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
            <button
              className="nav-item"
              onClick={() => (window.location.href = '/home')}
            >
              <img src={controlPanel} alt="Home" />
              <span>Home</span>
            </button>

            <button className="nav-item">
              <img src={calendar} alt="Reminders" />
              <span>Reminders</span>
            </button>

            <button
              className="nav-item"
              onClick={() => (window.location.href = '/inventory')}
            >
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
              <button
                className="active"
                onClick={() => (window.location.href = '/home')}
              >
                Home
              </button>
            </nav>
            {/* User profile*/}
            <button
              className="home-profile"
              onClick={() => {
                window.location.href = '/login';
              }}
            >
              <span className="hb-user-name">{props.currentUser}</span>
              <img
                className="profile-icon"
                src={testAccount}
                alt="User avatar"
              />
            </button>
          </header>

          {/* Main header */}
          <div className="hb-main-header">
            <div>
              <h1 className="hb-title">Kitchens</h1>
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
        </main>
      </div>
    </div>
  );
};
