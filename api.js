export const getStockInfo = async (stockCode) => {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockCode}&apikey=demo`,
    );
    const json = await response.json();
    return json['Global Quote']['10. change percent'];
  } catch (error) {
    console.error(error);
  }
};
