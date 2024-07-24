import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  post: process.env.MYSQL_PORT,
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
})


 
export default async function GET(req, res) {
  try {
    const { map, rankrate, partysize } = req.query;

    const rankrateMap = {
      '100%': 100,
      '75%': 75,
      '50%': 50,
      '25%': 25,
      '10%': 10,
    };

    const moduleMap = {
      'All': 0,
      'Solo': 1,
      'Duo': 2,
      'Squad': 4,
    };

    console.log("map:" + map);
    console.log("rankrate:" + rankrate);
    console.log("module:" + partysize);

    const rankrateValue = rankrateMap[rankrate] !== undefined ? rankrateMap[rankrate] : 100;
    
    const moduleValue = moduleMap[partysize] !== undefined ? moduleMap[partysize] : 0;

    // 构建基础 SQL 查询
    let query = `SELECT mapx_int, mapy_int, COUNT(*) AS count FROM ${map}_${rankrateValue}_${moduleValue} GROUP BY mapx_int, mapy_int`;

    console.log(query);

    // 执行查询
    const [rows] = await pool.query(query);

    // 返回结果
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
