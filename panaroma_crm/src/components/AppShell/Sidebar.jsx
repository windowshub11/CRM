import React from "react";
const navItems = [
  { label: "Dashboard", icon: "📊" },
  { label: "My Day", icon: "☀️" },
  { label: "Leads", icon: "🎯" },
  { label: "Deals", icon: "💼" },
  { label: "Contacts", icon: "👤" },
  { label: "Organizations", icon: "🏢" },
  { label: "Import", icon: "📥" },
  { label: "Reports", icon: "📈" },
  { label: "Settings", icon: "⚙️" }
];
export default function Sidebar() {
  const [active, setActive] = React.useState("Dashboard");
  const linkStyle = (name) => "sidebar-link " + (active === name ? "active" : "");
  const handleClick = (e, name) => { e.preventDefault(); setActive(name); };
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">Panorama CRM</div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <a key={item.label} href="#" className={linkStyle(item.label)} onClick={(e) => handleClick(e, item.label)}>
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
}
