from flask import Flask, request, jsonify, render_template, session, g, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import os, time


# ───────────────────────────────
# CONFIGURATION
# ───────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "app.db")


app = Flask(__name__, static_folder="static", template_folder="templates")
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{DB_PATH}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = "replace_with_real_secret"


db = SQLAlchemy(app)


# ───────────────────────────────
# PREVENT BROWSER CACHING (NEW)
# ───────────────────────────────
@app.after_request
def add_header(response):
    """
    Prevent browser caching for authenticated pages.
    Forces browser to always fetch fresh page from server.
    """
    if request.endpoint not in ['login_page', 'signup_page', 'recover_page', 'static']:
        response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '-1'
    return response


# ───────────────────────────────
# DATABASE MODELS
# ───────────────────────────────
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    security_question = db.Column(db.String(200), nullable=True)  # NEW
    security_answer = db.Column(db.String(200), nullable=True)     # NEW
    tasks = db.relationship("Task", backref="user", lazy=True)


class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, default="")
    priority = db.Column(db.String(10), default="low")
    status = db.Column(db.String(20), default="notStarted")
    dueDate = db.Column(db.String(20), nullable=True)
    dueTime = db.Column(db.String(20), nullable=True)
    createdAt = db.Column(db.String(30), default=lambda: time.strftime("%Y-%m-%d %H:%M:%S"))
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)


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


with app.app_context():
    db.create_all()


# ───────────────────────────────
# SESSION / AUTH HELPERS
# ───────────────────────────────
def current_user():
    uid = session.get("user_id")
    if not uid:
        return None
    return User.query.get(uid)


def login_user(user_id):
    session.clear()
    session["user_id"] = user_id


def logout_user():
    session.clear()


# ───────────────────────────────
# PAGE ROUTES (Frontend)
# ───────────────────────────────
@app.route("/")
def home():
    if current_user():
        return render_template("index.html")
    return render_template("login.html")


@app.route("/login")
def login_page():
    return render_template("login.html")


@app.route("/signup")
def signup_page():
    return render_template("signup.html")


@app.route("/recover")
def recover_page():
    return render_template("recover.html")


@app.route("/index")
def index_page():
    user = current_user()
    if not user:
        return render_template("login.html")
    return render_template("index.html")


# ───────────────────────────────
# AUTH API (Signup / Profile / Login / Logout / Recover)
# ───────────────────────────────
@app.route("/signup", methods=["POST"])
def api_signup():
    data = request.get_json()
    name = data.get("name", "").strip()
    username = data.get("username", "").strip()
    password = data.get("password", "")
    security_question = data.get("securityQuestion", "").strip()  # NEW
    security_answer = data.get("securityAnswer", "").strip()      # NEW


    if not all([name, username, password, security_question, security_answer]):
        return jsonify({"status": "error", "message": "All fields required"}), 400


    if User.query.filter_by(username=username).first():
        return jsonify({"status": "error", "message": "Username already exists"}), 400


    hashed = generate_password_hash(password)
    new_user = User(
        name=name, 
        username=username, 
        password_hash=hashed,
        security_question=security_question,  # NEW
        security_answer=security_answer.lower()  # NEW - store lowercase for comparison
    )
    db.session.add(new_user)
    db.session.commit()


    return jsonify({"status": "success", "message": "Account created!", "redirect": "/login"})


@app.route("/profile", methods=["GET", "POST"])
def profile_page():
    # ✅ Check if user is logged in
    user_id = session.get("user_id")
    if not user_id:
        return render_template("login.html")


    # ✅ GET: show profile page
    if request.method == "GET":
        return render_template("profile.html")


    # ✅ POST: update user data
    data = request.get_json()
    new_name = data.get("name", "").strip()
    new_username = data.get("username", "").strip()
    new_password = data.get("password", "").strip()


    if not new_name or not new_username:
        return jsonify({"success": False, "message": "Name and username required."}), 400


    user = User.query.get(user_id)
    if not user:
        return jsonify({"success": False, "message": "User not found."}), 404


    # Check if username is taken by someone else
    other = User.query.filter(User.username == new_username, User.id != user_id).first()
    if other:
        return jsonify({"success": False, "message": "Username already taken."}), 400


    # Update fields
    user.name = new_name
    user.username = new_username
    if new_password:
        user.password_hash = generate_password_hash(new_password)


    db.session.commit()
    return jsonify({"success": True, "message": "Profile updated successfully!"})



@app.route("/login", methods=["POST"])
def api_login():
    data = request.get_json()
    username = data.get("username", "").strip()
    password = data.get("password", "")
    user = User.query.filter_by(username=username).first()


    if user and check_password_hash(user.password_hash, password):
        login_user(user.id)
        return jsonify({"success": True, "message": "Login successful!", "redirect": "/index"})
    return jsonify({"success": False, "message": "Invalid username or password."}), 401


