const { Pool, types } = require('pg');
const { postgres } = require('../config');

types.setTypeParser(types.builtins.INT8, (value) => parseInt(value));
types.setTypeParser(20, BigInt);
types.setTypeParser(types.builtins.FLOAT8, (value) => parseFloat(value));
types.setTypeParser(types.builtins.NUMERIC, (value) => parseFloat(value));
types.setTypeParser(types.builtins.DATE, (value) => new Date(value).toISOString());

const pool = new Pool(postgres);

module.exports = {
    query: (text, params) => pool.query(text, params)
};
