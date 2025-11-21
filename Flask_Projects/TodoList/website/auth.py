from flask import Blueprint, render_template, request, flash

# Define the blueprint
auth = Blueprint("auth", __name__)

@auth.route("/login")
def login():
    # Renders your toggle login/signup card
    return render_template("auth.html")

@auth.route("/",methods=["GET","POST"])
def base():

    if request.method == "POST":
        lg_email=request.form.get("email")
        lg_password=request.form.get("password")

        if len(lg_password)<=8:
            flash("Wrong password", "error")
    # Since your auth.html has a toggle, it serves both login and signup
    return render_template("auth.html")

@auth.route("/sign-up")
def sign_up():
    # Since your auth.html has a toggle, it serves both login and signup
    return render_template("auth.html")

@auth.route("/logout")
def logout():
    # For now, just redirect to login or home
    return render_template("auth.html")