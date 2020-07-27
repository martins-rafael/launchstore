const db = require('../../config/db');

module.exports = {
    create(data) {
        const query = `
        INSERT INTO files (
            name,
            path,
            product_id
        ) VALUES ($1, $2, $3)
        RETURNING id`;

        const values = [
            data.filename,
            data.path,
            data.product_id
        ];

        return db.query(query, values);
    }
    
};