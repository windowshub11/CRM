import { useState } from "react";

export default function Topbar({ onOpenSearch, user }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="topbar">
      <button className="search-trigger" onClick={onOpenSearch}>
        <span className="search-icon">🔍</span>
        <span className="search-text">Search...</span>
        <span className="shortcut">Ctrl + K</span>
      </button>

      <div className="topbar-right">
        <button className="quick-create">
          <span className="plus-icon">+</span> Quick Create
        </button>

        <button className="icon-btn" title="Notifications">🔔</button>

        <div className="user-avatar" onClick={() => setOpen(!open)}>
          {user?.name?.charAt(0) || "U"}
          {open && (
            <div className="user-menu">
              <h4>{user?.name || "User"}</h4>
              <p>Administrator</p>
              <hr />
              <button>My Profile</button>
              <button>Settings</button>
              <button>Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
