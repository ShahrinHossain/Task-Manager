# DoneZone

**DoneZone** is a full-stack **Task Management System** built with **React (Frontend)** and **FastAPI (Backend)**.  
It helps users manage, track, and update their tasks efficiently — with support for editing, prioritizing, and monitoring daily productivity scores.

---

## 🧩 Features

- ✏️ Create, edit, and delete tasks  
- 🚦 Manage task status (`due`, `ongoing`, `completed`)  
- ⚡ Prioritize tasks (`high`, `medium`, `low`)  
- 📊 View daily and weekly score summaries  
- 💾 Secure authentication with JWT  
- 💻 Responsive and modern UI  

---

## 🛠️ Tech Stack

**Frontend:**  
- React.js (jsx)
- Axios  
- React Icons  
- CSS

**Backend:**  
- FastAPI  
- SQLAlchemy  
- PostgreSQL
- JWT Authentication  

---

## 🚀 Project Setup

### 🔹 1. Clone the Repository
```bash
git clone https://github.com/ShahrinHossain/Task-Manager.git
cd Task-Manager
```

### 🔹 2. Backend Setup (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Run the backend:
```bash
uvicorn main:app --reload
```

Backend URL:
👉 http://127.0.0.1:8000

### 🔹 3. Frontend Setup (React)
```bash
cd frontend/task-manager-frontend
npm install
npm start
```

Frontend URL:
👉 http://localhost:5173


### 🔹 4.🧠 API Overview
| Endpoint                   | Method | Description                              |
| -------------------------- | ------ | ---------------------------------------- |
| `/register`                | POST   | Register a new user                      |
| `/login`                   | POST   | Authenticate and return JWT              |
| `/create_task`             | POST   | Create a new task                        |
| `/update_task/{id}`        | PUT    | Update task details                      |
| `/update_task_status/{id}` | PATCH  | Update only task status                  |
| `/delete_task/{id}`        | DELETE | Delete a task                            |
| `/score`                   | GET    | Get today’s, weekly, and previous scores |

### 🔹 4. Example /score Response
```bash
{
  "today_score": 40,
  "this_week_scores": [
    {"date": "2025-10-13", "score": 40}
  ],
  "previous_weeks": [
    {"week_start": "2025-10-06", "week_end": "2025-10-12", "score": 0}
  ]
}
```
### 🔹 5. 🎨 UI Highlights
- Deep sea green–themed dashboard
- Interactive dropdowns for status and priority
- Responsive layout for desktop and mobile
- Smooth transitions between editing and deleting modes

### 🔹 6. 📂 Folder Structure
```bash
Task-Manager/
├── backend/
│ ├── main.py
│ ├── routers/
│ ├── models/
│ └── database.py
├── frontend/
│ └── task-manager-frontend/
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ └── assets/
│ └── package.json
├── .gitignore
└── README.md
```

### 🔹 7. 🧑‍💻 Author
📍 Bangladesh
💡 Computer Science and Engineering Student
✨ Passionate about full-stack development & clean UI design

### 🔹 8. 🏁 License
This project is licensed under the MIT License — feel free to use, modify, and distribute.


### 🔹 9. 🌟 Show Your Support
If you like DoneZone, please ⭐ the repository and share your feedback!

Happy coding !

