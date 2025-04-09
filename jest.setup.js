const crypto = require('crypto');

async function setup() {
    Object.defineProperty(globalThis, 'crypto', {
        value: {
            randomUUID: () => crypto.randomUUID(),
        },
    });
}
module.exports = setup;
