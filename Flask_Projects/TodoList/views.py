from flask import Blueprint
from flask import render_template
views= Blueprint("views", __name__)

@views.route("/")
def home():
    return "Hello"

@views.route("/profile/<username>")
def profile(username):
    return render_template("index.html", name=username)
