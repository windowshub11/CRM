/* ==========================================================================
   LEADCALL CRM - ACTIVE DIALER JS (telecaller-dialer.js)
   ========================================================================== */

'use strict';

// Mock DB to query parameters matching lead details
var leadDatabase = {
  "LEAD-0004": {
    name: "Sneha Desai",
    phone: "+91 96986 33579",
    area: "Goregaon",
    source: "Facebook",
    service: "Home Buying",
    age: "about 20 hours"
  },
  "LEAD-0037": {
    name: "Lakshmi Rao",
    phone: "+91 98765 43210",
    area: "Malad",
    source: "Facebook",
    service: "Home Buying",
    age: "1 day ago"
  },
  "LEAD-0030": {
    name: "Sneha Desai",
    phone: "+91 95555 44444",
    area: "Thane",
    source: "Facebook",
    service: "Home Buying",
    age: "2 days ago"
  },
  "LEAD-0001": {
    name: "Meera Patel",
    phone: "+91 94444 33333",
    area: "Malad",
    source: "Website",
    service: "Seepage",
    age: "4 days ago"
  },
  "LEAD-0027": {
    name: "Sanjay Gupta",
    phone: "+91 93333 22222",
    area: "Malad",
    source: "JustDial",
    service: "Seepage",
    age: "7 days ago"
  },
  "LEAD-0040": {
    name: "Kavita Joshi",
    phone: "+91 92222 11111",
    area: "Andheri",
    source: "Walk-in",
    service: "Home Buying",
    age: "in 1 day"
  },
  "LEAD-0007": {
    name: "Deepak Reddy",
    phone: "+91 91111 00000",
    area: "Bandra",
    source: "JustDial",
    service: "Seepage",
    age: "in 2 days"
  }
};

document.addEventListener("DOMContentLoaded", function () {
  // Bind dynamic lead variables
  bindLeadDetails();

  // Start call timer stopwatch
  startCallTimer();
});

function bindLeadDetails() {
  var params = new URLSearchParams(window.location.search);
  var leadId = params.get("lead") || "LEAD-0004"; // Fallback to Sneha Desai

  var lead = leadDatabase[leadId];
  if (!lead) return;

  // Bind values to UI elements
  document.getElementById("leadName").textContent = lead.name;
  document.getElementById("leadPhone").textContent = lead.phone;
  document.getElementById("leadArea").textContent = lead.area;
  document.getElementById("leadSource").textContent = lead.source;
  document.getElementById("leadService").textContent = lead.service;
  document.getElementById("calcServiceTag").textContent = lead.service;
  document.getElementById("leadAge").textContent = lead.age;

  document.getElementById("dialName").textContent = lead.name;
  document.getElementById("dialPhone").textContent = lead.phone;

  // Update name inside opening script replacement
  var scriptNameEl = document.querySelector(".script-replace-name");
  if (scriptNameEl) {
    scriptNameEl.textContent = lead.name;
  }
}

// Stopwatch timer variables
var seconds = 6; // Starts at 6s just like the screenshot mockup
var timerInterval = null;

function startCallTimer() {
  var headerTimer = document.getElementById("headerTimer");
  var dialLargeTimer = document.getElementById("dialLargeTimer");

  timerInterval = setInterval(function () {
    seconds++;
    var mins = Math.floor(seconds / 60);
    var secs = seconds % 60;
    
    var timeString = (mins < 10 ? "0" + mins : mins) + ":" + (secs < 10 ? "0" + secs : secs);
    
    if (headerTimer) headerTimer.textContent = timeString;
    if (dialLargeTimer) dialLargeTimer.textContent = timeString;
  }, 1000);
}

// Handle accordion click toggling
window.toggleAccordion = function (btn) {
  var item = btn.closest(".tc-accordion-item");
  var icon = btn.querySelector("i");
  
  if (item.classList.contains("active")) {
    item.classList.remove("active");
    if (icon) icon.className = "fa-solid fa-chevron-down";
  } else {
    // Collapse others in script list
    var siblings = item.parentNode.querySelectorAll(".tc-accordion-item");
    siblings.forEach(function (sib) {
      sib.classList.remove("active");
      var sibIcon = sib.querySelector(".tc-accordion-header i");
      if (sibIcon) sibIcon.className = "fa-solid fa-chevron-down";
    });

    item.classList.add("active");
    if (icon) icon.className = "fa-solid fa-chevron-up";
  }
};

// Handle disposition selection
window.selectDisposition = function (btn, dispositionName) {
  // Clear active from all
  var container = btn.parentNode;
  container.querySelectorAll(".tc-disp-btn").forEach(function (el) {
    el.classList.remove("active");
  });

  // Make clicked active
  btn.classList.add("active");

  // Update labels
  document.getElementById("activeDispBadge").textContent = dispositionName;
};

// Hang up button
window.endCall = function () {
  clearInterval(timerInterval);
  var dispVal = document.getElementById("activeDispBadge").textContent;
  alert("Call ended. Disposition saved: " + dispVal);
  // Redirect back to today's actions page
  window.location.href = "/telecaller-actions";
};

// WhatsApp sender
window.sendReport = function () {
  var name = document.getElementById("leadName").textContent;
  alert("Sending PDF report to " + name + " via WhatsApp API...");
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
