import { splitDecimals } from "./splitDecimals";

export function priceDisplay(price, currency) {
  if (!price) return;
  if (price !== "0") {
    return `${splitDecimals(price, 2)[0]},${
      splitDecimals(price, 2)[1]
    } ${currency}`;
  }
}
