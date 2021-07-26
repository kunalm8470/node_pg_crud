const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

module.exports = {
    postgres: {
        user: process.env.PGUSER,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        port: parseInt(process.env.PGPORT, 10) || 5432,

        // https://www.postgresql.org/docs/13/errcodes-appendix.html
        errorCodes: {
            uniqueViolation: '23505'
        }
    },
    port: 5000
};