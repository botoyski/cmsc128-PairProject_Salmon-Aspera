from flask import Flask, request, jsonify, session, g, render_template
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
import os

# ───────────────────────────────
# CONFIG
# ───────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE = os.path.join(BASE_DIR, "profiles.db")

app = Flask(__name__, static_folder="static2", static_url_path="/static2", template_folder="templates2")
app.config["SECRET_KEY"] = "replace_with_real_secret"
app.config["DATABASE"] = DATABASE


# ───────────────────────────────
# DATABASE HELPERS
# ───────────────────────────────
def get_db():
    db = getattr(g, "_database", None)
    if db is None:
        db = g._database = sqlite3.connect(app.config["DATABASE"])
        db.row_factory = sqlite3.Row
    return db


def init_db():
    db = get_db()
    db.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            username TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL
        )
        """
    )
    db.commit()


@app.before_request
def initialize():
    # Only initialize once per app context
    if not hasattr(g, "_db_initialized"):
        init_db()
        g._db_initialized = True



@app.teardown_appcontext
def close_db(exception):
    db = getattr(g, "_database", None)
    if db is not None:
        db.close()


# ───────────────────────────────
# HELPERS
# ───────────────────────────────
def current_user():
    uid = session.get("user_id")
    if not uid:
        return None
    db = get_db()
    return db.execute("SELECT * FROM users WHERE id = ?", (uid,)).fetchone()


def login_user(user_id):
    session.clear()
    session["user_id"] = user_id


def logout_user():
    session.clear()


# ───────────────────────────────
# PAGE ROUTES (render HTML)
# ───────────────────────────────
@app.route("/")
def home():
    if current_user():
        return render_template("profile.html")
    return render_template("login.html")


@app.route("/login")
def login_page():
    return render_template("login.html")

@app.route("/profile")
def profile_page():
    user = current_user()
    if not user:
        return render_template("login.html")
    return render_template("profile.html")


@app.route("/recover")
def recover_page():
    return render_template("recover.html")


# ───────────────────────────────
# API ROUTES (fetch() JSON endpoints)
# ───────────────────────────────

# SIGNUP
@app.route("/signup", methods=["GET", "POST"])
def signup_page():
    if request.method == "GET":
        return render_template("signup.html")

    data = request.get_json()
    name = data.get("name")
    username = data.get("username")
    password = data.get("password")

    if not all([name, username, password]):
        return jsonify({"status": "error", "message": "All fields required"}), 400

    db = get_db()

    existing = db.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
    if existing:
        return jsonify({"status": "error", "message": "Username already exists"}), 400

    # ✅ hash password and store it in the correct column
    hashed = generate_password_hash(password)
    db.execute(
        "INSERT INTO users (name, username, password_hash) VALUES (?, ?, ?)",
        (name, username, hashed)
    )
    db.commit()

    return jsonify({
        "status": "success",
        "message": "Account created!",
        "redirect": "/login"
    })


# LOGIN
@app.route("/login", methods=["POST"])
def api_login():
    data = request.get_json()
    username = data.get("username", "").strip()
    password = data.get("password", "")

    db = get_db()
    user = db.execute("SELECT * FROM users WHERE username=?", (username,)).fetchone()

    if user and check_password_hash(user["password_hash"], password):
        login_user(user["id"])
        return jsonify(
            {"success": True, "message": "Login successful!", "redirect": "/profile"}
        )

    return jsonify({"success": False, "message": "Invalid username or password."}), 401


# PROFILE UPDATE
@app.route("/profile", methods=["POST"])
def api_profile_update():
    user = current_user()
    if not user:
        return jsonify({"success": False, "message": "Not logged in."}), 403

    data = request.get_json()
    new_name = data.get("name", "").strip()
    new_username = data.get("username", "").strip()
    new_password = data.get("password", "")

    if not new_name or not new_username:
        return jsonify({"success": False, "message": "Name and username required."}), 400

    db = get_db()
    # prevent duplicate usernames
    other = db.execute(
        "SELECT * FROM users WHERE lower(username)=lower(?) AND id != ?",
        (new_username, user["id"]),
    ).fetchone()
    if other:
        return jsonify({"success": False, "message": "Username already taken."}), 400

    if new_password:
        hashed = generate_password_hash(new_password)
        db.execute(
            "UPDATE users SET name=?, username=?, password_hash=? WHERE id=?",
            (new_name, new_username, hashed, user["id"]),
        )
    else:
        db.execute(
            "UPDATE users SET name=?, username=? WHERE id=?",
            (new_name, new_username, user["id"]),
        )

    db.commit()
    return jsonify({"success": True, "message": "Profile updated successfully!"})


# RECOVER PASSWORD
@app.route("/recover", methods=["POST"])
def api_recover():
    data = request.get_json()
    username = data.get("usernameInput", "").strip()
    new_pass = data.get("newPassword", "")
    repeat = data.get("repeatPassword", "")
    action = data.get("action", "verify")

    db = get_db()

    if action == "verify":
        user = db.execute("SELECT * FROM users WHERE username=?", (username,)).fetchone()
        if not user:
            return jsonify({"success": False, "message": "No account found."}), 404
        session["recover_user_id"] = user["id"]
        return jsonify(
            {"success": True, "message": "Account verified! Proceed to reset."}
        )

    if action == "reset":
        uid = session.get("recover_user_id")
        if not uid:
            return jsonify({"success": False, "message": "Please verify first."}), 403

        if new_pass != repeat:
            return jsonify({"success": False, "message": "Passwords do not match."}), 400

        hashed = generate_password_hash(new_pass)
        db.execute("UPDATE users SET password_hash=? WHERE id=?", (hashed, uid))
        db.commit()
        session.pop("recover_user_id", None)
        return jsonify(
            {"success": True, "message": "Password reset successful!", "redirect": "/login"}
        )


# LOGOUT
@app.route("/logout", methods=["POST"])
def api_logout():
    logout_user()
    return jsonify({"success": True, "message": "Logged out successfully!", "redirect": "/login"})


# ───────────────────────────────
# MAIN
# ───────────────────────────────
if __name__ == "__main__":
    with app.app_context():
        init_db()
    app.run(debug=True)