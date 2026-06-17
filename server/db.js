// Couche d'accès SQLite via sql.js (WebAssembly). Persiste dans data.db.
import initSqlJs from "sql.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "data.db");

const SQL = await initSqlJs({
  locateFile: (f) => path.join(__dirname, "node_modules", "sql.js", "dist", f),
});

const db = fs.existsSync(DB_PATH)
  ? new SQL.Database(fs.readFileSync(DB_PATH))
  : new SQL.Database();

db.run("PRAGMA foreign_keys = ON");

function persist() {
  fs.writeFileSync(DB_PATH, Buffer.from(db.export()));
}

export function exec(sql) { db.run(sql); persist(); }

export function all(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

export function get(sql, params = []) { return all(sql, params)[0]; }

export function run(sql, params = []) { db.run(sql, params); persist(); }

// INSERT : renvoie l'id généré
export function insert(sql, params = []) {
  db.run(sql, params);
  const id = all("SELECT last_insert_rowid() AS id")[0].id;
  persist();
  return id;
}
