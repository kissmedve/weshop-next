const saveToLocalStorage = (storageItem, attributedUser) => {
  const storedObject = {
    storageOwner: attributedUser,
    stored: storageItem,
  };
  localStorage.setItem("WeShopOpenCart", JSON.stringify(storedObject));
};

export default saveToLocalStorage;
