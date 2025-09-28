from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import time
import os

app = Flask(__name__, static_folder="static", template_folder="templates")
CORS(app)

# ======================
#   DATABASE CONFIG
# ======================
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(BASE_DIR, "tasks.db")
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{db_path}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

# ======================
#   TASK MODEL
# ======================
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, default="")
    priority = db.Column(db.String(10), default="low")
    status = db.Column(db.String(20), default="notStarted")
    dueDate = db.Column(db.String(20), nullable=True)
    dueTime = db.Column(db.String(20), nullable=True)
    createdAt = db.Column(db.String(30), default=lambda: time.strftime("%Y-%m-%d %H:%M:%S"))

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "priority": self.priority,
            "status": self.status,
            "dueDate": self.dueDate,
            "dueTime": self.dueTime,
            "createdAt": self.createdAt,
        }

# Create the database file and tables if not exists
with app.app_context():
    db.create_all()

# ======================
#        API ROUTES
# ======================

@app.route("/api/tasks", methods=["GET"])
def get_tasks():
    tasks = Task.query.all()
    return jsonify([t.to_dict() for t in tasks])

@app.route("/api/tasks", methods=["POST"])
def add_task():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON payload"}), 400

    task = Task(
        title=data.get("title", ""),
        description=data.get("description", ""),
        priority=data.get("priority", "low"),
        status=data.get("status", "notStarted"),
        dueDate=data.get("dueDate"),
        dueTime=data.get("dueTime"),
    )
    db.session.add(task)
    db.session.commit()
    return jsonify(task.to_dict()), 201

@app.route("/api/tasks/<int:task_id>", methods=["PUT"])
def edit_task(task_id):
    data = request.get_json()
    task = Task.query.get(task_id)

    if not task:
        return jsonify({"error": "Task not found"}), 404

    task.title = data.get("title", task.title)
    task.description = data.get("description", task.description)
    task.priority = data.get("priority", task.priority)
    task.dueDate = data.get("dueDate", task.dueDate)
    task.dueTime = data.get("dueTime", task.dueTime)
    db.session.commit()

    return jsonify(task.to_dict())

@app.route("/api/tasks/<int:task_id>/status", methods=["PATCH"])
def update_status(task_id):
    data = request.get_json()
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Task not found"}), 404

    new_status = data.get("status")
    if new_status not in ["notStarted", "inProgress", "completed"]:
        return jsonify({"error": "Invalid status"}), 400

    task.status = new_status
    db.session.commit()
    return jsonify(task.to_dict())

@app.route("/api/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Task not found"}), 404

    db.session.delete(task)
    db.session.commit()
    return "", 204

# ======================
#   FRONTEND ROUTES
# ======================
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/<path:path>")
def static_proxy(path):
    return send_from_directory(app.static_folder, path)

# ======================
#        RUN APP
# ======================
if __name__ == "__main__":
    app.run(debug=True)