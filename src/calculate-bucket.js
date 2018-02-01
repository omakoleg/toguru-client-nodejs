const bigint = require('big-integer');

module.exports = (uuid) => {
    const { remainder } = bigint(uuid.replace(/-/g, ''), 16).divmod(100);
    return remainder.value + 1;
};