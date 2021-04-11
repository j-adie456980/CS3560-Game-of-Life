from flask import Flask, render_template, request, jsonify
from flask_mongoengine import MongoEngine
import json
app = Flask(__name__)

app.config['MONGODB_SETTINGS'] = {
    'db': 'Grids_Database',
    'host': 'localhost',
    'port': 27017
}

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
    app.run()