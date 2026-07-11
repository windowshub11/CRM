/* ==========================================================================
   LEADCALL CRM - TELECALLER JS (telecaller-home.js)
   ========================================================================== */

'use strict';

document.addEventListener("DOMContentLoaded", function () {
  // Setup filter functionality
  initFilters();
});

// Mock database representation
var leads = [
  {
    id: "LEAD-0048",
    name: "Kavita Joshi",
    priority: "warm",
    service: "Home Buying",
    source: "Walk-in",
    area: "Andheri",
    timing: "in 1 day",
    calls: 2
  },
  {
    id: "LEAD-0007",
    name: "Deepak Reddy",
    priority: "warm",
    service: "Seepage",
    source: "JustDial",
    area: "Bandra",
    timing: "in 2 days",
    calls: 4
  }
];

function initFilters() {
  var searchInput = document.getElementById("searchInput");
  var filterDate = document.getElementById("filterDate");
  var filterService = document.getElementById("filterService");
  var filterSort = document.getElementById("filterSort");
  var filterOrder = document.getElementById("filterOrder");

  // Priority Pill Toggles
  var pills = {
    hot: document.getElementById("pillHot"),
    warm: document.getElementById("pillWarm"),
    cold: document.getElementById("pillCold")
  };

  Object.keys(pills).forEach(function (key) {
    if (pills[key]) {
      pills[key].addEventListener("click", function () {
        pills[key].classList.toggle("active");
        renderLeads();
      });
    }
  });

  // Attach search and change listeners
  if (searchInput) searchInput.addEventListener("input", renderLeads);
  if (filterDate) filterDate.addEventListener("change", renderLeads);
  if (filterService) filterService.addEventListener("change", renderLeads);
  if (filterSort) filterSort.addEventListener("change", renderLeads);
  if (filterOrder) filterOrder.addEventListener("change", renderLeads);

  // Initial render
  renderLeads();
}

function renderLeads() {
  var searchInput = document.getElementById("searchInput");
  var query = searchInput ? searchInput.value.toLowerCase().trim() : "";

  var filterService = document.getElementById("filterService");
  var service = filterService ? filterService.value : "All Services";

  var showHot = document.getElementById("pillHot") ? document.getElementById("pillHot").classList.contains("active") : true;
  var showWarm = document.getElementById("pillWarm") ? document.getElementById("pillWarm").classList.contains("active") : true;
  var showCold = document.getElementById("pillCold") ? document.getElementById("pillCold").classList.contains("active") : true;

  var container = document.getElementById("leadsList");
  if (!container) return;

  container.innerHTML = "";

  var filtered = leads.filter(function (lead) {
    // Search filter
    var matchesSearch = lead.name.toLowerCase().includes(query) ||
                          lead.id.toLowerCase().includes(query) ||
                          lead.area.toLowerCase().includes(query);

    // Service filter
    var matchesService = (service === "All Services" || lead.service === service);

    // Priority filter
    var matchesPriority = false;
    if (lead.priority === "hot" && showHot) matchesPriority = true;
    if (lead.priority === "warm" && showWarm) matchesPriority = true;
    if (lead.priority === "cold" && showCold) matchesPriority = true;

    return matchesSearch && matchesService && matchesPriority;
  });

  // Sort logic
  var filterSort = document.getElementById("filterSort");
  var sortVal = filterSort ? filterSort.value : "All Cases";
  if (sortVal === "Hot First") {
    filtered.sort(function (a, b) {
      if (a.priority === "hot" && b.priority !== "hot") return -1;
      if (a.priority !== "hot" && b.priority === "hot") return 1;
      return 0;
    });
  } else if (sortVal === "Newest First") {
    filtered.reverse();
  }

  // Order logic
  var filterOrder = document.getElementById("filterOrder");
  var orderVal = filterOrder ? filterOrder.value : "Callback Time";
  if (orderVal === "Name") {
    filtered.sort(function (a, b) { return a.name.localeCompare(b.name); });
  } else if (orderVal === "Lead ID") {
    filtered.sort(function (a, b) { return a.id.localeCompare(b.id); });
  }

  // Update tabs count
  var tabAll = document.getElementById("tabAll");
  if (tabAll) {
    tabAll.textContent = "All (" + filtered.length + ")";
  }

  // Render cards
  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #64748b; font-weight: 500;">
        <i class="fa-solid fa-folder-open" style="font-size: 32px; margin-bottom: 12px; display: block; color: #cbd5e1;"></i>
        No matching follow-up calls found
      </div>
    `;
    return;
  }

  filtered.forEach(function (lead) {
    var card = document.createElement("div");
    card.className = "tc-lead-card";
    card.setAttribute("data-priority", lead.priority);

    card.innerHTML = `
      <div class="tc-lead-main">
        <div class="tc-lead-meta">
          <span class="tc-lead-id">${lead.id}</span>
          <span class="tc-priority-badge tc-priority-badge--${lead.priority}">${lead.priority.toUpperCase()}</span>
          <span class="tc-service-tag">${lead.service}</span>
        </div>
        <h2 class="tc-lead-name">${lead.name}</h2>
        <div class="tc-lead-details">
          <span><i class="fa-solid fa-location-dot"></i> ${lead.area}</span>
          <span><i class="fa-solid fa-headset"></i> ${lead.source}</span>
          <span><i class="fa-regular fa-clock"></i> ${lead.timing}</span>
        </div>
      </div>
      <div class="tc-lead-action">
        <div class="tc-calls-count">
          <span class="tc-calls-num">${lead.calls}</span>
          <span class="tc-calls-label">Calls</span>
        </div>
        <button class="tc-call-btn" onclick="initiateCall('${lead.id}', '${lead.name}')">
          <i class="fa-solid fa-phone"></i> Call
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

// Function to handle clicking on Call button
window.initiateCall = function (id, name) {
  // Redirect to dialer screen
  window.location.href = "/telecaller-call?lead=" + id;
};

// Handle logout
window.handleLogout = function () {
  var headers = {};
  if (window.csrf_token) {
    headers['X-Frappe-CSRF-Token'] = window.csrf_token;
  }
  fetch('/api/method/logout', {
    method: 'POST',
    headers: headers
  })
  .then(function () {
    window.location.href = '/login';
  })
  .catch(function () {
    window.location.href = '/login';
  });
};
