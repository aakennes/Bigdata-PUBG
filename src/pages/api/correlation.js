import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
});

export default async function handler(req, res) {
  // 解析并验证 filterValue 参数
  const filterValue = parseInt(req.query.filter, 10);

  if (isNaN(filterValue) || filterValue <= 0) {
    return res.status(400).json({ error: "Invalid filter value. It must be a positive integer." });
  }

  // 构建查询语句，使用 filterValue 作为 LIMIT 的参数
  const query = `
    SELECT party_size, player_dist_total, player_dmg, player_kills, player_survive_time, calculated_value
    FROM new_agg
    LIMIT ?
  `;

  try {
    const [rows] = await pool.query(query, [filterValue]);

    // 输出日志以调试
    // console.log(rows);

    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
