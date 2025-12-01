// kitchen.jsx
import React, { useState, useEffect, useCallback } from 'react';
import calendar from '../Images/calendar.png';
import chat from '../Images/chat.png';
import controlPanel from '../Images/control-panel.png';
import highImportance from '../Images/high-importance.png';
import playlist from '../Images/playlist.png';
import plus from '../Images/plus.png';
import settings from '../Images/settings.png';
import shoppingBag from '../Images/shopping-bag.png';
import './kitchen.css';
import testAccount from '../Images/test-account.png';
import rightArrowBracket from '../Images/rightarrowbracket.png';
import { KitchenGrid } from './kitchenGrid';
import { useParams } from 'react-router-dom';
import { MembershipGrid } from './membershipGrid';

// Expecting props:
// - API_PREFIX
// - addAuthHeader()
// - kitchenId (the kitchen whose inventories we are showing)
export const KitchenPage = (props) => {
  const { id } = useParams();
  const kitchenId = id;
  const [kitchen, setKitchen] = useState(null);
  const [memberships, setMemberships] = useState([]);

  const fetchMemberships = useCallback(() => {
    return fetch(`${props.API_PREFIX}/kitchens/${kitchenId}/memberships`, {
      headers: props.addAuthHeader(),
    });
  }, [props, kitchenId]);

  const fetchInventories = useCallback(() => {
    // adjust the endpoint if your backend uses a different path
    return fetch(`${props.API_PREFIX}/kitchens/${kitchenId}`, {
      headers: props.addAuthHeader(),
    });
  }, [props, kitchenId]);

  useEffect(() => {
    fetchInventories()
      .then((res) => (res.status === 200 ? res.json() : undefined))
      .then((json) => {
        if (json) {
          // adjust key if your backend returns something like { inventories: [...] }
          setKitchen(json);
        } else {
          setKitchen(null);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [fetchInventories]);

  useEffect(() => {
    fetchMemberships()
      .then((res) => (res.status === 200 ? res.json() : undefined))
      .then((json) => {
        if (json) {
          // adjust key if your backend returns something like { inventories: [...] }
          setMemberships(json.members_list);
        } else {
          setMemberships([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [fetchMemberships]);

  function deleteOneInventory(_id) {
    const promise = fetch(
      `${props.API_PREFIX}/kitchens/${kitchenId}/inventories/${_id}`,
      {
        method: 'DELETE',
        headers: props.addAuthHeader(),
      }
    );

    promise
      .then((res) => {
        if (res.status === 204) {
          setKitchen((prev) => ({
            ...prev,
            inventories: prev.inventories.filter((inv) => inv._id !== _id),
          }));
        }
      })
      .catch((error) => console.log(error));
  }

  function deleteOneMembership(_id) {
    const promise = fetch(`${props.API_PREFIX}/memberships/${_id}`, {
      method: 'DELETE',
      headers: props.addAuthHeader(),
    });

    promise
      .then((res) => {
        if (res.status === 204) {
          const updated = memberships.filter((character) => {
            return _id !== character._id;
          });
          setMemberships(updated);
        }
      })
      .catch((error) => console.log(error));
  }

  return (
    <div className="homepage-blank">
      {/* Top bar */}
      <header className="hb-header">
        <div className="sidebar-brand">SIDER</div>

        <nav className="hb-top-nav">
          <button
            className="hb-top-nav-item"
            onClick={() => {
              window.location.href = '/home';
            }}
          >
            Home
          </button>
          <img
            src={rightArrowBracket}
            alt="firstbracket"
            className="hb-sidebar-icon"
          />
          <button className="hb-top-nav-item hb-top-nav-item-active">
            Kitchen
          </button>
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
        <aside className="sidebar">
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


        {/* Main content */}
        <main className="hb-main">
          <div className="hb-main-header">
            <div className="hb-kitchen-info-row">
              <h1 className="hb-title">
                Name: {kitchen?.name || 'NAME NOT FOUND'}
              </h1>

              <h1 className="hb-title">
                Owner: {kitchen?.owner?.name || 'OWNER NOT FOUND'}
              </h1>

              <h1 className="hb-title">
                Created:{' '}
                {kitchen?.createdAt
                  ? new Date(kitchen.createdAt).toLocaleDateString()
                  : 'DATE NOT FOUND'}
              </h1>
            </div>
          </div>

          <div className="hb-main-header">
            <div>
              <h1 className="hb-title">Memberships</h1>
            </div>

            <button
              className="hb-add-button"
              onClick={() => {
                window.location.href = `/kitchens/${kitchenId}/memberships/create`;
              }}
            >
              <img src={plus} alt="" className="hb-add-icon" />
              <span>Add User</span>
            </button>
          </div>

          <MembershipGrid
            memberships={memberships ? memberships : []}
            removeMembership={deleteOneMembership}
          />

          <div className="hb-main-header">
            <div>
              <h1 className="hb-title">Inventories</h1>
            </div>

            <button
              className="hb-add-button"
              onClick={() => {
                window.location.href = `/kitchens/${kitchenId}/inventories/create`;
              }}
            >
              <img src={plus} alt="" className="hb-add-icon" />
              <span>Create inventory</span>
            </button>
          </div>

          <KitchenGrid
            inventories={kitchen ? kitchen.inventories : []}
            removeInventory={deleteOneInventory}
            kitchenId={kitchenId}
          />
        </main>
      </div>
    </div>
  );
};
