""" Flask App"""
from flask import Flask, render_template, redirect, url_for, request, flash
from flask_login import login_user, login_required, logout_user
from models import User, Mood
from models.engine.db_storage import DB
import bcrypt

app = Flask(__name__)


@app.route('/')
def home():
    ''' Home route'''
    return render_template('home.html')

@app.route('register/', methods=['GET', 'POST'])
def register():
    """ Register route"""
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        new_user = User(email=email, password_hash=password_hash)
        DB.new(new_user)

        try:
            DB.save()
            flash('Registration successful! Please log in.', 'success')
            return redirect(url_for('login'))
        except:
            DB.rollback()
            flash('Email already exists. Please use a different email.', 'error')

    return render_template('register.html')

@app.route('login/', methods=['GET', 'POST'])
def login():
    """Login route"""
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        user = DB.get(User, email)
        if user and bcrypt.checkpw(password.encode('utf-8'), user.password_hash.encode('utf-8')):
            login_user(user)
            flash('Logged in successfully!', 'success')
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid email or password.', 'error')
    return render_template('login.html')

@app.route('logout/')
@login_required
def logout():
    """ Logs the user out"""
    logout_user()
    flash('Logged out successfully!', 'success')
    return redirect(url_for('home'))

if __name__ == '__main__':
    app.run(debug=True)