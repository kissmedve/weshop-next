export function statusName(status, cartId) {
  let statusName = "";
  switch (status) {
    case 1:
      statusName = "in delivery";
      break;
    case 2:
      statusName = "closed";
      break;
    default:
      statusName = "open";
      break;
  }
  if (!cartId) {
    statusName = "new";
  }
  return statusName;
}
