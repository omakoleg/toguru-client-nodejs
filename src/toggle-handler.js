const mem = require('mem');

const isToggleEnabled = (toggleName, allToggles, userBucket) => {
    if (userBucket <= 0 || userBucket > 100) {
        console.warn('User bucket must be between 1 and 100.');
        return false;
    }

    const toggle = allToggles.find(t => t.id === toggleName);

    if (!toggle) {
        return false;
    }

    if (!toggle.rolloutPercentage) {
        return false;
    }

    return toggle.rolloutPercentage >= userBucket;
};

const togglesForService = (service, allToggles) => {
    const getServices = toggle => (toggle && toggle.tags && toggle.tags.services) || [];
    return allToggles.filter(t => getServices(t).includes(service));
};

module.exports.isToggleEnabled = isToggleEnabled;
module.exports.togglesForService = togglesForService;

// // We memoize this function because usual pattern is to get toggles for the same few services
// module.exports.togglesForService = mem(togglesForService, {
//     // don't put toggles into cache key because it is a HUGE array. Use maxAge instead.
//     cacheKey: (service, ...args) => service,
//     maxAge: 60000 // 1 minute
// });