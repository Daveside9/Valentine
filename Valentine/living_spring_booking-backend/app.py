import eventlet
eventlet.monkey_patch()

from flask import Flask, request, jsonify, Markup
from flask_sqlalchemy import SQLAlchemy
from flask_admin import Admin, AdminIndexView, expose
from flask_admin.base import BaseView
from flask_admin.contrib.sqla import ModelView
from flask_login import LoginManager, login_user, logout_user, login_required, current_user, UserMixin
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO, emit
from flask_bcrypt import Bcrypt
from datetime import datetime, timedelta
from wtforms import Form, StringField, SelectField, validators
from admin import ReservationModelView, UserModelView, SendMessageHTMLView
from models import db, Reservation, User, UserMessage, GlobalMessage
from admin import SendMessageHTMLView
import uuid
import logging
from logging import FileHandler, WARNING
from flask import redirect, flash

# Initialize Flask app
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///reservations.db'
app.config['SECRET_KEY'] = 'valentine-secret'
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = False
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)

file_handler = FileHandler('error.log')
file_handler.setLevel(WARNING)
app.logger.addHandler(file_handler)

# Extensions
bcrypt = Bcrypt(app)
db.init_app(app)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)
socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000")
login_manager = LoginManager(app)
login_manager.login_view = 'login_api'
login_manager.login_view = 'login_form'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# ---------------- Admin ----------------
class MyAdminIndexView(AdminIndexView):
    @expose('/')
    @login_required
    def index(self):
        total = Reservation.query.count()
        return self.render('admin/index.html', total=total)

class ReservationModelView(ModelView):
    def is_accessible(self):
        return current_user.is_authenticated

class MessageModelView(ModelView):
    form_columns = ['content']
    def is_accessible(self):
        return current_user.is_authenticated

# Custom Form and View for Sending Targeted Message
class SendMessageForm(Form):
    username = SelectField('User', choices=[], validators=[validators.InputRequired()])
    message = StringField('Message', validators=[validators.InputRequired()])

class SendMessageView(BaseView):
    @expose('/', methods=['GET', 'POST'])
    def index(self):
        form = SendMessageForm(request.form)
        form.username.choices = [(u.username, u.username) for u in User.query.all()]
        if request.method == 'POST' and form.validate():
            user = User.query.filter_by(username=form.username.data).first()
            if user:
                new_msg = UserMessage(user_id=user.id, content=form.message.data)
                db.session.add(new_msg)
                db.session.commit()

                # Optional: real-time push
                socketio.emit('private_message', {
                    'username': user.username,
                    'message': form.message.data
                }, broadcast=True)

                return self.render('admin/send_message_success.html', user=user.username, message=form.message.data)
        return self.render('admin/send_message.html', form=form)

# Register admin views
admin = Admin(app, name="Admin Panel", template_mode="bootstrap3", index_view=MyAdminIndexView())
admin.add_view(ReservationModelView(Reservation, db.session))
admin.add_view(MessageModelView(GlobalMessage, db.session, name="Admin Message"))
admin.add_view(UserModelView(User, db.session, name="User Accounts"))
admin.add_view(SendMessageHTMLView(name="Send Message", endpoint="send"))

# ---------------- Auth APIs ----------------
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    existing = User.query.filter_by(username=data['username']).first()
    if existing:
        return jsonify({'message': 'User already exists'}), 409
    hashed_pw = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(username=data['username'], password=hashed_pw)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'Signup successful'}), 201

@app.route('/api/login', methods=['POST'])
def login_api():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if user and bcrypt.check_password_hash(user.password, data['password']):
        login_user(user, remember=True)
        return jsonify({'message': 'Login successful', 'username': user.username}), 200
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/api/logout', methods=['POST'])
@cross_origin(origins="http://localhost:3000", supports_credentials=True)
@login_required
def logout_route():
    logout_user()
    return jsonify({'message': 'Logged out successfully'}), 200

