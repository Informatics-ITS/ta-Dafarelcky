const express = require('express');
const mysql = require('mysql2/promise'); 
const cors = require('cors'); 

require('dotenv').config();

const app = express();
const port = process.env.PORT || 4200;

app.use(cors());

// MySQL database config
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

// API endpoint to get scraped data
app.get('/pkh-data', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM bpjph');
    res.json({
        status: 'success',
        id_pembina: "66daf0e231b826e2a6629283",
        nama_pembina: "PKH ITS",
        data: rows
    });
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Failed to fetch data from MySQL' });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});
