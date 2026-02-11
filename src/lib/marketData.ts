export async function getMarketData(symbol: string) {
  const res = await fetch(
    `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.NEXT_PUBLIC_ALPHA_VANTAGE_KEY}`
  );

  const data = await res.json();
  return data["Global Quote"];
}
