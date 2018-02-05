const calculateBucket = require('./calculate-bucket');
const toggleHandler = require('./toggle-handler');

const getJson = require('bent')('json');


module.exports = ({ endpoint, refreshInterval = 60000 }) => {
    let toggles = [];

    const reload = async () => {
        toggles = await getJson(endpoint);
    };

    const initialize = async () => {
        setInterval(reload, refreshInterval);
        await reload();
    };

    const ready = initialize();

    return {
        ready: () => ready,
        isToggleEnabled: (toggleName, uuid, forcedToggles) => {
            const bucket = calculateBucket(uuid);
            return toggleHandler.isToggleEnabled(toggleName, toggles, bucket, forcedToggles);
        },
        toggles: () => {
            return toggles;
        },
        togglesForService: (service) => {
            return toggleHandler.togglesForService(service, toggles);
        },
        toggleNamesForService: service => {
            return toggleHandler.togglesForService(service, toggles).map(t => t.id);
        }
    };
};