# ---------------- Reservation API ----------------
@app.route('/api/reserve', methods=['POST'])
@cross_origin(origins="http://localhost:3000", supports_credentials=True)
def reserve():
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid JSON"}), 400

    try:
        new_res = Reservation(
            name=data.get('name'),
            whatsapp_contact=data.get('whatsapp_contact'),
            kaduna_location=data.get('kaduna_location'),
            reservationType=data.get('reservationType'),
            date=data.get('date') or None,
            reference=str(uuid.uuid4())[:8]  # generate a short unique reference
        )
        db.session.add(new_res)
        db.session.commit()
        return jsonify({"message": "Reservation successful", "reference": new_res.reference}), 201
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Reservation error: {e}")
        return jsonify({"message": "Reservation failed", "error": str(e)}), 500


# ---------------- Global Message ----------------
@app.route('/api/global-message', methods=['GET'])
def get_message():
    latest = GlobalMessage.query.order_by(GlobalMessage.timestamp.desc()).first()
    if latest:
        return jsonify({
            "message": latest.content,
            "timestamp": latest.timestamp.isoformat()
        })
    return jsonify({"message": ""}), 200

@app.route('/api/welcome', methods=['GET'])
def welcome():
    latest = GlobalMessage.query.order_by(GlobalMessage.timestamp.desc()).first()
    if latest:
        return jsonify({
            "message": latest.content,
            "timestamp": latest.timestamp.isoformat()
        })
    return jsonify({"message": ""}), 200

# ---------------- Targeted Message ----------------
@app.route('/api/send-message', methods=['POST'])
def send_message():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if not user:
        return jsonify({"message": "User not found"}), 404
    new_msg = UserMessage(user_id=user.id, content=data['message'])
    db.session.add(new_msg)
    db.session.commit()
    return jsonify({"message": "Message sent successfully"})

@app.route('/api/user-message', methods=['GET'])
@login_required
def get_user_message():
    message = UserMessage.query.filter_by(user_id=current_user.id, is_read=False).order_by(UserMessage.timestamp.desc()).first()
    if message:
        message.is_read = True
        db.session.commit()
        return jsonify({
            "message": message.content,
            "timestamp": message.timestamp.isoformat()
        })
    return jsonify({"message": ""})

# ---------------- Global Message Per User ----------------
@app.route('/api/global-message/<string:username>', methods=['GET'])
def get_global_for_user(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"message": ""}), 404
    latest = GlobalMessage.query.order_by(GlobalMessage.timestamp.desc()).first()
    if not latest:
        return jsonify({"message": ""})
    read_entry = UserMessage.query.filter_by(user_id=user.id, content=latest.content).first()
    if read_entry and read_entry.is_read:
        return jsonify({"message": "", "is_read": True})
    return jsonify({
        "message": latest.content,
        "timestamp": latest.timestamp.isoformat(),
        "is_read": False
    })

@app.route('/api/mark-global-read', methods=['POST'])
def mark_global_as_read():
    data = request.get_json()
    # ... your existing logic ...
    return jsonify({"message": "Marked as read"})

# 🟢 FORM-BASED LOGIN ENDPOINT
@app.route('/login', methods=['GET', 'POST'])
def login_form():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        # Replicate your login_api logic
        user = User.query.filter_by(username=username).first()
        if user and bcrypt.check_password_hash(user.password, password):
            login_user(user, remember=True)
            return redirect('/admin')  # Or wherever you want after login
        flash("Invalid credentials", "error")
        return redirect(request.url)

    # Render login form for GET
    return '''
        <form action="/login" method="POST">
          <input name="username" placeholder="Username" required/>
          <input name="password" type="password" placeholder="Password" required/>
          <button type="submit">Login</button>
        </form>
    '''

# ---------------- Main ----------------
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        if not User.query.filter_by(username='admin').first():
            hashed_pw = bcrypt.generate_password_hash('1234').decode('utf-8')
            db.session.add(User(username='admin', password=hashed_pw))
            db.session.commit()
    socketio.run(app, debug=True)
