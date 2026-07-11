import frappe

# All protected routes — guests will be redirected to login
PROTECTED_ROUTES = [
    "/area-management",
    "/caller-replacement",
    "/crm-dashboard",
    "/disposition-codes",
    "/lead-import",
    "/lead-management",
    "/lead-source",
    "/price-config",
    "/sample-report",
    "/telecaller-actions",
    "/telecaller-fresh",
    "/telecaller-home",
    "/telecaller-performance",
    "/user-management",
]


def check_route_permission():
    """
    Middleware that runs before every request.
    1. Redirects Guest users to /login if they try to access a protected page.
    2. Restricts CRM Telecaller to Lead Management pages only (no ERPNext Desk).
    3. Restricts CRM Admin to CRM-related pages only (no ERPNext Desk).
    """
    try:
        path = frappe.local.request.path
    except Exception:
        return

    # Do not restrict API, assets, or file paths
    if path.startswith(("/api", "/assets", "/files", "/private")):
        return

    # Do not block native logout commands in query parameters
    if frappe.form_dict.get("cmd") in ("logout", "web_logout"):
        return

    # Strip trailing slashes for clean matching
    clean_path = path.rstrip("/")

    # 1. Guest User handling
    if frappe.session.user == "Guest":
        if clean_path in PROTECTED_ROUTES:
            frappe.local.flags.redirect_location = f"/login?redirect-to={clean_path}"
            raise frappe.Redirect
        return

    # 2. Logged-in User Role-Based Access Control
    roles = frappe.get_roles(frappe.session.user)

    # System Manager & Administrator bypass restrictions
    if "System Manager" in roles or "Administrator" in roles or frappe.session.user == "Administrator":
        return

    # CRM Telecaller restrictions
    if "CRM Telecaller" in roles:
        allowed_prefixes = (
            "/telecaller-",
            "/lead-management",
            "/login",
        )
        if not clean_path.startswith(allowed_prefixes) and clean_path not in ("", "/"):
            frappe.local.flags.redirect_location = "/telecaller-performance"
            raise frappe.Redirect

    # CRM Admin restrictions
    elif "CRM Admin" in roles:
        allowed_prefixes = (
            "/crm-dashboard",
            "/lead-management",
            "/user-management",
            "/area-management",
            "/lead-source",
            "/price-config",
            "/caller-replacement",
            "/disposition-codes",
            "/lead-import",
            "/sample-report",
            "/login",
        )
        if not clean_path.startswith(allowed_prefixes) and clean_path not in ("", "/"):
            frappe.local.flags.redirect_location = "/crm-dashboard"
            raise frappe.Redirect

