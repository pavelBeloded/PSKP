export function fibonacci(n) {
  if (n <= 0) return 0;
  if (n === 1 || n === 2) return 1;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

export function fibonacciAsync(n) {
  return new Promise((resolve) => {
    if (n <= 0) return resolve(0);
    if (n === 1 || n === 2) return resolve(1);

    process.nextTick(async () => {
      const a = await fibonacciAsync(n - 1);
      const b = await fibonacciAsync(n - 2);
      resolve(a + b);
    });
  });
}

export function fibonacciImmediate(n) {
  return new Promise((resolve) => {
    if (n <= 0) return resolve(0);
    if (n === 1 || n === 2) return resolve(1);

    setImmediate(async () => {
      const a = await fibonacciAsync(n - 1);
      const b = await fibonacciAsync(n - 2);
      resolve(a + b);
    });
  });
}
