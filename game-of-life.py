from flask import Flask, render_template, request, jsonify
app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/UploadGrid')
def UploadGrid():
    userGridName = request.args.get('userGridName', 0, type=str)
    userGridState = request.args.get('userGridState', 0, type=str)
    print(userGridName)
    print(userGridState)
    return jsonify(result=userGridName)

if __name__ == "__main__":
    app.run()