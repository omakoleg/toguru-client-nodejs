const { createToggleStoreWithCache } = require('../src/toggle-store');

describe('Toggle Store should fetch and cache toggles', () => {
    it('Fetches toggles from URL', async () => {
        const store = createToggleStoreWithCache('https://toguru.tools.autoscout24.com/togglestate');
        const toggles = await store.getToggles();
        expect(toggles).toBeDefined();
        expect(toggles).not.toEqual([]);
    });
});