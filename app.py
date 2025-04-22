from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import mysql.connector
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Enable CORS for all domains and methods
CORS(app, supports_credentials=True)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', request.headers.get('Origin') or '*')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE')
    return response

# Database connection
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="admin",
    database="art_gallery"
)
cursor = db.cursor(dictionary=True)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/user-artworks', methods=['GET'])
def get_user_artworks():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400

    try:
        cursor.execute("SELECT * FROM artwork WHERE user_id = %s", (user_id,))
        user_artworks = cursor.fetchall()
        return jsonify(user_artworks)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/upload-artwork', methods=['POST'])
def upload_artwork():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part in request'}), 400

        file = request.files['file']
        title = request.form.get('title')
        artist = request.form.get('artist')
        user_id = request.form.get('user_id')

        if not file or file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        if not title or not artist or not user_id:
            return jsonify({'error': 'Missing title, artist, or user ID'}), 400

        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        cursor.execute(
            "INSERT INTO artwork (title, artist, image, user_id) VALUES (%s, %s, %s, %s)",
            (title, artist, filepath, user_id)
        )
        db.commit()

        return jsonify({'message': 'Artwork uploaded successfully'}), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/artworks', methods=['GET'])
def get_artworks():
    try:
        cursor.execute("SELECT * FROM artwork")
        all_artworks = cursor.fetchall()
        return jsonify(all_artworks)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True)
