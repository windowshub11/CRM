import React from "react";
import "./commandsearch.css";

const mockResults = {
  Leads: [{ id: "LEAD-001", title: "Rahul Sharma", subtitle: "New . Website" }],
  Contacts: [{ id: "CONT-001", title: "Priya Verma", subtitle: "ABC Pvt Ltd" }],
  Organizations: [{ id: "ORG-001", title: "TCS", subtitle: "IT Services" }],
  Deals: [{ id: "DEAL-001", title: "ABC CRM Requirement", subtitle: "Proposal Sent" }],
  Tasks: [{ id: "TASK-001", title: "Call Rahul", subtitle: "Due Today" }],
};

export default function CommandSearch({ onClose }) {
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const showResults = query.trim().length > 0;

  return (
    <div className="command-search-overlay" onClick={onClose}>
      <div className="command-search-box" onClick={(e) => e.stopPropagation()}>
        <input
          autoFocus
          className="command-search-input"
          placeholder="Search leads, contacts, deals, tasks..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {!showResults && (
          <div className="command-search-hint">Type to search across Leads, Contacts, Organizations, Deals, Tasks</div>
        )}
        {showResults && (
          <div className="command-search-results">
            {Object.entries(mockResults).map(([group, items]) => (
              <div key={group} className="command-search-group">
                <div className="command-search-group-label">{group}</div>
                {items.map((item) => (
                  <div key={item.id} className="command-search-item">
                    <span>{item.title}</span>
                    <span className="command-search-subtitle">{item.subtitle}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
