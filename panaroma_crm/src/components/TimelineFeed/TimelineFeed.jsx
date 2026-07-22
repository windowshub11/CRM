import { useState, useEffect } from 'react';
import './timelinefeed.css';
 
const MOCK_ITEMS = [
  {
    id: 'ACT-2026-00033',
    type: 'Note',
    summary: 'Customer asked for pricing breakup',
    body: 'Need to send proposal by tomorrow.',
    visibility: 'Public',
    activity_at: '2026-07-14T10:30:00Z',
    author: { name: 'Sales Rep', email: 'rep@example.com' },
    pinned: false,
  },
];
 
export default function TimelineFeed({ doctype, name }) {
  const [items, setItems] = useState(MOCK_ITEMS);
  const [note, setNote] = useState('');
 
  useEffect(() => {
    // TODO: backend ready hone pe uncomment
    // fetch(`/api/method/panorama_crm.api.timeline.feed?doctype=${doctype}&name=${name}`)
    //   .then(res => res.json())
    //   .then(res => setItems(res.data.items));
  }, [doctype, name]);
 
  const handleAddNote = () => {
    if (!note.trim()) return;
    // Optimistic insert — spec section 9.2 comment
    const tempItem = {
      id: `temp-${Date.now()}`,
      type: 'Note',
      summary: note.slice(0, 60),
      body: note,
      visibility: 'Public',
      activity_at: new Date().toISOString(),
      author: { name: 'You' },
      pinned: false,
    };
    setItems([tempItem, ...items]);
    setNote('');
 
    // TODO: real API call
    // fetch('/api/method/panorama_crm.api.timeline.log_activity', { method: 'POST', body: JSON.stringify({...}) })
  };
 
  return (
    <div className="timeline">
      <div className="timeline-composer">
        <textarea
          placeholder="Add a note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button onClick={handleAddNote}>Log Activity</button>
      </div>
 
      <div className="timeline-list">
        {items.map((item) => (
          <div key={item.id} className={`timeline-item ${item.pinned ? 'pinned' : ''}`}>
            <div className="timeline-item-header">
              <span className="timeline-item-type">{item.type}</span>
              <span className="timeline-item-time">
                {new Date(item.activity_at).toLocaleString()}
              </span>
              {item.visibility === 'Private' && <span className="timeline-private-badge">Private</span>}
            </div>
            <div className="timeline-item-summary">{item.summary}</div>
            {item.body && <div className="timeline-item-body">{item.body}</div>}
            <div className="timeline-item-author">— {item.author?.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
