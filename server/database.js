const sql = require("mssql");

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "DataIntensiveGlobal",
  server: "localhost",
  options: {
    trustServerCertificate: true,
  },
};

async function sqlQuery(query) {
  try {
    await sql.connect(config);
    const result = await sql.query(query);
    sql.close();

    return result;
  } catch (err) {
    console.error(err);
  }
}

module.exports = sqlQuery;