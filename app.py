""" Flask App"""
from flask import Flask, render_template, redirect, url_for, request, flash
from flask_login import login_user, login_required, logout_user, current_user
from db_storage import DB
from dotenv import load_dotenv
import bcrypt
import os

load_dotenv()

app = Flask(__name__)

# Set a secret key
app.secret_key = os.getenv('SECRET_KEY')

db = DB()

@app.route('/')
def home():
    ''' Home route'''
    return render_template('home.html', current_user=current_user)

@app.route('/register', methods=['GET', 'POST'])
def register():
    """ Register route"""
    from models.User import User
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        username = request.form['username']
        confirm_password = request.form['confirm_password']
        full_name = request.form.get('full_name', '')

        # Validate input
        if password != confirm_password:
            flash('Passwords do not match!', 'error')
            return redirect(url_for('register'))
        
        # Check if username or email already exists
        
        if db.get(User, email):
            flash('Email already registered!', 'error')
            return redirect(url_for('register'))

        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        new_user = User(email=email, password_hash=password_hash)
        db.new(new_user)
        db.save()
        flash('Registration successful! Please log in.', 'success')
        return redirect(url_for('login'))


    return render_template('register.html', current_user=current_user)

@app.route('/login', methods=['GET', 'POST'])
def login():
    """Login route"""
    from models import User
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        user = db.get(User, email)
        if user and bcrypt.checkpw(password.encode('utf-8'), user.password_hash.encode('utf-8')):
            login_user(user)
            flash('Logged in successfully!', 'success')
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid email or password.', 'error')
    return render_template('login.html', current_user=current_user)

@app.route('/logout')
@login_required
def logout():
    """ Logs the user out"""
    logout_user()
    flash('Logged out successfully!', 'success')
    return redirect(url_for('home'))

if __name__ == '__main__':
    app.run(debug=True)