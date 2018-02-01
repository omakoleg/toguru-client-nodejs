const cookie = require('cookie');
const getJson = require('bent')('json');

const calculateBucket = require('./src/calculate-bucket');

const getAllToggles = () => {
    let lastToggles;
    let lastRead;
};

module.exports = (config) => async (req, res, next) => {
    const toggles = await getJson('https://toguru.tools.autoscout24.com/togglestate');
    const cookies = req.headers ? cookie.parse(req.headers.cookie) : {};
    
    req.toguru = {
        toggles,
        isToggleOn: toggleName => {
            const tog = toggles.find(t => t.id === toggleName);

            if (!tog && !tog.rolloutPercentage) {
                return false;
            }

            const uuid = cookies[config.cookieName];

            if (!config.cookieName || !req.cookies || req.cookies[config.cookieName] === undefined) {
                return false;
            }


            const userBucket = calculateBucket(req.cookies[config.cookieName]);

            return tog.rolloutPercentage >= userBucket;
        },
        togglesForService: service => {}
    };

    next();
};