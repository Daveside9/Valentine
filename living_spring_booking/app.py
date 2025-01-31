from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from flask_cors import CORS  # Enable cross-origin resource sharing

app = Flask(__name__)
CORS(app)  # Allow frontend to access backend

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = "supersecretkey"  # Required for Flask-Admin

db = SQLAlchemy(app)

# ✅ Reservation Model
class Reservation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    whatsapp_contact = db.Column(db.String(20), nullable=False)
    kaduna_location = db.Column(db.String(200), nullable=False)
    reservation_type = db.Column(db.String(50), nullable=False)

# ✅ Ensure database tables are created
with app.app_context():
    db.create_all()

# ✅ API Endpoint: Handle reservation submissions
@app.route('/api/reserve', methods=['POST'])
def reserve():
    try:
        data = request.json
        if not all(key in data for key in ['name', 'whatsapp_contact', 'kaduna_location', 'reservationType']):
            return jsonify({"error": "Missing required fields"}), 400  # Ensure all fields exist

        new_reservation = Reservation(
            name=data['name'],
            whatsapp_contact=data['whatsapp_contact'],
            kaduna_location=data['kaduna_location'],
            reservation_type=data['reservationType']
        )
        db.session.add(new_reservation)
        db.session.commit()
        return jsonify({"message": "Reservation successful"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500  # Generic error handling

# ✅ API: Get all reservations (for frontend)
@app.route('/api/reservations', methods=['GET'])
def get_reservations():
    reservations = Reservation.query.order_by(Reservation.id.desc()).all()
    reservations_list = [
        {
            "id": r.id,
            "name": r.name,
            "whatsapp_contact": r.whatsapp_contact,
            "kaduna_location": r.kaduna_location,
            "reservation_type": r.reservation_type
        }
        for r in reservations
    ]
    return jsonify(reservations_list), 200

# ✅ Admin Page: View reservations in HTML
@app.route('/reservations', methods=['GET'])
def view_reservations():
    reservations = Reservation.query.order_by(Reservation.id.desc()).all()
    return render_template('reservations.html', reservations=reservations)

# ✅ API: Delete a reservation
@app.route('/api/delete_reservation/<int:id>', methods=['DELETE'])
def delete_reservation(id):
    reservation = Reservation.query.get(id)
    if reservation:
        db.session.delete(reservation)
        db.session.commit()
        return jsonify({"message": f"Reservation {id} deleted successfully"}), 200
    return jsonify({"error": "Reservation not found"}), 404

# ✅ Home Route (Prevents 404 error on "/")
@app.route('/')
def home():
    return render_template('index.html')

# ✅ Admin Panel
admin = Admin(app, name='Admin Panel', template_mode='bootstrap3')
admin.add_view(ModelView(Reservation, db.session))

if __name__ == '__main__':
    app.run(debug=True)
