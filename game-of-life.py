from flask import Flask, render_template, request, jsonify
from flask_mongoengine import MongoEngine
import json
app = Flask(__name__)

DB_URI = "mongodb+srv://user1:dookie12345@usergrids.iljie.mongodb.net/grid?retryWrites=true&w=majority"

app.config["MONGODB_HOST"] = DB_URI

db = MongoEngine()
db.init_app(app)

class Grid(db.Document):
    GridName = db.StringField()
    GridState = db.StringField()
    def to_json(self):
        return {
            'GridName': self.GridName, 
            'GridState': self.GridState,
        }

@app.route('/')
def index():
    userGrids = Grid.objects()
    jsonify([Grid.to_json() for Grid in userGrids])
    return render_template("index.html", userGrids = userGrids)

@app.route('/UploadGrid')
def UploadGrid():
    userGridName = request.args.get('userGridName', 0, type=str)
    userGridState = request.args.get('userGridState', 0, type=str)
    Grid(GridName=userGridName, GridState=userGridState).save()
    return jsonify(gridName=userGridName)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80)