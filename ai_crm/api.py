import frappe

@frappe.whitelist()
def get_login_redirect():
    """
    Returns the appropriate redirect target and telecaller status 
    based on the logged-in user's roles.
    """
    user = frappe.session.user
    roles = frappe.get_roles(user)
    
    if "System Manager" in roles or "Administrator" in roles or user == "Administrator":
        return {
            "redirect_target": "/app",
            "is_telecaller": False
        }
    elif "CRM Admin" in roles:
        return {
            "redirect_target": "/crm-dashboard",
            "is_telecaller": False
        }
    elif "CRM Telecaller" in roles:
        return {
            "redirect_target": "/telecaller-performance",
            "is_telecaller": True
        }
    else:
        # Default fallback for other users
        return {
            "redirect_target": "/app",
            "is_telecaller": False
        }
