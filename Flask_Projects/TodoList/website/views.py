from flask import Blueprint, render_template

views = Blueprint("views", __name__)

@views.route("/gallery")
def home():
    return render_template("gallery.html")

@views.route("/add-content")
def add_content():
    return render_template("add_content.html")

@views.route("/profile")
def profile():
    return render_template("profile.html")