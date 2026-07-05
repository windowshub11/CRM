import frappe
from frappe.www.login import get_context as frappe_get_context

no_cache = 1

def get_context(context):
    original_user = frappe.session.user
    frappe.session.user = "Guest"
    try:
        context = frappe_get_context(context)
    finally:
        frappe.session.user = original_user
    return context
