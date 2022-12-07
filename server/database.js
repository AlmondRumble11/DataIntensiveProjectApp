const sql = require("mssql");

const configs = [
    {
        countryCode: 'FI',
        config: {
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: "DataIntensiveFinland",
            server: "localhost",
            options: {
                trustServerCertificate: true,
            }
        }
    },
    {
        countryCode: 'SWE',
        config: {
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: "DataIntensiveSweden",
            server: "localhost",
            options: {
                trustServerCertificate: true,
            }
        }
    },
    {
        countryCode: 'NOR',
        config: {
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: "DataIntensiveNorway",
            server: "localhost",
            options: {
                trustServerCertificate: true,
            }
        }
    },
];


function selectConfig(countryCode){
    for (let i = 0; i < configs.length; i++) {
        if( configs[i].countryCode === countryCode) {
            return configs[i].config;
        }
    }
    return null
}

async function sqlQuery(query, countryCode) {
    try {
        const config = selectConfig(countryCode);
        console.log(config);
        if(config === null){
            return null
        }else {
            await sql.connect(config);
            const result = await sql.query(query);
            sql.close();
            if (result) {
                return result.recordset;
            }
            return null;
        }
       
    } catch (err) {
        console.error(err);
        return null;
    }
}


async function sqlInsert(query, countryCode) {

    try {
        const config = selectConfig(countryCode);
        if(config === null){
            return null
        }else{
            const pool = await sql.connect(config);
            const result = await pool.request().query(query)
            if (result) {
                return result;
            }

            return null;
        }
    } catch (err) {
        console.log(err);
        return null;
    }
}

module.exports = {
    sqlQuery,
    sqlInsert
};