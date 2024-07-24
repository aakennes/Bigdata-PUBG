import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  post: process.env.MYSQL_PORT,
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
});

export default async function handler(req, res) {
  const { minKillCount, maxKillCount } = req.query;

  try {
    const [rows] = await pool.query(
      'SELECT killed_by, kill_count FROM weapon_kill_count WHERE kill_count BETWEEN ? AND ?',
      [minKillCount, maxKillCount]
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
