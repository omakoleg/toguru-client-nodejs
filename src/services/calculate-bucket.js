const bigint = require('big-integer');

const bigi = require('bigi');

const BN = require('bn.js');

module.exports = (uuid) => {
    // This calculation is broken.
    // Normally we would calculate with new BN(x).mod(new BN(100)).toNumber() + 1;
    // BUT: the existing scala client is doing strange calculation.
    // See thread here: https://github.com/Scout24/toguru-scala-client/pull/27
    
    const x = uuid.replace(/-/g, '');

    const hi = new BN(x.substr(0, 16), 16);
    const lo = new BN(x.substr(16, 16), 16);

    const r = lo.shln(64).add(hi).fromTwos(128).mod(new BN(100)).toNumber() + 1;

    if (r < 0) { return 100 + r; }
    return r;
};