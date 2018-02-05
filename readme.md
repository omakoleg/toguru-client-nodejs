# Toguru Client for Node.js

## Usage with plain Node
```js
const ToguruClient = require('toguru-client');
const client = ToguruClient({
    endpoint: 'https://example.com/togglestate',
    refreshInterval: 60 * 1000 // 1 minute
});

client.ready().then(() => {
    client.isToggleEnabled('t1', 'ad89f957-d646-46e9-b6da-a02c9aa7faba');
    // true or false
    
    client.toggles();
    // [{ id: 't1', rolloutPercentage: 50, }, { id: 't2', rolloutPercentage: 70 }, { id: 't3', tags: { services: 'svc1,svc4' } }]
    
    client.togglesForService('service');
    // [{ id: 't3', tags: { services: 'service,svc4' } }]
    
    client.toggleNamesForService('service');
    // ['t3']
});

```

## Usage with express
```js
const toguruClient = require('toguru-client/express');

app.get('/', toguruClient({ endpoint: 'https://toguru-example.com/', cookieName: 'uid', queryParameterName: 'toguru' }), (req, res) => {
    if (req.toguru.isOn('toggle-name')) {
        res.send('Toggle is ON');
    } else {
        res.send('Toggle is OFF');
    }
});
```

## Usage with plain node
```js
const ToguruClient = require('toguru-client');

const client = new 

```