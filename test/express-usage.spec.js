const express = require('express');
// const request = require('supertest-as-promised');

const toguruMiddleware = require('../express');

// const app = express();

// app.get(toguruMiddleware());

// jest.mock('bent').mockImplementation(() => {
//     return () => {};
// });

const mockedToggles = [
    { id: 'toggle-on-for-everyone', rolloutPercentage: 100, tags: { team: 'Team 1', service: 'Service' } },
    { id: 'toggle-on-for-half', rolloutPercentage: 50, tags: { team: 'Team 1', service: 'Service' } },
    { id: 'toggle-on-for-none', rolloutPercentage: 0, tags: { team: 'Team 1', service: 'Service' } },
];

jest.mock('bent', () => () => {
    return jest.fn().mockImplementation(() => Promise.resolve(mockedToggles));
});

describe('Middleware', () => {
    it('Defines toguru object on request', async () => {

        const fakeRequest = {};
        const fakeNext = jest.fn();

        await toguruMiddleware({ })(fakeRequest, null, fakeNext);

        expect(fakeNext).toHaveBeenCalledTimes(1);
        expect(fakeRequest.toguru).toBeDefined();
    });

    it('Gets all toggles', async () => {

        const fakeRequest = {};
        const fakeNext = jest.fn();

        await toguruMiddleware({ })(fakeRequest, null, fakeNext);

        expect(fakeNext).toHaveBeenCalledTimes(1);
        expect(fakeRequest.toguru).toBeDefined();
        expect(fakeRequest.toguru.toggles).toBeDefined();
        expect(fakeRequest.toguru.isToggleOn).toBeDefined();
        expect(fakeRequest.toguru.toggles).toEqual(mockedToggles);
    });

    it('Detects whether toggles are on or off', async () => {
        const fakeRequest = {};
        const fakeNext = jest.fn();

        await toguruMiddleware({ })(fakeRequest, null, fakeNext);
        expect(fakeRequest.toguru.isToggleOn('toggle-on-for-everyone')).toBe(true);
        // expect(fakeRequest.toguru.isToggleOn('toggle-on-for-half')).toBe(true);
        expect(fakeRequest.toguru.isToggleOn('toggle-on-for-none')).toBe(false);

    });

    it('Detects whether toggles are on or off based on user id', async () => {
        const fakeRequest = {
            headers: {
                cookie: 'uid=b3dfdfa0-1f04-47de-9e73-bc3f0c7b103f;' //  user bucket 92
            }
        };

        const fakeNext = jest.fn();

        await toguruMiddleware({ cookieName: 'uid' })(fakeRequest, null, fakeNext);
        expect(fakeRequest.toguru.isToggleOn('toggle-on-for-half')).toBe(false);
    });

    it('Detects whether toggles are on or off based on user id', async () => {
        const fakeRequest = {
            headers: {
                cookie: 'uid=b3dfdfa0-1f04-47de-9e73-bc3f0c7b143f;' // user bucket 16
            }
        };

        const fakeNext = jest.fn();

        await toguruMiddleware({ cookieName: 'uid' })(fakeRequest, null, fakeNext);
        expect(fakeRequest.toguru.isToggleOn('toggle-on-for-half')).toBe(true);
    });
});