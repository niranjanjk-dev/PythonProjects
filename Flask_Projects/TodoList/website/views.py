from flask import Blueprint , request
from flask import render_template

views= Blueprint("views", __name__)

@views.route("/")
def home():
    return "<h1>Hello</h1>"

@views.route("/profile",methods=["GET","POST"])
def form_handdling():
    if request.method == "POST":
        title=request.form.get(Title)
        content= request.form.get(content)
        print(title,content)
        return f"<h1>{title,content}</h1>"

    return render_template("index.html" )

