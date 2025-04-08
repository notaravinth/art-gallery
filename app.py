from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import mysql.connector
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Database connection
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="admin",
    database="art_gallery"
)
cursor = db.cursor(dictionary=True)

@app.route('/upload', methods=['POST'])
def upload_artwork():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part in request'}), 400

        file = request.files['file']
        title = request.form['title']
        artist = request.form['artist']

        if not file or file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        # Save to the correct table: artwork (not artworks)
        cursor.execute(
            "INSERT INTO artwork (title, artist, image) VALUES (%s, %s, %s)",
            (title, artist, filepath)
        )
        db.commit()

        return jsonify({'message': 'Artwork uploaded successfully'})

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/artworks', methods=['GET'])
def get_artworks():
    cursor.execute("SELECT * FROM artwork")  # Correct table name
    all_artworks = cursor.fetchall()

    # Only return artworks with existing image files
    existing_artworks = [
        artwork for artwork in all_artworks
        if artwork['image'] and os.path.isfile(artwork['image'])
    ]

    # Convert paths to URLs for frontend access
    for artwork in existing_artworks:
        filename = os.path.basename(artwork['image'])
        artwork['image'] = f"http://localhost:5000/uploads/{filename}"

    return jsonify(existing_artworks)

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True)
