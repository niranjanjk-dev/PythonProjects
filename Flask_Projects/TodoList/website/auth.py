from flask import Blueprint, render_template, request, flash
from zxcvbn import zxcvbn

# Define the blueprint
auth = Blueprint("auth", __name__)

@auth.route("/login")
def login():
    # Renders your toggle login/signup card
    return render_template("auth.html")

@auth.route("/",methods=["GET","POST"])
def base():

    if request.method == "POST":
        if request.form.get("form_id")=="login":
            lg_email=request.form.get("email")
            lg_password=request.form.get("password")

            if len(lg_email)<4:
                flash("Email must me greater than 4 characters", "error")
            elif len(lg_password)<=8:
                flash("Password must be greater than 8 character","error")
            else:
                flash("Login Succesful","success")
                print(lg_email,lg_password)
        elif request.form.get("form_id"):
            sg_username=request.form.get("sg-email")    
            sg_email=request.form.get("sg-email")
            sg_password1=request.form.get("sg-password1")
            sg_password2=request.form.get("sg-password2")
            sg_password_strength=zxcvbn(sg_password1)
            
            if len(sg_username)<=6:
                flash("Username should be greater than 6 characters","error")
            elif len(sg_password1)<=8 or len(sg_password2)<=8:
                flash("Password should be greater than 8 characters","error")
        
            elif sg_password_strength["score"]<2:
                flash("Password is too weak","error")
            
            elif sg_password1!=sg_password2:
                flash("Password do not match", "error")
            else:
                flash("Account Created Successfuly","success")
                print(sg_email,sg_username,sg_password2,sg_password1)
                return render_template("gallery.html")
        else:
            pass
        
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