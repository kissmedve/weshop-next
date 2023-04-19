export function splitDecimals(value, decimals) {
  if (!value) {
    return;
  }
  value = String(value);
  if (value.length < decimals + 1) {
    var newValue = value.padStart(decimals + 1, "0");
  } else {
    newValue = value;
  }
  let beforeComma = newValue.substr(0, newValue.length - decimals);
  let afterComma = newValue.substr(newValue.length - decimals, decimals);
  return [beforeComma, afterComma];
}
