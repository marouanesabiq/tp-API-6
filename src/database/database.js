import * as SQLite from 'expo-sqlite';

let db = null;

// Ouvrir la base
export const openDB = async() => {
    db = await SQLite.openDatabaseAsync('sport_app.db');
};

// Initialiser la table users
export const initDB = async() => {
    if (!db) await openDB();

    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT
    );
  `);
};

// Inscription
export const registerUser = async(name, email, password) => {
    await db.runAsync(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?);', [name, email, password]
    );
};

// Connexion
export const loginUser = async(email, password) => {
    const result = await db.getAllAsync(
        'SELECT * FROM users WHERE email = ? AND password = ?;', [email, password]
    );
    return result.length > 0 ? result[0] : null;
};