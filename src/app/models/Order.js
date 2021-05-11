const Base = require('./Base');
Base.init({ table: 'orders' });

module.exports = {
  ...Base
};
