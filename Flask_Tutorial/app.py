from flask import Flask, render_template # pyright: ignore[reportMissingImports]
from views import views

app = Flask(__name__)
app.register_blueprint(views, url_prefix="/")


@app.route("/")
def index():
    return "Home"

@app.route("/search/<query>")
def search_results(query):
    return f"You Searched For: {query}"

@app.route("/<int:id>")
def integer(id):
    return f"hello {id}"

@app.route("/<float:myfloat>")
def floatmy(myfloat):
    return f"This is the float"

@app.route("/<string:Mystring>")
def mystring(Mystring):
    return f" This is a {type(Mystring).__name__}"

Articles=[
    {"title":"HelleWorld",
     "price":3498},
    {"title":"Pen&NoteBook",
     "price":3428}
]

My_Niranjan="Hello Niranjan"

@app.route("/template")
def mytemplate():
    return render_template("index.html", Varible=Articles, name=My_Niranjan)





if __name__== "__main__":
    app.run(debug=True) 