function isPrime(n) {
  if (n <= 1) return false;

  for (let j = 2; j <= Math.sqrt(n); j++) {
    if (n % j === 0) return false;
  }

  return true;
}

module.exports = isPrime;
