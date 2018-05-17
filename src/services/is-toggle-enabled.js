const { get } = require('lodash');

const calculateBucket = require('./calculate-bucket');

module.exports = (togglestate, togglename, { uuid, culture, forcedToggles }) => {

    if (forcedToggles && togglename in forcedToggles) {
        return forcedToggles[togglename];
    }

    const toggles = get(togglestate, 'toggles', []);
    const toggle = toggles.find(t => t.id === togglename);

    const bucket = calculateBucket(uuid);

    const rolloutPercentage = get(toggle, 'activations.0.rollout.percentage', 0);
    const rolloutCultures = get(toggle, 'activations.0.attributes.culture', []);

    if (rolloutCultures.length > 0 && !rolloutCultures.includes(culture)) {
        return false;
    }

    if (rolloutPercentage >= bucket) { return true; }

    return false;
};