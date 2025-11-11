import React from "react";
import calendar from "./calendar.png";
import chat from "./chat.png";
import controlPanel from "./control-panel.png";
import highImportance from "./high-importance.png";
import playlist from "./playlist.png";
import plus from "./plus.png";
import settings from "./settings.png";
import shoppingBag from "./shopping-bag.png";
import "./style.css";
import testAccount from "./test-account.png";

export const HomepageBlank = () => {
  return (
    <div className="homepage-blank">
      <div className="text-wrapper">SIDER</div>

      <div className="rectangle" />

      <div className="div" />

      <div className="rectangle-2" />

      <div className="text-wrapper-2">Home</div>

      <div className="text-wrapper-3">Dashboard</div>

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
