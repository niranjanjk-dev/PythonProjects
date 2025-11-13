from flask import Blueprint, render_template

# Define the blueprint
auth = Blueprint("auth", __name__)

@auth.route("/login")
def login():
    # Renders your toggle login/signup card
    return render_template("auth.html")

@auth.route("/sign-up")
def sign_up():
    # Since your auth.html has a toggle, it serves both login and signup
    return render_template("auth.html")

@auth.route("/logout")
def logout():
    # For now, just redirect to login or home
    return render_template("auth.html")