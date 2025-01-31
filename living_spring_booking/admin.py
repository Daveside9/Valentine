from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from app import app, db
from app import Reservation  # Import the Reservation model

# ✅ Create Admin Panel
admin = Admin(app, name="Admin Panel", template_mode="bootstrap3")
admin.add_view(ModelView(Reservation, db.session))

if __name__ == '__main__':
    app.run(debug=True)
