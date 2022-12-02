const { Pool } = require('pg');

const pool = new Pool({
    "host": "heffalump.db.elephantsql.com",
    "user": "ldhpoxxz",
    "password": "F4WqC8bJE7JgLjJurW9JGNvFyD8lJFnE",
    "database": "ldhpoxxz",
    "port": 5432
});

module.exports = pool;