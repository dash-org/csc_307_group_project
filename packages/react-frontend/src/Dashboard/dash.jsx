import React, { useEffect, useCallback, useState } from 'react';
import './dash.css';

import calendar from '../Images/calendar.png';
import chat from '../Images/chat.png';
import controlPanel from '../Images/control-panel.png';
import googleWebSearch from '../Images/google-web-search.png';
import highImportance from '../Images/high-importance.png';
import playlist from '../Images/playlist.png';
import plus from '../Images/plus.png';
// import search from '../Images/search.png';
import settings from '../Images/settings.png';
import shoppingBag from '../Images/shopping-bag.png';
import testAccount from '../Images/test-account.png';
import { useParams } from 'react-router-dom';
import { InventoryItemList } from './InventoryItemList';
import rightArrowBracket from '../Images/rightarrowbracket.png';

export const DashboardEmpty = (props) => {
  const [showAddTodo, setShowAddTodo] = useState(false);
  const [todoText, setTodoText] = useState('');

  const { kitchenId, inventoryId } = useParams();

  {
    /*Store inventory*/
  }
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log('Kitchen ID:', kitchenId);
  console.log('Inventory ID:', inventoryId);

  {
    /*Fetch inventory data*/
  }
  const fetchInventory = useCallback(() => {
    const promise = fetch(
      `${props.API_PREFIX}/kitchens/${kitchenId}/inventories/${inventoryId}`,
      {
        headers: props.addAuthHeader(),
      }
    );
    return promise;
  }, [kitchenId, inventoryId, props]);

  useEffect(() => {
    fetchInventory()
      .then((res) => (res.status === 200 ? res.json() : undefined))
      .then((json) => {
        if (json) {
          setInventory(json);
          setLoading(false);
        } else {
          setLoading(true);
          setInventory(null);
        }
      })
      .catch((error) => {
        console.error('Error fetching inventory:', error);
      });
  }, [fetchInventory]);

  const handleAddTodo = () => {
    if (!todoText.trim()) return;
    alert('Reminder added: ' + todoText);
    setTodoText('');
    setShowAddTodo(false);
  };

  function deleteOneInventory(_id) {
    const promise = fetch(
      `${props.API_PREFIX}/kitchens/${kitchenId}/inventories/${inventoryId}/items/${_id}`,
      {
        method: 'DELETE',
        headers: props.addAuthHeader(),
      }
    );

    promise
      .then((res) => {
        if (res.status === 204) {
          setInventory((prev) => ({
            ...prev,
            items: prev.items.filter((item) => item._id !== _id),
          }));
        }
      })
      .catch((error) => console.log(error));
  }

  return (
    <div className="dashboard-root">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-brand">SIDER</div>

        <div className="sidebar-subtitle">Inventory Dashboard</div>

        <nav className="sidebar-nav" aria-label="Main">
          <button
            className="nav-item"
            onClick={() => (window.location.href = '/home')}
          >
            <img src={controlPanel} alt="" />
            <span>Home</span>
          </button>

          <button className="nav-item">
            <img src={calendar} alt="" />
            <span>Reminders</span>
          </button>

          <button
            className="nav-item"
            onClick={() => (window.location.href = '')}
          >
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
        {/* Top navigation */}
        <header className="top-nav">
          <nav className="nav-buttons">
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
            <button
              className="hb-top-nav-item"
              onClick={() => {
                window.location.href = `/kitchens/${kitchenId}`;
              }}
            >
              kitchen
            </button>
            <img
              src={rightArrowBracket}
              alt="firstbracket"
              className="hb-sidebar-icon"
            />
            <button className="active">Inventory Dashboard</button>
          </nav>
          {/* User profile*/}
          <button
            className="home-profile"
            onClick={() => {
              window.location.href = '/login';
            }}
          >
            <span className="hb-user-name">{props.currentUser}</span>
            <img className="profile-icon" src={testAccount} alt="User avatar" />
          </button>
        </header>

        <section className="cards-layout">
          {/* INVENTORY */}
          <div className="card card-inventory">
            <div className="card-header">
              <div
                className="inventory-header-meta"
                onClick={() => (window.location.href = '/inventory')}
              >
                {/* Title always shows something safe */}
                <h3 className="inventory-title">
                  {' '}
                  Inventory Name:
                  {loading
                    ? 'Loading...'
                    : inventory
                      ? inventory.name
                      : 'Inventory Not Found'}
                </h3>

                {/* Created date ONLY if inventory exists */}
                {!loading && inventory && (
                  <p className="inventory-created">
                    Inventory Created:{' '}
                    {new Date(inventory.createdAt).toLocaleDateString()}
                  </p>
                )}

                {!loading && inventory && (
                  <p className="inventory-created">
                    Inventory Created By: {inventory.createdBy.name}
                  </p>
                )}
              </div>

              <button
                className="icon-btn"
                onClick={() => (window.location.href = '/inventory')}
              >
                <img src={googleWebSearch} alt="" />
              </button>
            </div>

            {/* BODY CONTENT */}
            <div className="card-body center">
              {loading ? (
                <div className="empty-text">Loading inventory...</div>
              ) : !inventory ? (
                <div className="empty-text">Inventory not found.</div>
              ) : inventory.items?.length > 0 ? (
                // <div className="inventory-info">
                //   {inventory.items.map((item) => (
                //     <div key={item._id} className="inventory-item">
                //       <strong>{item.name}</strong> : {item.quantity}
                //     </div>
                //   ))}
                // </div>
                <InventoryItemList
                  items={inventory.items}
                  onDelete={deleteOneInventory}
                />
              ) : (
                <div className="empty-text">No items in this inventory.</div>
              )}
            </div>

            <div className="card-footer">
              <button
                className="footer-add"
                onClick={() =>
                  (window.location.href = `/kitchens/${kitchenId}/inventories/${inventoryId}/item/create`)
                }
              >
                <img src={plus} alt="" />
              </button>
            </div>
          </div>

          {/* TO-DO */}
          <div className="card card-todo">
            <div className="card-header">
              <h3>To-Do</h3>
              <button
                className="icon-btn"
                onClick={() => setShowAddTodo(!showAddTodo)}
              >
                <img src={plus} alt="" />
              </button>
            </div>

            <div className="card-body center">
              {!showAddTodo ? (
                <div className="empty-text">Nothing to do..</div>
              ) : (
                <div className="todo-input-row">
                  <input
                    type="text"
                    placeholder="Add reminder..."
                    value={todoText}
                    onChange={(e) => setTodoText(e.target.value)}
                  />
                  <button onClick={handleAddTodo}>Add</button>
                </div>
              )}
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
