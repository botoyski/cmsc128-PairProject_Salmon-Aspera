# cmsc128-PairProject_Salmon-Aspera
Full Stack to do list web app

Q: Which backend we chose
A: 
    For this project, we used Flask (a lightweight Python web framework) with SQLite as the database.
    Flask provides the web server and API endpoints.
    SQLite stores the tasks persistently in a local database file (tasks.db).
    SQLAlchemy (ORM) is used to map Python classes (Task) to database tables.

    We chose Flask + SQLite because it’s:
        Simple and lightweight for a to-do list application.
        Easy to set up (no separate database server needed).
        Portable (just one .db file).

Q: How to run web app
A:
    *Optional Steps*
    Make a virtual environment so that all actions will only store to that environment 
    [type "python -m venv venv" to your terminal] 
    NOTE: making a virtual environment in powershell sometimes result in error because of access so its better to run it in cmd

    After the venv file has been created, we can activate the environment
    [MacOS / Linux: "source venv/bin/activate"]
    [Windows: "venv\Scripts\activate"]

    *Real steps*
    First we need to install what is needed you can just read the requirements.txt
    ["pip install -r requirements.txt]
    Or just type it directly
    ["pip install flask flask_sqlalchemy flask_cors"]

    Make sure the folders look like this so that the paths will not mess up
    [   project/
            app.py
            templates/
                index.html
            static/
                js/
                images/     
            tasks.db   (auto-created when app is accessed)   ]

    We can now run app.py
    ["python app.py"]

    Open app by holding your ctrl button and click
    [ctrl+click "http://127.0.0.1:5000"]

Q: API Endpoints
A:
    Get all task
    [GET /api/tasks]

    Add new task
    [POST /api/tasks]
        Example request body:
        {
            "title": "Finish CMSC128 project",
            "description": "Integrate backend with frontend",
            "priority": "high",
            "status": "notStarted",
            "dueDate": "2025-10-01",
            "dueTime": "23:59"
        }

    Edit an existing Task
    [PUT /api/tasks/<task_id>]
        Example request body:
        {
            "title": "Finish CMSC128 project (updated)",
            "priority": "mid"
        }

    Update a task's status only
    [PATCH /api/tasks/<task_id>/status]
        Example request body:
        {
            "status": "completed"
        }

    Delete a task
    [DELETE /api/tasks/<task_id>]