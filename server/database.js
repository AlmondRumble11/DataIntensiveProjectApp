const sql = require("mssql");

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "DataIntensiveFinland",
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


async function sqlInsert(query) {

    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query(query)
        if (result) {
            return result;
        }

        return null;

    } catch (err) {
        console.log(err);
        return null;
    }
}

module.exports = {
    sqlQuery,
    sqlInsert
};