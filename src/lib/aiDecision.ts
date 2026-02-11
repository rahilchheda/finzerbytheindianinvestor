export function aiDecision(marketData: any) {
  const price = parseFloat(marketData["05. price"]);
  const change = parseFloat(marketData["10. change percent"]);

  if (change > 2) return "Market is bullish. Momentum building.";
  if (change < -2) return "Market falling. Risk increasing.";
  return "Market stable. Wait for clearer direction.";
}
