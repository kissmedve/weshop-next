export const highestCustomId = (arrayOfLineItems, type) => {
  let customLineItems = [];
  arrayOfLineItems.forEach((lineItem) => {
    if (lineItem.productId.includes(type)) {
      customLineItems.push(lineItem.productId);
    }
  });
  if (customLineItems.length === 0) return 0;

  let customIds = customLineItems.map((custom) => {
    let customArr = custom.split("-");
    return Number(customArr[1]);
  });
  let maxCustom = Math.max(...customIds);
  return maxCustom;
};
