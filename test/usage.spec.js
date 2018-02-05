const Client = require('../index');

const mockedToggles = [
    { id: 'toggle-on-for-everyone', rolloutPercentage: 100, tags: { team: 'Team 1', services: 'Service1' } },
    { id: 'toggle-on-for-half', rolloutPercentage: 50, tags: { team: 'Team 1', services: 'Service2' } },
    { id: 'toggle-on-for-none', rolloutPercentage: 0, tags: { team: 'Team 1', services: 'Service3' } },
    { id: 'toggle-for-service1', tags: { services: 'Service1' } }
];

jest.mock('bent', () => () => {
    return jest.fn().mockImplementation(() => Promise.resolve(mockedToggles));
});


describe('Toguru Client Usage', () => {
    it('Basic usage', async () => {

        const client = Client({
            endpoint: 'https://toguru.tools.autoscout24.com/togglestate',
            refreshInterval: 60 * 1000
        });

        await client.ready();

        expect(client.isToggleEnabled('toggle-on-for-everyone', 'bcffcca3-8fcd-4f50-bc4b-494f9c373185')).toBe(true);
        expect(client.isToggleEnabled('toggle-on-for-none', 'bcffcca3-8fcd-4f50-bc4b-494f9c373185')).toBe(false);
        expect(client.isToggleEnabled('toggle-on-for-none', 'bcffcca3-8fcd-4f50-bc4b-494f9c373185', { 'toggle-on-for-none': true })).toBe(true);
        expect(client.toggleNamesForService('Service1')).toEqual(['toggle-on-for-everyone', 'toggle-for-service1']);
        expect(client.toggleNamesForService('Service23234')).toEqual([]);
    });
});