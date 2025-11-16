from flask import Blueprint, render_template

views = Blueprint("views", __name__)

@views.route("/home")
def home():
    return render_template("home.html")

@views.route("/gallery")
def gallery():
    return render_template("gallery.html")

@views.route("/add-content")
def add_content():
    return render_template("add_content.html")

@views.route("/profile")
def profile():
    return render_template("profile.html")

@views.route("/about")
def about():
    return render_template("about.html")

@views.route("/contact")
def contact():
    return render_template("contact.html")

