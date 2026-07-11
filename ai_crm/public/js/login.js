/* =====================================================
   LOGIN.JS – Saarva Admin CRM
   Authenticates against Frappe and redirects dynamically
   ===================================================== */

'use strict';

/**
 * Handle login form submission
 */
function handleLogin(e) {
  e.preventDefault();

  var username = document.getElementById('loginEmail').value.trim();
  var password = document.getElementById('loginPassword').value;
  var errorEl  = document.getElementById('loginError');
  var btn      = document.getElementById('loginBtn');
  var btnText  = document.getElementById('loginBtnText');

  // Clear any previous error
  errorEl.textContent = '';

  if (!username || !password) {
    errorEl.textContent = '⚠️ Please enter your username and password.';
    return;
  }

  // Loading state
  btn.disabled        = true;
  btnText.textContent = 'Signing in…';

  // Call Frappe's built-in login API
  var headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };
  if (window.csrf_token) {
    headers['X-Frappe-CSRF-Token'] = window.csrf_token;
  }

  fetch('/api/method/login', {
    method: 'POST',
    headers: headers,
    body: new URLSearchParams({
      usr: username,
      pwd: password
    })
  })
  .then(function (res) {
    return res.json().then(function (data) {
      return { status: res.status, data: data };
    });
  })
  .then(function (result) {
    console.log('Login API response:', result.status, result.data);

    if (result.status === 200) {
      // ✅ Login success — Fetch the role-based redirect target from the server.
      // Use GET to avoid CSRF validation issues with the newly created session.
      fetch('/api/method/ai_crm.api.get_login_redirect', {
        method: 'GET'
      })
      .then(function (res) {
        if (!res.ok) {
          throw new Error('HTTP error ' + res.status);
        }
        return res.json();
      })
      .then(function (response) {
        var data = response.message || {};
        var redirectTarget = data.redirect_target;

        if (redirectTarget) {
          window.location.href = redirectTarget;
        } else {
          errorEl.textContent = '❌ Redirect target not found.';
          btn.disabled        = false;
          btnText.textContent = 'Sign In';
        }
      })
      .catch(function (err) {
        console.error('Error fetching redirect target:', err);
        errorEl.textContent = '❌ Failed to determine redirection path.';
        btn.disabled        = false;
        btnText.textContent = 'Sign In';
      });

    } else {
      // ❌ Wrong credentials or other login error
      var msg = 'Invalid login credentials.';
      if (result.data) {
        if (result.data.message) {
          msg = result.data.message;
        } else if (result.data._server_messages) {
          try {
            var serverMsgs = JSON.parse(result.data._server_messages);
            var parsedMsgs = [];
            for (var i = 0; i < serverMsgs.length; i++) {
              var val = serverMsgs[i];
              try {
                parsedMsgs.push(JSON.parse(val).message);
              } catch (e) {
                parsedMsgs.push(val);
              }
            }
            if (parsedMsgs.length > 0) {
              msg = parsedMsgs.join(' ');
            }
          } catch (e) {
            console.error('Error parsing server messages:', e);
          }
        }
      }
      errorEl.textContent = '❌ ' + msg;
      btn.disabled        = false;
      btnText.textContent = 'Sign In';
    }
  })
  .catch(function (err) {
    console.error('Network error during login:', err);
    errorEl.textContent = '❌ Network error. Please try again.';
    btn.disabled        = false;
    btnText.textContent = 'Sign In';
  });
}

/**
 * Toggle password field visibility
 */
function togglePassword() {
  var input = document.getElementById('loginPassword');
  var icon  = document.getElementById('eyeIcon');

  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.replace('fa-eye', 'fa-eye-slash');
  } else {
    input.type = 'password';
    icon.classList.replace('fa-eye-slash', 'fa-eye');
  }
}
