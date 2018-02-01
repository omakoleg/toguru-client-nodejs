# Toguru Client for Node.js

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