const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config(); // For loading environment variables from .env file

const app = express();
const port = 9060;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL Pool Configuration
const pool = new Pool({
  user: 'postgres',
  host: '3.104.171.105',
  database: 'postgres',
  password: 'nandu@1234',
  port: 5432,
});
// Endpoint to save player name
app.post("/savePlayerName", async (req, res) => {
  const { playerName } = req.body;

  if (!playerName || playerName.length < 3 || playerName.length > 50) {
    return res.status(400).send("Invalid player name.");
  }

  try {
    const client = await pool.connect();
    const query = 'INSERT INTO public.scores (player_name) VALUES ($1) RETURNING *';
    const values = [playerName];
    const result = await client.query(query, values);
    client.release();
    res.status(200).json({ message: "Player name saved successfully!", player: result.rows[0] });
  } catch (err) {
    console.error("Error saving player name:", err);
    res.status(500).send("Failed to save player name.");
  }
});

// Endpoint to save score
// Endpoint to save score
app.post("/quitGame", async (req, res) => {
  const { playerName, score, totalScore, answers } = req.body;

  console.log("Received data:", req.body);

  if (!playerName || playerName.length < 3 || playerName.length > 50) {
    return res.status(400).send("Invalid player name.");
  }

  if (typeof score !== "number" || score < 0) {
    return res.status(400).send("Invalid score.");
  }

  if (typeof totalScore !== "number" || totalScore < 0) {
    return res.status(400).send("Invalid total score.");
  }

  if (!Array.isArray(answers)) {
    return res.status(400).send("Invalid answers.");
  }

  try {
    const client = await pool.connect();
    const query =
      "INSERT INTO public.scores (player_name, score, total_score, answers) VALUES ($1, $2, $3, $4) RETURNING *";
    const values = [playerName, score, totalScore, JSON.stringify(answers)];

    console.log("Query:", query);
    console.log("Values:", values);

    const result = await client.query(query, values);
    client.release();

    res
      .status(200)
      .json({ message: "Score and answers saved successfully!", score: result.rows[0] });
  } catch (err) {
    console.error("Error saving score and answers:", err.stack);
    res.status(500).send("Failed to save score and answers.");
  }
});



// Graceful shutdown handling
process.on('SIGINT', () => {
  pool.end(() => {
    console.log('PostgreSQL pool has ended');
    process.exit();
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


