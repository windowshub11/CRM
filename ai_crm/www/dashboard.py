import frappe

no_cache = 1

def get_context(context):
    context.user = frappe.session.user