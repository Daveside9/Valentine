# admin.py
from flask_admin import AdminIndexView, expose
from flask_admin.base import BaseView
from flask_admin.contrib.sqla import ModelView
from flask_login import current_user
from flask import request, redirect, url_for, flash

from models import Reservation, User, UserMessage


# ---------------- Admin Dashboard ----------------
class MyAdminIndexView(AdminIndexView):
    @expose('/')
    def index(self):
        total = Reservation.query.count()
        couples = Reservation.query.filter_by(reservationType="Couples Night Out").count()
        proposals = Reservation.query.filter_by(reservationType="Wedding proposal").count()

        return f"""
            <h2>📊 Admin Dashboard</h2>
            <p>Total Reservations: {total}</p>
            <p>Couples Night Out: {couples}</p>
            <p>Wedding Proposals: {proposals}</p>
            <p><a href="/logout">Logout</a></p>
            <p><a href="/admin/reservation/">Manage Reservations</a></p>
            <p><a href="/admin/user/">Manage Users</a></p>
            <p><a href="/admin/send/">Send Message</a></p>
        """


# ---------------- Model Views ----------------
class ReservationModelView(ModelView):
    column_list = ['id', 'name', 'whatsapp_contact', 'kaduna_location', 'reservationType', 'date', 'reference']
    
    def is_accessible(self):
        return current_user.is_authenticated


class UserModelView(ModelView):
    column_list = ['id', 'username']
    form_excluded_columns = ['password']
    can_create = False
    can_delete = True
    can_edit = False

    def is_accessible(self):
        return current_user.is_authenticated


# ---------------- Send Message (Raw HTML, no template) ----------------
class SendMessageHTMLView(BaseView):  # ✅ Renamed to avoid conflicts
    @expose('/', methods=['GET', 'POST'])
    def index(self):
        if not current_user.is_authenticated:
            return redirect(url_for('login'))

        from app import db, socketio  # 🔁 Break circular import

        users = User.query.all()

        if request.method == 'POST':
            username = request.form.get('username')
            content = request.form.get('message')

            user = User.query.filter_by(username=username).first()
            if not user:
                flash("User not found", "error")
                return redirect(request.url)

            msg = UserMessage(user_id=user.id, content=content)
            db.session.add(msg)
            db.session.commit()

            socketio.emit('new_message', {'message': content}, room=username)
            flash(f"✅ Message sent to {username}", "success")
            return redirect(url_for('.index'))

        user_options = "".join([f"<option value='{u.username}'>{u.username}</option>" for u in users])
        return f"""
            <h3>📩 Send Message to User</h3>
            <form method="POST">
                <label>Choose user:</label><br>
                <select name="username" required>{user_options}</select><br><br>
                <label>Message:</label><br>
                <input type="text" name="message" required style="width:300px;"><br><br>
                <button type="submit">Send</button>
            </form>
            <br><a href="/admin">← Back to Dashboard</a>
        """

    def is_accessible(self):
        return current_user.is_authenticated
