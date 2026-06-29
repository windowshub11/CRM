import frappe

no_cache = 1

def get_context(context):
    user = frappe.session.user
    context.logged_in = user != "Guest"
    context.username = user
    if context.logged_in:
        context.user_fullname = frappe.db.get_value("User", user, "full_name") or user
    else:
        context.user_fullname = "Guest"
