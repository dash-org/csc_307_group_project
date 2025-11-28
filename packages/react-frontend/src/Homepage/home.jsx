import React, { useState, useEffect, useCallback } from 'react';
import calendar from '../Images/calendar.png';
import chat from '../Images/chat.png';
import controlPanel from '../Images/control-panel.png';
import highImportance from '../Images/high-importance.png';
// import playlist from '../Images/playlist.png';
import plus from '../Images/plus.png';
import settings from '../Images/settings.png';
import shoppingBag from '../Images/shopping-bag.png';
import './home.css';
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
      {/* Top bar */}
      <header className="hb-header">
        <div className="hb-logo">SIDER</div>

        <nav className="hb-top-nav">
          <button className="hb-top-nav-item hb-top-nav-item-active">
            Home
          </button>

          {/* <button
            className="hb-top-nav-item"
            onClick={() => {
              window.location.href = '/dash';
            }}
          >
            Dashboard
          </button>

          <button className="hb-top-nav-item">Supplies</button> */}
        </nav>

        <button
          className="hb-user-button"
          onClick={() => {
            window.location.href = '/login';
          }}
        >
          <span className="hb-user-name">{props.currentUser}</span>
          <img className="hb-user-avatar" src={testAccount} alt="User avatar" />
        </button>
      </header>

      {/* Main layout */}
      <div className="hb-body">
        {/* Sidebar */}
        <aside className="hb-sidebar">
          <ul className="hb-sidebar-list">
            <li className="hb-sidebar-item hb-sidebar-item-active">
              <div className="hb-sidebar-icon-pill hb-sidebar-icon-pill-active">
                <img
                  src={controlPanel}
                  alt="Home"
                  className="hb-sidebar-icon"
                />
              </div>
              <span>Home</span>
            </li>

            <li className="hb-sidebar-item">
              <div className="hb-sidebar-icon-pill">
                <img
                  src={calendar}
                  alt="Reminders"
                  className="hb-sidebar-icon"
                />
              </div>
              <span>Reminders</span>
            </li>

            <li className="hb-sidebar-item">
              <div className="hb-sidebar-icon-pill">
                <img
                  src={shoppingBag}
                  alt="Shopping List"
                  className="hb-sidebar-icon"
                />
              </div>
              <span>Shopping List</span>
            </li>

            {/* <li className="hb-sidebar-item">
              <div className="hb-sidebar-icon-pill">
                <img src={playlist} alt="Members" className="hb-sidebar-icon" />
              </div>
              <span>Members</span>
            </li> */}

            <li className="hb-sidebar-item">
              <div className="hb-sidebar-icon-pill">
                <img src={chat} alt="Chat" className="hb-sidebar-icon" />
              </div>
              <span>Chat</span>
            </li>

            <li className="hb-sidebar-item">
              <div className="hb-sidebar-icon-pill">
                <img
                  src={settings}
                  alt="Settings"
                  className="hb-sidebar-icon"
                />
              </div>
              <span>Settings</span>
            </li>

            <li className="hb-sidebar-item">
              <div className="hb-sidebar-icon-pill">
                <img
                  src={highImportance}
                  alt="About"
                  className="hb-sidebar-icon"
                />
              </div>
              <span>About</span>
            </li>
          </ul>
        </aside>

        {/* Main content */}
        <main className="hb-main">
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
