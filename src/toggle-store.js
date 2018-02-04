const getJson = require('bent')('json');

module.exports.createToggleStoreWithCache = (url, seconds) => {

    let lastFetch = 0;
    let toggles = [];

    const fetchToggles = async () => {
        toggles = await getJson(url);
        lastFetch = Date.now();
    };

    return {
        getToggles: async () => {
            if (lastFetch > 0 && lastFetch < Date.now() - 1000 * seconds) {
                fetchToggles();
            } else {
                await fetchToggles();
            }

            return toggles;
        }
    };
};