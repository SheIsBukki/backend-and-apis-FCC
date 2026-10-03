const assert = require("node:assert/strict");
const isPrime = require("./index");

assert.strictEqual(isPrime(4), false);
assert.strictEqual(isPrime(11), true);
assert.strictEqual(isPrime(17), true);
