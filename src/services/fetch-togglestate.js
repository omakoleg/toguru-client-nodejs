const bent = require('bent');

const getToggles = require('bent')('json', { Accept: 'application/vnd.toguru.v3+json' });

module.exports = endpoint => getToggles(endpoint);