@app.route("/logout", methods=["POST"])
def api_logout():
    logout_user()
    return jsonify({"success": True, "message": "Logged out!", "redirect": "/login"})


@app.route("/api/check-session")
def check_session():
    user = current_user()
    if not user:
        return jsonify({"logged_in": False})
    return jsonify({"logged_in": True, "username": user.username})


@app.route("/recover", methods=["POST"])
def api_recover():
    data = request.get_json()
    action = data.get("action", "verify")
    
    # Step 1: Verify username/email exists
    if action == "verify":
        username_input = data.get("usernameInput", "").strip()
        
        if not username_input:
            return jsonify({"success": False, "message": "Please provide username or email."}), 400
        
        user = User.query.filter_by(username=username_input).first()
        
        if user:
            # Store username in session for later steps
            session['recovery_username'] = username_input
            return jsonify({
                "success": True,
                "message": "Account verified",
                "securityQuestion": user.security_question  # Return the question
            })
        else:
            return jsonify({"success": False, "message": "Account not found."}), 404
    
    # Step 2: Verify security answer
    elif action == "verifyAnswer":
        username_input = data.get("usernameInput", "").strip()
        security_answer = data.get("securityAnswer", "").strip()
        
        if not security_answer:
            return jsonify({"success": False, "message": "Please provide your security answer."}), 400
        
        user = User.query.filter_by(username=username_input).first()
        
        if user and user.security_answer and user.security_answer.lower() == security_answer.lower():
            # Store verification in session
            session['answer_verified'] = True
            return jsonify({"success": True, "message": "Security answer verified"})
        else:
            return jsonify({"success": False, "message": "Incorrect security answer."}), 401
    
    # Step 3: Reset password
    elif action == "reset":
        # Check if user completed verification steps
        if not session.get('answer_verified'):
            return jsonify({"success": False, "message": "Please verify your security answer first."}), 403
        
        username_input = data.get("usernameInput", "").strip()
        new_password = data.get("newPassword", "").strip()
        repeat_password = data.get("repeatPassword", "").strip()
        
        if not new_password or not repeat_password:
            return jsonify({"success": False, "message": "Please fill in both password fields."}), 400
        
        if new_password != repeat_password:
            return jsonify({"success": False, "message": "Passwords do not match."}), 400
        
        user = User.query.filter_by(username=username_input).first()
        
        if user:
            # Hash and update password
            user.password_hash = generate_password_hash(new_password)
            db.session.commit()
            
            # Clear session
            session.pop('recovery_username', None)
            session.pop('answer_verified', None)
            
            return jsonify({
                "success": True,
                "message": "Password reset successful",
                "redirect": "/login"
            })
        else:
            return jsonify({"success": False, "message": "User not found."}), 404
    
    # If no action matches, return error
    else:
        return jsonify({"success": False, "message": "Invalid action."}), 400


# ───────────────────────────────
# TASK API ROUTES
# ───────────────────────────────
@app.route("/api/tasks", methods=["GET"])
def get_tasks():
    user = current_user()
    if not user:
        return jsonify({"error": "Not logged in"}), 403


    tasks = Task.query.filter_by(user_id=user.id).all()
    return jsonify([t.to_dict() for t in tasks])


@app.route("/api/tasks", methods=["POST"])
def add_task():
    user = current_user()
    if not user:
        return jsonify({"error": "Not logged in"}), 403


    data = request.get_json()
    task = Task(
        title=data.get("title", ""),
        description=data.get("description", ""),
        priority=data.get("priority", "low"),
        status=data.get("status", "notStarted"),
        dueDate=data.get("dueDate"),
        dueTime=data.get("dueTime"),
        user_id=user.id
    )
    db.session.add(task)
    db.session.commit()
    return jsonify(task.to_dict()), 201


@app.route("/api/tasks/<int:task_id>", methods=["PUT"])
def edit_task(task_id):
    user = current_user()
    if not user:
        return jsonify({"error": "Not logged in"}), 403


    data = request.get_json()
    task = Task.query.filter_by(id=task_id, user_id=user.id).first()
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
    user = current_user()
    if not user:
        return jsonify({"error": "Not logged in"}), 403


    data = request.get_json()
    task = Task.query.filter_by(id=task_id, user_id=user.id).first()
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
    user = current_user()
    if not user:
        return jsonify({"error": "Not logged in"}), 403


    task = Task.query.filter_by(id=task_id, user_id=user.id).first()
    if not task:
        return jsonify({"error": "Task not found"}), 404


    db.session.delete(task)
    db.session.commit()
    return "", 204


# ───────────────────────────────
# RUN APP
# ───────────────────────────────
if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000)),
        debug=True
    )