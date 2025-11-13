from flask import Blueprint, render_template

# Define the blueprint
views = Blueprint("views", __name__)

@views.route("/")
def home():
    # Based on your previous requests, the gallery is your main view
    return render_template("gallery.html")

@views.route("/add-content")
def add_content():
    # This renders the 'Add Magic' page
    return render_template("add_content.html")

@views.route("/profile")
def profile():
    # Placeholder for profile
    return render_template("base.html")