import frappe

def run():
    print("--- Web Page DocTypes in Database ---")
    pages = frappe.db.get_all("Web Page", fields=["name", "title", "route"])
    for page in pages:
        print(f"Name: {page.name} | Title: {page.title} | Route: {page.route}")

def print_page_details():
    print("--- Conflicting Page Details ---")
    try:
        doc = frappe.get_doc("Web Page", "crm")
        print("Title:", doc.title)
        print("Route:", doc.route)
        print("Published:", doc.published)
        print("Main Section (HTML/Markdown):", doc.main_section[:200] if doc.main_section else "None")
        print("Template:", doc.template_path if hasattr(doc, "template_path") else "None")
    except Exception as e:
        print("Error:", e)

def delete_page():
    print("Deleting conflicting Web Page doc 'crm'...")
    try:
        frappe.delete_doc("Web Page", "crm")
        frappe.db.commit()
        print("Deleted successfully!")
    except Exception as e:
        print("Error:", e)
