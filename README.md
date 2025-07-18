# 💖 Valentine's Day Picnic Booking

A full-stack web application for **reserving romantic picnic or dinner events**, featuring a React frontend and Flask backend. Users can easily make bookings without login, while admins manage reservations and send targeted messages in real time.

---

## ✨ Features

### 👩‍❤️‍👨 User Interface
- 🎟️ Book Reservations (No Login Required)
- 💬 Receive Personalized Admin Messages (Real-Time)
- 🏕️ Tour Section for Package Preview
- 📱 Fully Responsive Design
- 📩 Global and Private Message Notifications

### 🛠️ Admin Panel
- 🔐 Secure Login for Admin
- 📋 Manage Reservations and Users via Flask-Admin
- 💌 Send Targeted Messages to Users
- 📊 Dashboard Statistics

---

## 🧱 Tech Stack

### Frontend (React)
- React.js (with Hooks)
- React Router
- Socket.IO Client
- CSS for Styling

### Backend (Flask)
- Flask + Flask-SQLAlchemy
- Flask-Login (Authentication)
- Flask-Admin (Admin Panel)
- Flask-SocketIO (Real-Time Messaging)
- SQLite (Database)
- Eventlet for WebSocket Support

---

## 🚀 Installation & Setup

### 📁 1. Clone the Project

```bash
git clone https://github.com/your-repo/valentine-booking.git
cd valentine-booking
⚙️ 2. Backend Setup (Flask)
bash
Copy
Edit
cd backend
python -m venv venv
# Activate:
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python app.py
Flask server will run at: http://127.0.0.1:5000

💻 3. Frontend Setup (React)
bash
Copy
Edit
cd frontend
npm install
npm start
React app runs at: http://localhost:3000

📡 API Endpoints
Endpoint	Method	Description
/api/reserve	POST	Create a new reservation
/api/reservations	GET	Retrieve all reservations (admin)
/api/delete_reservation/<id>	DELETE	Delete a reservation (admin)
/api/login / /api/logout	POST	Admin login/logout
/api/send-message	POST	Send a private message (admin)
/api/user-message	GET	Get the latest user-specific message
/api/global-message	GET	Get global broadcast message
/api/mark-global-read	POST	Mark a global message as read

🔐 Admin Panel
Access: http://127.0.0.1:5000/admin

Default Admin:

Username: admin

Password: 1234 (change after first login)

Features:

Dashboard stats

Reservation/user management

Send real-time messages

⚠️ Troubleshooting
Missing Flask Admin?

bash
Copy
Edit
pip install flask-admin
Other Dependencies?

bash
Copy
Edit
pip install -r requirements.txt
WebSocket Errors?

Ensure you're using:

bash
Copy
Edit
pip install eventlet
And Flask is started with:

python
Copy
Edit
socketio.run(app, debug=True)
📁 Folder Structure
cpp
Copy
Edit
valentine-booking/
├── backend/
│   ├── app.py
│   ├── models.py
│   ├── admin.py
│   ├── templates/ (optional if using Flask-Admin templates)
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── WelcomeNotification.js
│   │   │   └── Notification.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   └── Reservation.js
│   │   └── ...
│   └── public/
├── README.md
📬 Contributions
We welcome improvements, ideas, and contributions. Fork the repo, submit a pull request, or open an issue!

📄 License
This project is licensed under the MIT License.

Made with ❤️ for Valentine's Day — Bringing couples together one picnic at a time!

yaml
Copy
Edit

---

✅ This README provides everything:
- ✅ Combined frontend/backend documentation
- ✅ Clear setup instructions
- ✅ API reference table
- ✅ Admin usage
- ✅ Troubleshooting section
- ✅ Structure overview

Let me know if you want me to create this as a `README.md` file for download.
