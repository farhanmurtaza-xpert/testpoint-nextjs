import mysql from "mysql2";

// Creating a MySQL connection pool
const pool = mysql.createPool({
  host: "localhost",    // Make sure MySQL is running on localhost
  user: "root",         // Your MySQL username
  password: "",         // Your MySQL password (empty if none)
  database: "mcqs",     // The database you're using
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const db = pool.promise();  // Using promise-based queries

export default db;
