const getLocalStorage = (storageKey) => {
  if (localStorage.hasOwnProperty(storageKey)) {
    // get the key's value from localStorage
    let storageValue = localStorage.getItem(storageKey);
    // parse the localStorage string and return the array
    // note: in chrome application tab localStorage.value is undefined, but in storageValue it's read as a string
    if (storageValue === "undefined" || storageValue === "null") {
      return [];
    }
    storageValue = JSON.parse(storageValue);
    return storageValue;
  }
};

export default getLocalStorage;
