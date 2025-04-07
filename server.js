import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import initDB from './db.js'; // <--- updated import

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = './uploads';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Upload route
app.post('/upload', upload.single('image'), async (req, res) => {
  const { title, artist } = req.body;
  const imagePath = req.file.filename;

  try {
    const db = await initDB(); // ⬅️ Initialize DB connection
    await db.execute(
      'INSERT INTO artworks (title, artist, imagePath) VALUES (?, ?, ?)',
      [title, artist, imagePath]
    );
    res.status(200).json({ message: 'Artwork uploaded successfully' });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Database error during upload' });
  }
});

// Get artworks
app.get('/artworks', async (req, res) => {
  try {
    const db = await initDB(); // ⬅️ Again, use the initDB function
    const [rows] = await db.execute('SELECT * FROM artworks ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Database error fetching artworks' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
