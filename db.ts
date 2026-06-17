import Database from "better-sqlite3";

const db = new Database("data.db")

db.exec(`CREATE TABLE IF NOT EXISTS urls
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    short_code TEXT UNIQUE,
    long_url TEXT NOT NULL,
    clicks INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);`);

export interface UrlRow {
    id: number;
    short_code: string;
    long_url: string;
    clicks: number;
    created_at: string;
}

export default db;