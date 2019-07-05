const BN = require('bn.js');

module.exports = (uuid) => {
    // This calculation is broken.
    // Normally we would calculate with new BN(x).mod(new BN(100)).toNumber() + 1;
    // BUT: the existing scala client is doing strange calculation.
    // See thread here: https://github.com/Scout24/toguru-scala-client/pull/27
    const strippedUUID = uuid.replace(/-/g, '');
    if(strippedUUID.length !== 32) { return 1; }

    const hi = new BN(strippedUUID.substr(0, 16), 16);
    const lo = new BN(strippedUUID.substr(16, 16), 16);

    const bucketCount = lo.shln(64).add(hi).fromTwos(128).mod(new BN(100)).toNumber() + 1;

    if (bucketCount < 0) { return 100 + bucketCount; }
    return bucketCount;
};