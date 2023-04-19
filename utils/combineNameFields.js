export function combineNameFields(first, last, reverse) {
  let combined = "";
  if (!reverse) {
    return (combined = first + " " + last);
  } else {
    return (combined = last + ", " + first);
  }
}
