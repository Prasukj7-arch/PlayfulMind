import os
import mysql.connector
from flask import Flask, request, render_template, redirect, flash, session

app = Flask(__name__)
app.secret_key = 'Omega_Beyond_Infinity'

# Database connection function
def get_db_connection():
    conn = mysql.connector.connect(
        host='localhost',
        user='your_username',
        password='your_password',
        database='your_database'
    )
    return conn

# Login route
@app.route("/", methods=["GET", "POST"])
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE username = %s AND password = %s", (username, password))
        user = cursor.fetchone()
        conn.close()

        if user:
            session['username'] = username
            return redirect('/fields')
        else:
            flash("Invalid credentials, please try again.", "error")
            return redirect('/login')

    return render_template('login.html')

# Registration route
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        confirm_password = request.form['confirm_password']

        if password == confirm_password:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("INSERT INTO users (username, password) VALUES (%s, %s)", (username, password))
            conn.commit()
            conn.close()
            return redirect('/login')
        else:
            flash('Passwords do not match, please try again.', 'error')
            return redirect('/register')

    return render_template('signup.html')

# Fields selection route
@app.route('/fields', methods=['GET'])
def fields():
    if 'username' in session:
        return render_template('fields.html')
    else:
        return redirect('/login')

# MySQL dashboard route
@app.route('/mysql', methods=['GET'])
def mysql_dashboard():
    if 'username' in session:
        return render_template('index.html')
    else:
        return redirect('/login')

# C programming dashboard route
@app.route('/c', methods=['GET'])
def c_dashboard():
    if 'username' in session:
        return render_template('indexC.html')
    else:
        return redirect('/login')

# Profile page route
@app.route('/profile', methods=['GET'])
def profile():
    if 'username' in session:
        return render_template('profile.html')
    else:
        return redirect('/login')

# Interactive game route
@app.route('/game', methods=['GET'])
def game():
    if 'username' in session:
        return render_template('GameS1.html')
    else:
        return redirect('/login')

if __name__ == "__main__":
    app.run(debug=True)
