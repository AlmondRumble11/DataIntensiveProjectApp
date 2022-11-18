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

    if (result) {
      return result.recordset;
    }

    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

module.exports = sqlQuery;