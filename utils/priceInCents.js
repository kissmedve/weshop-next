export const priceInCents = (price, priceDecimals) => {
  if (price === "" && priceDecimals === "") {
    return "";
  }
  if (price === "" && priceDecimals !== "") {
    return Number(priceDecimals);
  }
  return Number(price + priceDecimals);
};
