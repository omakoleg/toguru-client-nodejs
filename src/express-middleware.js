const cookie = require('cookie');
const Client = require('./client');
const qs = require('qs');

const { mapValues } = require('lodash');

module.exports = ({ endpoint, refreshInterval = 60000, cookieName }) => { 
    const client = Client({
        endpoint,
        refreshInterval
    });

    return async (req, res, next) => {

        await client.ready();

        const cookies = req.headers ? cookie.parse(req.headers.cookie) : {};
        const uuid = cookies[cookieName];

        const forcedTogglesRaw = Object.assign({}, qs.parse(cookies.toguru), qs.parse((req.query && req.query.toguru) || ''))

        const forcedToggles = mapValues(forcedTogglesRaw, v => v === 'true');
    
        req.toguru = {
            isToggleEnabled: (toggleName) => client.isToggleEnabled(toggleName, uuid, forcedToggles),
            toggles: client.toggles,
            togglesForService: service => client.togglesForService(service),
            toggleNamesForService: service => client.toggleNamesForService(service)
        };
    
        next();
    };
};