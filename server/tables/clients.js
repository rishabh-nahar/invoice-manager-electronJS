const sqlite3 = require('sqlite3').verbose();

// Connect to the SQLite database
const db = new sqlite3.Database('../apsaraplycentre', (error) => {
  if (error) {
    console.error('Failed to connect to the database:', error.message);
  } else {
    console.log('Connected to the database');
  }
});

// Create a clients table
db.run(`
  CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    clientName TEXT NOT NULL,
    companyName TEXT NOT NULL,
    address TEXT NOT NULL,
    contact TEXT NOT NULL,
    email TEXT NOT NULL,
    gstNo TEXT NOT NULL
  )
`, (error) => {
  if (error) {
    console.error('Failed to create the clients table:', error.message);
  } else {
    console.log('Clients table created');
  }
});

// Query to fetch table names
const showTablesQuery = "SELECT name FROM sqlite_master WHERE type='table'";

db.all(showTablesQuery, function (error, tables) {
  if (error) {
    console.error('Failed to fetch table names:', error);
  } else {
    tables.forEach(function (table) {
      const tableName = table.name;
      console.log(`Table: ${tableName}`);

      // Query to fetch all rows from the table
      const fetchRowsQuery = `SELECT * FROM ${tableName}`;
      db.all(fetchRowsQuery, function (error, rows) {
        if (error) {
          console.error(`Failed to fetch rows from ${tableName}:`, error);
        } else {
          rows.forEach(function (row) {
            console.log(row);
          });
        }
      });
    });
  }
});

// Close the database connection
db.close((error) => {
    if (error) {
      console.error('Failed to close the database connection:', error.message);
    } else {
      console.log('Database connection closed');
    }
  });
  