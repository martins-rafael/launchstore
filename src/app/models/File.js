const Base = require('./Base');

Base.init({ table: 'files' });

module.exports = {
    ...Base
    // async delete(id) {
    //     try {
    //         const results = await db.query(`SELECT * FROM files WHERE id = $1`, [id]);
    //         const file = results.rows[0];

    //         fs.unlinkSync(file.path);
    //         return db.query(`DELETE FROM files WHERE id = $1`, [id]);
    //     } catch (err) {
    //         console.error(err);
    //     }
    // }
};