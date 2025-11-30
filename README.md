# cmsc128-PairProject_Salmon-Aspera
Full Stack to do list web app

Q: Which backend we chose
A:
For this project, we used Flask (a lightweight Python web framework) with SQLite as the database.​
Flask provides the web server, page routing, and API endpoints.​
SQLite stores users and tasks persistently in a local database file (app.db).​
SQLAlchemy (ORM) is used to map Python classes (User, Task) to database tables.​


We chose Flask + SQLite because it’s:  
    Simple and lightweight for a to-do list application.[4]
    Easy to set up (no separate database server needed).[1]
    Portable (data is in a single .db file you can move with the project).[1]
Q: How to run web app
A:
Optional (but recommended): create a virtual environment so all dependencies are isolated.​
python -m venv venv

Activate the environment:  
    MacOS / Linux:  source venv/bin/activate  
    Windows (CMD):  venv\Scripts\activate  

Install dependencies (recommended):  
    pip install -r requirements.txt  

Or install core packages manually (if needed):  
    pip install flask flask_sqlalchemy werkzeug gunicorn  

Project structure (simplified):  
    project/  
        app3.py  
        app.db                (auto-created when the app runs)  
        templates/  
            index.html  
            login.html  
            signup.html  
            profile.html  
            recover.html  
        static/  
            js/  
            images/  

Run the app locally:  
    python app3.py  

Then open the app in the browser:  
    http://127.0.0.1:5000  
Q: API Endpoints (Tasks)
A:
Get all tasks for the logged-in user
GET /api/tasks


Add new task  
    POST /api/tasks  
    Example JSON body:  
    {  
        "title": "Finish CMSC128 project",  
        "description": "Integrate backend with frontend",  
        "priority": "high",  
        "status": "notStarted",  
        "dueDate": "2025-10-01",  
        "dueTime": "23:59"  
    }  

Edit an existing task  
    PUT /api/tasks/<task_id>  
    Example JSON body (only send fields you want to change):  
    {  
        "title": "Finish CMSC128 project (updated)",  
        "priority": "mid"  
    }  

Update a task's status only  
    PATCH /api/tasks/<task_id>/status  
    Example JSON body:  
    {  
        "status": "completed"  
    }  

Delete a task  
    DELETE /api/tasks/<task_id>  
Q: API Endpoints (Auth and Profile)
A:
Signup
POST /signup
Body JSON:
{
"name": "Full Name",
"username": "user123",
"password": "secret123",
"securityQuestion": "Your pet's name?",
"securityAnswer": "fluffy"
}


Login  
    POST /login  
    Body JSON:  
    {  
        "username": "user123",  
        "password": "secret123"  
    }  
    On success, returns JSON with redirect: "/index" and sets a session cookie.[5]

Logout  
    POST /logout  
    Clears the session and returns redirect: "/login".[5]

Check session  
    GET /api/check-session  
    Response JSON:  
    { "logged_in": true/false, "username": "user123" }  

Profile page (HTML)  
    GET /profile → renders profile.html for logged-in user.  

Update profile  
    POST /profile  
    Body JSON:  
    {  
        "name": "New Name",  
        "username": "new_username",  
        "password": "optional_new_password"  
    }  

Get current profile data (for pre-fill)  
    GET /api/profile  
    Response JSON (on success):  
    { "success": true, "name": "Full Name", "username": "user123" }  
Q: API Endpoints (Password recovery)
A:
Start recovery (verify account)
POST /recover
Body JSON:
{
"action": "verify",
"usernameInput": "user123"
}
On success, returns the stored securityQuestion.

Verify security answer  
    POST /recover  
    Body JSON:  
    {  
        "action": "verifyAnswer",  
        "usernameInput": "user123",  
        "securityAnswer": "fluffy"  
    }  

Reset password  
    POST /recover  
    Body JSON:  
    {  
        "action": "reset",  
        "usernameInput": "user123",  
        "newPassword": "newSecret",  
        "repeatPassword": "newSecret"  
    }