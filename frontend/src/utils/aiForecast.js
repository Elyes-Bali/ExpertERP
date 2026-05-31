import { movingAverage, linearRegression } from "./forecast";

export function buildForecast(monthlyData) {
  if (!monthlyData || monthlyData.length < 2) {
    return null;
  }

  const revenueMA = movingAverage(monthlyData, "revenue", 3);
  const purchasesMA = movingAverage(monthlyData, "purchases", 3);

  const revenueLR = linearRegression(monthlyData, "revenue");
  const purchasesLR = linearRegression(monthlyData, "purchases");

  const nextRevenue = (revenueMA + revenueLR) / 2;
  const nextPurchases = (purchasesMA + purchasesLR) / 2;

  const nextProfit = nextRevenue - nextPurchases;

  return {
    nextRevenue: Math.max(0, nextRevenue),
    nextPurchases: Math.max(0, nextPurchases),
    nextProfit,
    method: "MA + Linear Regression Hybrid"
  };
}