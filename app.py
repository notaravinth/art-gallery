from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import mysql.connector
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# Upload folder setup
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# MySQL connection
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="admin",
    database="art_gallery"
)
cursor = db.cursor()

# Upload endpoint
@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        file = request.files.get('file')
        title = request.form.get('title')
        artist = request.form.get('artist')

        if file and title and artist:
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)

            cursor.execute("INSERT INTO artworks (title, artist, filename) VALUES (%s, %s, %s)",
                           (title, artist, filename))
            db.commit()

            return jsonify({"message": "Upload successful", "filename": filename}), 200
        else:
            return jsonify({"error": "Missing file, title, or artist"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Artworks fetch endpoint
@app.route('/artworks', methods=['GET'])
def get_artworks():
    cursor.execute("SELECT title, artist, filename FROM artworks")
    artworks = cursor.fetchall()
    return jsonify([
        {
            "title": title,
            "artist": artist,
            "image": f"http://localhost:5000/uploads/{filename}"
        }
        for title, artist, filename in artworks
    ])

# Image serving endpoint
@app.route('/uploads/<filename>')
def serve_image(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True)
