const express = require('express');
const expressMiddleware = require('../src/express-middleware');

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

        await expressMiddleware({ })(fakeRequest, null, fakeNext);

        expect(fakeNext).toHaveBeenCalledTimes(1);
        expect(fakeRequest.toguru).toBeDefined();
    });

    it('Gets all toggles', async () => {

        const fakeRequest = {};
        const fakeNext = jest.fn();

        await expressMiddleware({ })(fakeRequest, null, fakeNext);

        expect(fakeNext).toHaveBeenCalledTimes(1);
        expect(fakeRequest.toguru).toBeDefined();
        expect(fakeRequest.toguru.toggles).toBeDefined();
        expect(fakeRequest.toguru.isToggleEnabled).toBeDefined();
        expect(fakeRequest.toguru.toggles()).toEqual(mockedToggles);
    });

    it('Detects whether toggles are on or off', async () => {
        const fakeRequest = {
            headers: {
                cookie: 'uid=b3dfdfa0-1f04-47de-9e73-bc3f0c7b103f;' //  user bucket 92
            }
        };

        const fakeNext = jest.fn();

        await expressMiddleware({ cookieName: 'uid' })(fakeRequest, null, fakeNext);
        expect(fakeRequest.toguru.isToggleEnabled('toggle-on-for-everyone')).toBe(true);
        expect(fakeRequest.toguru.isToggleEnabled('toggle-on-for-none')).toBe(false);

    });

    it('Detects whether toggles are on or off based on user id', async () => {
        const fakeRequest = {
            headers: {
                cookie: 'uid=b3dfdfa0-1f04-47de-9e73-bc3f0c7b103f;' //  user bucket 92
            }
        };

        const fakeNext = jest.fn();

        await expressMiddleware({ cookieName: 'uid' })(fakeRequest, null, fakeNext);
        expect(fakeRequest.toguru.isToggleEnabled('toggle-on-for-half')).toBe(false);
    });

    it('Detects whether toggles are on or off based on user id', async () => {
        const fakeRequest = {
            headers: {
                cookie: 'uid=b3dfdfa0-1f04-47de-9e73-bc3f0c7b143f;' // user bucket 16
            }
        };

        const fakeNext = jest.fn();

        await expressMiddleware({ cookieName: 'uid' })(fakeRequest, null, fakeNext);
        expect(fakeRequest.toguru.isToggleEnabled('toggle-on-for-half')).toBe(true);
    });

    it('should handle toggles forced by query string', async () => {
        const fakeRequest = {
            headers: {
                cookie: 'uid=b3dfdfa0-1f04-47de-9e73-bc3f0c7b143f;' // user bucket 16
            },
            query: {
                toguru: 't1=true&t2=false'
            }
        };

        const fakeNext = jest.fn();

        await expressMiddleware({ cookieName: 'uid' })(fakeRequest, null, fakeNext);
        expect(fakeRequest.toguru.isToggleEnabled('t1')).toBe(true);
        expect(fakeRequest.toguru.isToggleEnabled('t2')).toBe(false);

    });

    it('should handle toggles forced by cookie', async () => {
        const fakeRequest = {
            headers: {
                cookie: 'uid=b3dfdfa0-1f04-47de-9e73-bc3f0c7b143f;toguru=t1%3Dtrue%26t2%3Dfalse' // user bucket 16
            }
        };

        const fakeNext = jest.fn();

        await expressMiddleware({ cookieName: 'uid' })(fakeRequest, null, fakeNext);
        expect(fakeRequest.toguru.isToggleEnabled('t1')).toBe(true);
        expect(fakeRequest.toguru.isToggleEnabled('t2')).toBe(false);

    });

    it('should prioritize toggles forced by query string over by cookie', async () => {
        const fakeRequest = {
            headers: {
                cookie: 'uid=b3dfdfa0-1f04-47de-9e73-bc3f0c7b143f;toguru=t1%3Dtrue' // user bucket 16
            },
            query: {
                toguru: 't1=false'
            }
        };

        const fakeNext = jest.fn();

        await expressMiddleware({ cookieName: 'uid' })(fakeRequest, null, fakeNext);
        expect(fakeRequest.toguru.isToggleEnabled('t1')).toBe(false);

    });
});