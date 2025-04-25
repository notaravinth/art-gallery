# app.py ─────────────── Flask + MySQL + secure uploads ────────────────
import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.utils import secure_filename
import mysql.connector

app = Flask(__name__)

# ───────────────────────── CORS (dev: Vite @5173) ─────────────────────
CORS(
    app,
    resources={r"/*": {"origins": "http://localhost:5173"}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "DELETE", "OPTIONS"],
)

# ───────────────────────── MySQL connection ───────────────────────────
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="admin",
    database="art_gallery",
)
cursor = db.cursor(dictionary=True)

# ───────────────────────── File uploads ───────────────────────────────
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# ───────────────────────── Helper ─────────────────────────────────────
def _unique_filepath(filename: str) -> str:
    """Return a filepath in UPLOAD_FOLDER that doesn’t overwrite."""
    name, ext = os.path.splitext(secure_filename(filename))
    i, path = 0, ""
    while True:
        suffix = f"_{i}" if i else ""
        path = os.path.join(app.config["UPLOAD_FOLDER"], f"{name}{suffix}{ext}")
        if not os.path.exists(path):
            return path
        i += 1


# ───────────────────────── Routes ─────────────────────────────────────
@app.route("/user-artworks", methods=["GET"])
def get_user_artworks():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400
    try:
        cursor.execute("SELECT * FROM artwork WHERE user_id = %s", (user_id,))
        return jsonify(cursor.fetchall())
    except Exception as e:
        app.logger.exception("DB error")
        return jsonify({"error": str(e)}), 500


@app.route("/upload-artwork", methods=["POST"])
def upload_artwork():
    try:
        file = request.files.get("file")
        title = (request.form.get("title") or "").strip()
        artist = (request.form.get("artist") or "").strip()
        user_id = request.form.get("user_id")

        if not all([file, title, artist, user_id]):
            return jsonify({"error": "Missing file, title, artist, or user_id"}), 400
        if file.filename == "":
            return jsonify({"error": "Empty filename"}), 400

        # ensure user row exists (no-op if already present)
        cursor.execute(
            "INSERT IGNORE INTO users (id, name) VALUES (%s, %s)", (user_id, "")
        )

        # save file with collision‑proof name
        filepath = _unique_filepath(file.filename)
        file.save(filepath)

        # insert artwork row
        cursor.execute(
            """
            INSERT INTO artwork (title, artist, image, user_id)
            VALUES (%s, %s, %s, %s)
            """,
            (title, artist, filepath, user_id),
        )
        db.commit()

        return jsonify({"message": "Artwork uploaded", "image": filepath}), 201

    except Exception as e:
        db.rollback()
        app.logger.exception("Upload failed")
        return jsonify({"error": str(e)}), 500


@app.route("/delete-artwork/<int:art_id>", methods=["DELETE"])
def delete_artwork(art_id):
    try:
        cursor.execute("DELETE FROM artwork WHERE id = %s", (art_id,))
        db.commit()
        return "", 204
    except Exception as e:
        db.rollback()
        app.logger.exception("Delete failed")
        return jsonify({"error": str(e)}), 500


@app.route("/artworks", methods=["GET"])
def get_artworks():
    try:
        cursor.execute("SELECT * FROM artwork")
        return jsonify(cursor.fetchall())
    except Exception as e:
        app.logger.exception("DB error")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
