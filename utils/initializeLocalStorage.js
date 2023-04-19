import getLocalStorage from "./getLocalStorage";
import saveToLocalStorage from "./saveToLocalStorage";

const initializeLocalStorage = () => {
  const storage = getLocalStorage("WeShopOpenCart");
  if (storage?.stored?.length > 0 || storage?.storageOwner) {
    return;
  } else {
    saveToLocalStorage([], "");
    return;
  }
};

export default initializeLocalStorage;
