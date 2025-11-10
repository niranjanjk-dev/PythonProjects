from flask import Blueprint
from flask import render_template

views= Blueprint("views", __name__)

@views.route("/")
def home():
    return "<h1>Hello</h1>"

@views.route("/profile/<username>")
def profile(username):
    return render_template("index.html", name=username)

