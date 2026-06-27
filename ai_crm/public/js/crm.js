document.addEventListener('DOMContentLoaded', function () {
    console.log("CRM JS loaded. User logged in:", window.crm_user_logged_in);

    // DOM Elements
    const loginScreen = document.getElementById('login-screen');
    const dashboardScreen = document.getElementById('dashboard-screen');

    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');
    const passwordToggle = document.getElementById('password-toggle');
    const loginError = document.getElementById('login-error');
    const loginBtnText = document.getElementById('login-btn-text');
    const loginBtnSpinner = document.getElementById('login-btn-spinner');

    const sidebarMenuItems = document.querySelectorAll('.menu-item');
    const contentTitle = document.getElementById('main-content-title');
    const contentSubtitle = document.getElementById('main-content-subtitle');
    const dashboardStats = document.getElementById('dashboard-stats-view');
    const genericSubpage = document.getElementById('generic-subpage-view');
    const subpageTitle = document.getElementById('subpage-title');
    const logoutBtn = document.getElementById('logout-btn');

    // 1. Session & View Initialization
    // Check if user is logged in based on Jinja-supplied variable
    const isLoggedIn = !!window.crm_user_logged_in;

    if (isLoggedIn) {
        console.log("User is logged in. Showing dashboard.");
        showScreen('dashboard');
    } else {
        console.log("User is guest. Showing login screen.");
        showScreen('login');
    }

    function showScreen(screen) {
        if (screen === 'login') {
            loginScreen.classList.add('active');
            dashboardScreen.classList.remove('active');
            document.body.style.backgroundColor = '#f1f5f9';
        } else {
            loginScreen.classList.remove('active');
            dashboardScreen.classList.add('active');
            document.body.style.backgroundColor = '#faf8f5'; // Warm background
        }
    }

    // 2. Input Visual Effects
    const inputs = [usernameInput, passwordInput];
    inputs.forEach(input => {
        if (input) {
            // Initial check
            if (input.value) input.classList.add('has-value');

            input.addEventListener('input', () => {
                if (input.value) {
                    input.classList.add('has-value');
                } else {
                    input.classList.remove('has-value');
                }
            });
        }
    });

    // 3. Password Visibility Toggle
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function (e) {
            e.preventDefault();
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            // Toggle eye icon SVG
            if (type === 'text') {
                passwordToggle.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                `;
            } else {
                passwordToggle.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                `;
            }
        });
    }

    // 4. Form Submission and Authentication
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            console.log("Login form submit intercepted.");

            const username = usernameInput.value.trim();
            const password = passwordInput.value;

            if (!username || !password) {
                showError('Please fill in all fields.');
                return;
            }

            // Start loading state
            hideError();
            setLoading(true);

            // Call Frappe login API - NO CSRF token needed for login
            console.log("Sending login request for:", username);

            const formData = new URLSearchParams();
            formData.append("usr", username);
            formData.append("pwd", password);

            fetch("/api/method/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: formData,
                credentials: "same-origin"
            })
                .then(async (res) => {
                    console.log("Status:", res.status);

                    const data = await res.json();
                    console.log("Response:", data);

                    if (res.ok) {
                        console.log("Login successful!");
                        window.location.href = "/dashboard";
                    } else {
                        showError(data.message || "Invalid username or password");
                        setLoading(false);
                    }
                })
                .catch(err => {
                    console.error("Login Error:", err);
                    showError("Network Error");
                    setLoading(false);
                });
        });
    }

    function setLoading(isLoading) {
        if (isLoading) {
            loginBtnText.textContent = 'Logging in...';
            if (loginBtnSpinner) loginBtnSpinner.style.display = 'inline-block';
            usernameInput.disabled = true;
            passwordInput.disabled = true;
        } else {
            loginBtnText.textContent = 'Login';
            if (loginBtnSpinner) loginBtnSpinner.style.display = 'none';
            usernameInput.disabled = false;
            passwordInput.disabled = false;
        }
    }

    function showError(msg) {
        console.warn("Showing error to user:", msg);
        if (loginError) {
            loginError.textContent = msg;
            loginError.style.display = 'block';
        }
    }

    function hideError() {
        if (loginError) {
            loginError.style.display = 'none';
        }
    }

    // 5. Sidebar Tabs Navigation & Subpage Switching
    sidebarMenuItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();

            // Remove active class from all items
            sidebarMenuItems.forEach(mi => mi.classList.remove('active'));

            // Add active class to clicked item
            this.classList.add('active');

            // Get selected page label
            const label = this.getAttribute('data-label') || this.textContent.trim();
            console.log("Sidebar click navigation to:", label);

            if (label === 'Dashboard') {
                // Show core dashboard panels
                contentTitle.textContent = 'Admin Dashboard';
                contentSubtitle.textContent = 'Overview and quick actions for business team';
                dashboardStats.style.display = 'block';
                genericSubpage.style.display = 'none';
            } else {
                // Show generic subpage panel for other tabs
                contentTitle.textContent = label;
                contentSubtitle.textContent = `Management and settings for ${label.toLowerCase()}`;
                subpageTitle.textContent = label;
                dashboardStats.style.display = 'none';
                genericSubpage.style.display = 'block';
            }
        });
    });

    // 6. Logout Implementation
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            console.log("Logout clicked. Sending request...");

            fetch('/api/method/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
                .then(() => {
                    console.log("Logged out successfully. Redirecting to /crm...");
                    window.location.href = '/crm';
                })
                .catch(err => {
                    console.error('Logout error:', err);
                    window.location.href = '/api/method/logout';
                });
        });
    }
});
