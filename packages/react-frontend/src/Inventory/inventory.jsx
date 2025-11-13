import React from "react";
import calendar from "./Images/calendar.png";
import chat from "./Images/chat.png";
import controlPanel from "./Images/control-panel.png";
import highImportance from "./Images/high-importance.png";
import playlist from "./Images/playlist.png";
import plus from "./Images/plus.png";
import search from "./Images/search.png"; //
import settings from "./Images/settings.png";
import shoppingBag from "./Images/shopping-bag.png";
import "./style.css";
import testAccount from "./Images/test-account.png";

export const InventoryEmpty = () => {
  return (
    <div className="inventory-empty">
      <div className="text-wrapper">SIDER</div>

      <div className="rectangle" />

      <div className="div" />

      <div className="rectangle-2" />

      <div className="text-wrapper-2">Dashboard</div>

      <div className="text-wrapper-3">Home</div>

      <div className="text-wrapper-4">Lists</div>

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

      <div className="text-wrapper-5">Search</div>

      <img className="settings" alt="Settings" src={settings} />

      <div className="rectangle-4" />

      <div className="text-wrapper-6">Inventory</div>

      <div className="text-wrapper-7">← Dashboard</div>

      <div className="rectangle-5" />

      <div className="rectangle-6" />

      <img className="plus" alt="Plus" src={plus} />

      <div className="text-wrapper-8">Empty drawers..</div>

      <div className="text-wrapper-9">Settings</div>

      <div className="text-wrapper-10">Reminders</div>

      <div className="text-wrapper-11">Home</div>

      <div className="text-wrapper-12">Shopping List</div>

      <div className="text-wrapper-13">Members</div>

      <div className="text-wrapper-14">About</div>

      <div className="text-wrapper-15">Chat</div>
    </div>
  );
};
