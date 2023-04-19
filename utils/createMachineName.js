export function createMachineName(name) {
  const machineName = name
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/([^\w]+|\s+)/g, "-");
  return machineName;
}
