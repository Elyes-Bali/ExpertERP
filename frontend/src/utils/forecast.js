// utils/forecast.js

export function movingAverage(data, key, period = 3) {
  const values = data.map(d => d[key] || 0);
  const slice = values.slice(-period);

  if (slice.length === 0) return 0;

  const sum = slice.reduce((a, b) => a + b, 0);
  return sum / slice.length;
}

// Simple linear regression (y = ax + b)
export function linearRegression(data, key) {
  const values = data.map(d => d[key] || 0);

  const n = values.length;
  if (n === 0) return 0;

  const x = values.map((_, i) => i + 1);
  const y = values;

  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
  const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);

  const a = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const b = (sumY - a * sumX) / n;

  const nextX = n + 1;
  return a * nextX + b;
}