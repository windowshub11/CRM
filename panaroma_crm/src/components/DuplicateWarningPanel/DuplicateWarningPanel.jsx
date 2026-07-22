import React from "react";
import "./duplicatewarningpanel.css";

const mockCandidate = {
  score: 98,
  survivor: {
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "9876543210",
    owner: "John",
    source: "Website",
  },
  duplicate: {
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "9876543211",
    owner: "Alex",
    source: "Referral",
  },
  linked_records: ["2 Deals", "3 Tasks", "5 Activities"],
  reasons: ["Exact email match", "Similar phone number"],
};

export default function DuplicateWarningPanel({ candidate = mockCandidate, onClose, onMerge, onKeepSeparate, onIgnore }) {
  const [selected, setSelected] = React.useState(() => {
    const initial = {};
    Object.keys(candidate.survivor).forEach((field) => {
      initial[field] = "survivor";
    });
    return initial;
  });

  const pick = (field, side) => {
    setSelected((prev) => ({ ...prev, [field]: side }));
  };

  return (
    <div className="dwp-overlay" onClick={onClose}>
      <div className="dwp-modal" onClick={(e) => e.stopPropagation()}>
        <div className="dwp-header">
          <div className="dwp-header-left">
            <span className="dwp-warning-icon">⚠️</span>
            <div>
              <div className="dwp-title">Possible Duplicate Found</div>
              <div className="dwp-reasons">{candidate.reasons.join(" · ")}</div>
            </div>
          </div>
          <div className="dwp-score-badge">{candidate.score}% match</div>
        </div>

        <div className="dwp-body">
          <div className="dwp-compare">
            <div className="dwp-col">
              <div className="dwp-col-label survivor">Survivor (this record)</div>
              {Object.entries(candidate.survivor).map(([field, value]) => (
                <label key={field} className={`dwp-field ${selected[field] === "survivor" ? "picked" : ""}`}>
                  <input
                    type="radio"
                    name={field}
                    checked={selected[field] === "survivor"}
                    onChange={() => pick(field, "survivor")}
                  />
                  <div>
                    <div className="dwp-field-name">{field}</div>
                    <div className="dwp-field-value">{value}</div>
                  </div>
                </label>
              ))}
            </div>

            <div className="dwp-col">
              <div className="dwp-col-label duplicate">Duplicate Record</div>
              {Object.entries(candidate.duplicate).map(([field, value]) => (
                <label key={field} className={`dwp-field ${selected[field] === "duplicate" ? "picked" : ""}`}>
                  <input
                    type="radio"
                    name={field}
                    checked={selected[field] === "duplicate"}
                    onChange={() => pick(field, "duplicate")}
                  />
                  <div>
                    <div className="dwp-field-name">{field}</div>
                    <div className="dwp-field-value">{value}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="dwp-linked-box">
            <span className="dwp-linked-icon">🔗</span>
            Linked records that will move to survivor: <strong>{candidate.linked_records.join(", ")}</strong>
          </div>

          <div className="dwp-notice">
            Merging is audit-logged and cannot be easily undone. Review both records carefully before continuing.
          </div>
        </div>

        <div className="dwp-actions">
          <button className="dwp-btn cancel" onClick={onClose}>Cancel</button>
          <button className="dwp-btn ignore" onClick={onIgnore}>Ignore Candidate</button>
          <button className="dwp-btn separate" onClick={onKeepSeparate}>Keep Separate</button>
          <button className="dwp-btn merge" onClick={onMerge}>Merge Records</button>
        </div>
      </div>
    </div>
  );
}
