import React from 'react';
import calendar from '../Images/calendar.png';
import chat from '../Images/chat.png';
import controlPanel from '../Images/control-panel.png';
import highImportance from '../Images/high-importance.png';
import playlist from '../Images/playlist.png';
import plus from '../Images/plus.png';
import settings from '../Images/settings.png';
import shoppingBag from '../Images/shopping-bag.png';
import './home.css';
import testAccount from '../Images/test-account.png';

export const HomepageBlank = () => {
  return (
    <div className="homepage-blank">
      <div className="text-wrapper">SIDER</div>

      <div className="rectangle" />

      <div className="div" />

      <div className="rectangle-2" />

      <div className="text-wrapper-2">Home</div>

      <button
        className="text-wrapper-3"
        onClick={() => {
          window.location.href = '/dash';
        }} //Fix css issue later
      >
        Dashboard
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

      <img className="settings" alt="Settings" src={settings} />

      <div className="text-wrapper-5">Pantries</div>

      <p className="p">Couldn’t find any pantries. Start one now.</p>

      <div className="rectangle-3" />

      <div className="rectangle-4" />

      <img className="plus" alt="Plus" src={plus} />

      <div className="rounded-rectangle" />

      <div className="rounded-rectangle-2" />

      <div className="text-wrapper-6">Anyone</div>

      <div className="rounded-rectangle" />

      <div className="text-wrapper-7">Anyone</div>

      <div className="text-wrapper-8">Settings</div>

      <div className="text-wrapper-9">Reminders</div>

      <div className="text-wrapper-10">Home</div>

      <div className="text-wrapper-11">Shopping List</div>

      <div className="text-wrapper-12">Members</div>

      <div className="text-wrapper-13">About</div>

      <div className="text-wrapper-14">Chat</div>
    </div>
  );
};
