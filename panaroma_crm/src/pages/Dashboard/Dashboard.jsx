import "./dashboard.css";

export default function Dashboard() {
  const cards = [
    { title: "Total Leads", value: "152" },
    { title: "Open Deals", value: "43" },
    { title: "Revenue", value: "₹18.4L" },
    { title: "Pending Tasks", value: "12" },
  ];
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="card-grid">
        {cards.map((card) => (
          <div className="card" key={card.title}>
            <h4>{card.title}</h4>
            <h2>{card.value}</h2>
          </div>
        ))}
      </div>
      <div className="dashboard-row">
        <div className="panel">
          <h3>Recent Activities</h3>
          <ul>
            <li>✅ Rahul Sharma added as Lead</li>
            <li>📞 Call scheduled with ABC Pvt Ltd</li>
            <li>💰 Deal moved to Proposal</li>
            <li>📅 Meeting tomorrow 11:00 AM</li>
          </ul>
        </div>
        <div className="panel">
          <h3>Upcoming Tasks</h3>
          <ul>
            <li>Follow-up with Infosys</li>
            <li>Send quotation</li>
            <li>Update Deal Stage</li>
            <li>Email client</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
