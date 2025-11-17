import React from 'react';
import calendar from '../Images/calendar.png';
import chat from '../Images/chat.png';
import controlPanel from '../Images/control-panel.png';
import googleWebSearch from '../Images/google-web-search.png';
import highImportance from '../Images/high-importance.png';
// import image from '../Images/image.png';
import playlist from '../Images/playlist.png';
import plus from '../Images/plus.png';
import search from '../Images/search.png';
import settings from '../Images/settings.png';
import shoppingBag from '../Images/shopping-bag.png';
import './dash.css';
import testAccount from '../Images/test-account.png';

export const DashboardEmpty = () => {
  return (
    <div className="dashboard-empty">
      <div className="text-wrapper">SIDER</div>

      <div className="rectangle" />

      <div className="div" />

      <div className="rectangle-2" />

      <div className="text-wrapper-2">Dashboard</div>

      <button
        className="text-wrapper-3"
        onClick={() => { window.location.href = '/home'; }} //Fix css issue later
      >
        Home
      </button>

      <div className="text-wrapper-4">Supplies</div>

      <div className="ellipse" />

      <div className="ellipse-2" />

      <div className="ellipse-3" />

      <div className="ellipse-4" />

      <div className="ellipse-5" />

      <div className="ellipse-6" />

      <div className="ellipse-7" />

      <img className="control-panel" alt="Control panel" src={controlPanel} />

      <img className="calendar" alt="Calendar" src={calendar} />

      <img className="shopping-bag" alt="Shopping bag" src={shoppingBag} />

      <img className="playlist" alt="Playlist" src={playlist} />

      <img className="chat" alt="Chat" src={chat} />

      <img
        className="high-importance"
        alt="High importance"
        src={highImportance}
      />

      <img className="test-account" alt="Test account" src={testAccount} />

      <div className="rectangle-3" />

      <img className="search" alt="Search" src={search} />

      <div className="text-wrapper-5">Search Tasks</div>

      <img className="settings" alt="Settings" src={settings} />

      <div className="rectangle-4" />

      <div className="rectangle-5" />

      <div className="rectangle-6" />

      <div className="rectangle-7" />

      <div className="text-wrapper-6">To-Do List</div>

      <button
        className="text-wrapper-7"
        onClick={() => { window.location.href = '/inventory'; }} //Fix css issue later
      >
        Inventory
      </button>

      <div className="text-wrapper-8">Activity</div>

      <div className="text-wrapper-9">Reminder</div>

      <div className="text-wrapper-10">Inventory Dashboard</div>

      <div className="rectangle-8" />

      <div className="rectangle-9" />

      <div className="rectangle-10" />

      <div className="rectangle-11" />

      <div className="wallet-wanted">
        Wallet: $0
        <br />
        <br />
        Wanted Items: $0
      </div>

      <img className="plus" alt="Plus" src={plus} />

      <img className="img" alt="Plus" src={plus} />

      <img className="plus-2" alt="Plus" src={plus} />

      <img
        className="google-web-search"
        alt="Google web search"
        src={googleWebSearch}
      />

      <div className="text-wrapper-11">Nothing to do..</div>

      <div className="text-wrapper-12">Empty cabinets..</div>

      <div className="text-wrapper-13">No reminders..</div>

      <div className="text-wrapper-14">No activity to report..</div>

      <div className="text-wrapper-15">Settings</div>

      <div className="text-wrapper-16">Reminders</div>

      <button
        className="text-wrapper-17"
        onClick={() => { window.location.href = '/home'; }} //Fix css issue later
      >
        Home
      </button>

      <div className="text-wrapper-18">Shopping List</div>

      <div className="text-wrapper-19">Members</div>

      <div className="text-wrapper-20">About</div>

      <div className="text-wrapper-21">Chat</div>
    </div>
  );
};
