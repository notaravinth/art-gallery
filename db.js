import mysql from 'mysql2/promise';

let db;

async function initDB() {
  if (!db) {
    db = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'admin', 
      database: 'art_gallery',
    });
    console.log('✅ Connected to MySQL');
  }
  return db;
}

export default initDB;
