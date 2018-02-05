const toggleHandler = require('../src/toggle-handler');

describe('Toggle Handling', () => {
    it('Should tell whether toggle is enabled for user', () => {

        const allToggles = [{
                id: 't0',
                rolloutPercentage: 0
            },
            {
                id: 't50',
                rolloutPercentage: 50
            },
            {
                id: 't100',
                rolloutPercentage: 100
            },
            {
                id: 'tnull'
            }
        ];

        expect(toggleHandler.isToggleEnabled('t0', allToggles, 1)).toBe(false);
        expect(toggleHandler.isToggleEnabled('t0', allToggles, 10)).toBe(false);
        expect(toggleHandler.isToggleEnabled('t0', allToggles, 100)).toBe(false);

        expect(toggleHandler.isToggleEnabled('t50', allToggles, 10)).toBe(true);
        expect(toggleHandler.isToggleEnabled('t50', allToggles, 50)).toBe(true);
        expect(toggleHandler.isToggleEnabled('t50', allToggles, 51)).toBe(false);
        expect(toggleHandler.isToggleEnabled('t50', allToggles, 90)).toBe(false);

        expect(toggleHandler.isToggleEnabled('t100', allToggles, 1)).toBe(true);
        expect(toggleHandler.isToggleEnabled('t100', allToggles, 10)).toBe(true);
        expect(toggleHandler.isToggleEnabled('t100', allToggles, 100)).toBe(true);

        expect(toggleHandler.isToggleEnabled('tnull', allToggles, 10)).toBe(false);
        expect(toggleHandler.isToggleEnabled('tnull', allToggles, 100)).toBe(false);

    });

    it('Should retrieve toggles for a specific service', () => {
        const t1 = {
            id: 't1',
            tags: {
                team: 'team1,team2,team3',
                services: 's1,s2,s3'
            },
            rolloutPercentage: 100
        };

        const t2 = {
            id: 't2',
            tags: {
                team: 'team2,team3',
                services: 's2,s3'
            },
            rolloutPercentage: 100
        };
        const t3 =  {
            id: 't3',
            tags: {
                team: ',team3',
                services: 's3'
            },
            rolloutPercentage: 100
        };
        const t4 = {
            id: 't4',
            tags: {
                team: 'team1,team3',
                services: 's1,s3'
            },
            rolloutPercentage: 100
        };

        const t5 = {
            id: 't5'
        };

        const t6 = {
            id: 't6',
            tags: {}
        };

        const toggles = [t1, t2, t3, t4, t5, t6];

        expect(toggleHandler.togglesForService('s1', toggles)).toEqual([t1, t4]);
        expect(toggleHandler.togglesForService('s2', toggles)).toEqual([t1, t2]);
        expect(toggleHandler.togglesForService('s3', toggles)).toEqual([t1, t2, t3, t4]);
    });
});