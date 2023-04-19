import React, { useState, useEffect } from "react";
import { useSession, getSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { getFilteredCarts } from "../axiosCalls/apiGetMultipleItems";
import { addMultipleItems } from "../axiosCalls/apiPostMultipleItems";
import { updateMultipleItems } from "../axiosCalls/apiPutMultipleItems";
import { deleteItem } from "../axiosCalls/apiDeleteItem";
import { priceDisplay } from "../../utils/priceDisplay";
import Message from "../../components/Message";
import Spinner from "../../components/Spinner";
import getLocalStorage from "../../utils/getLocalStorage";
import saveToLocalStorage from "../../utils/saveToLocalStorage";
import initializeLocalStorage from "../../utils/initializeLocalStorage";

function CartCurrent() {
  // local states
  const [localStorageItems, setLocalStorageItems] = useState([]);
  const [localStorageOwner, setLocalStorageOwner] = useState({});
  const [currentCarts, setCurrentCarts] = useState([]);
  const [cartsFromDB, setCartsFromDB] = useState([]);
  const [currentShops, setCurrentShops] = useState([]);
  const [currentShopsOnly, setCurrentShopsOnly] = useState([]);
  const [shopsFromDBOnly, setShopsFromDBOnly] = useState([]);
  const [mixedShops, setMixedShops] = useState([]);
  const [localStorageChanged, setLocalStorageChanged] = useState(false);
  const [
    savedToLocalStorageFromCartCurrent,
    setSavedToLocalStorageFromCartCurrent,
  ] = useState(false);
  const [message, setMessage] = useState();
  const [error, setError] = useState();
  const [isLoading, setLoading] = useState(true);

  const getItemsFromLocalStorage = () => {
    const storedItems = getLocalStorage("WeShopOpenCart").stored;
    let uniqueShops = []; // with _id and name
    if (storedItems && storedItems.length > 0) {
      const storedWithLineItemPrices = storedItems.map((lineItem) => {
        lineItem.lineItemPrice =
          lineItem.quantityOrdered * lineItem.priceAtOrder;
        lineItem.lineItemStatus = "new";
        if (!uniqueShops.find((shop) => shop._id === lineItem.shop._id)) {
          uniqueShops.push({
            _id: lineItem.shop._id,
            name: lineItem.shop.name,
          });
        }
        return lineItem;
      });
      setLocalStorageItems(storedWithLineItemPrices);
      setCurrentShops(uniqueShops);
    }
  };

  const getStorageOwner = () => {
    const storageOwner = getLocalStorage("WeShopOpenCart").storageOwner;
    setLocalStorageOwner(storageOwner);
  };

  const separateShops = () => {
    const shopsFromDBCarts = cartsFromDB.map((cart) => cart.shop);
    const shopsFromDBCartsIds = shopsFromDBCarts.map((shop) => shop._id);

    const currentShopsIds = currentShops.map((shop) => shop._id);

    const doubleShops = currentShops.filter((shop) =>
      shopsFromDBCartsIds.includes(shop._id)
    );
    const doubleShopIds = doubleShops.map((shop) => shop._id);

    const shopsFromDBCartsReduced = shopsFromDBCarts.filter(
      (shop) => !doubleShopIds.includes(shop._id)
    );

    const currentShopsReduced = currentShops.filter(
      (shop) => !doubleShopIds.includes(shop._id)
    );

    setShopsFromDBOnly(shopsFromDBCartsReduced);
    setCurrentShopsOnly(currentShopsReduced);
    setMixedShops(doubleShops);
  };

  const createCurrentCarts = () => {
    const newCarts = currentShops.map((shop) => {
      let newCartItems = [];
      localStorageItems.forEach((item) => {
        if (item.shop._id === shop._id) {
          newCartItems.push({
            productId: item.productId,
            productName: item.productName,
            quantityOrdered: item.quantityOrdered,
            priceAtOrder: item.priceAtOrder,
            lineItemPrice: item.lineItemPrice,
            lineItemStatus: item.lineItemStatus,
          });
        }
      });
      let newCart = {
        shop: {
          _id: shop._id,
          name: shop.name,
        },
        status: 0,
        user: localStorageOwner._id,
        lineItems: newCartItems,
      };
      return newCart;
    });
    setCurrentCarts(newCarts);
  };

  const setLineItemPrices = (carts) => {
    const cartsWithLineItemPrices = carts.map((cart) => ({
      ...cart,
      lineItems: cart.lineItems.map((lineItem) => ({
        ...lineItem,
        lineItemPrice: lineItem.priceAtOrder * lineItem.quantityOrdered,
        lineItemStatus: "saved",
      })),
    }));
    return cartsWithLineItemPrices;
  };

  const removeEmptyCurrentCarts = () => {
    const currentCartsNoQtyZero = currentCarts.filter(
      (lineItem) => lineItem.quantityOrdered > 0
    );

    const remainingCurrentCarts = currentCartsNoQtyZero.filter(
      (cart) => cart.lineItems.length > 0
    );

    const remainingCurrentShopsOnly = remainingCurrentCarts.map(
      (cart) => cart.shop._id
    );
    setCurrentCarts(remainingCurrentCarts);
    setCurrentShopsOnly(remainingCurrentShopsOnly);
  };

  useEffect(() => {
    initializeLocalStorage();
    getItemsFromLocalStorage();
    getStorageOwner();
    setLoading(false);
  }, []);

  useEffect(() => {
    if (localStorageOwner._id) {
      getFilteredCarts(localStorageOwner._id, "", "", 24, 1).then(
        (response) => {
          const filteredCarts = response[0];
          const filteredCartsWithLineItemPrices =
            setLineItemPrices(filteredCarts);
          setCartsFromDB(filteredCartsWithLineItemPrices);
        }
      );
    }
  }, [localStorageOwner]);

  useEffect(() => {
    separateShops();
    createCurrentCarts();
  }, [localStorageItems]);

  useEffect(() => {
    separateShops();
  }, [cartsFromDB]);

  useEffect(() => {
    const reportChange = () => {
      setLocalStorageChanged(true);
    };
    window.addEventListener("storage", reportChange);
    return () => {
      window.removeEventListener("storage", reportChange);
    };
  });

  useEffect(() => {
    if (!savedToLocalStorageFromCartCurrent) {
      getItemsFromLocalStorage();
      removeEmptyCurrentCarts();
      getStorageOwner();
    }
    if (savedToLocalStorageFromCartCurrent) {
      setSavedToLocalStorageFromCartCurrent(false);
    }
    setLocalStorageChanged(false);
  }, [localStorageChanged]);

  if (isLoading) {
    return <Spinner />;
  }

  const modifyCart = (cartCollection, shopId, productId, type, value) => {
    const shopCart = cartCollection.find((cart) => cart.shop._id === shopId);
    const lineItems = shopCart.lineItems.map((lineItem) => {
      if (lineItem.productId === productId) {
        switch (type) {
          case "increase":
            lineItem.quantityOrdered += 1;
            break;
          case "decrease":
            if (lineItem.quantityOrdered > 0) {
              lineItem.quantityOrdered -= 1;
            } else {
              lineItem.quantityOrdered -= 0;
            }
            break;
          case "quantityAsValue":
            if (Number(value) > 0) {
              lineItem.quantityOrdered = Number(value);
            } else {
              lineItem.quantityOrdered = 0;
            }
            break;
          default:
            lineItem.quantityOrdered += 0;
        }

        lineItem.lineItemPrice =
          lineItem.quantityOrdered * lineItem.priceAtOrder;

        if (cartCollection === cartsFromDB) {
          lineItem.lineItemStatus = "changed";
        }
      }

      return lineItem;
    });

    const changedCartCollection = cartCollection.map((cart) => {
      cart = cart.shop._id === shopId ? shopCart : cart;
      return cart;
    });
    return changedCartCollection;
  };

  const modifyLocalStorageItems = (shopId, productId, type, value) => {
    const changedLocalStorageItems = localStorageItems.map((item) => {
      if (item.productId === productId && item.shop._id === shopId) {
        switch (type) {
          case "increase":
            item.quantityOrdered += 1;
            break;
          case "decrease":
            if (item.quantityOrdered > 0) {
              item.quantityOrdered -= 1;
            } else {
              item.quantityOrdered = 0;
            }
            break;
          case "quantityAsValue":
            if (Number(value) > 0) {
              item.quantityOrdered = Number(value);
            } else {
              item.quantityOrdered = 0;
            }
            break;
          default:
            item.quantityOrdered += 0;
        }
        item.lineItemPrice = item.quantityOrdered * item.priceAtOrder;
      }
      return item;
    });
    const positiveLocalStorageItems = changedLocalStorageItems.filter(
      (item) => item.quantityOrdered > 0
    );
    removeEmptyCurrentCarts();

    setLocalStorageItems(positiveLocalStorageItems);
    setLocalStorageChanged(true);
    setSavedToLocalStorageFromCartCurrent(true);
    saveToLocalStorage(positiveLocalStorageItems, localStorageOwner);
  };

  const modifyQuantity = (shopId, productId, cartId, type, value) => {
    if (cartId === "new") {
      const changedCurrentCarts = modifyCart(
        currentCarts,
        shopId,
        productId,
        type,
        value
      );
      setCurrentCarts(changedCurrentCarts);
      modifyLocalStorageItems(shopId, productId, type, value);
    } else {
      const changedCartsFromDB = modifyCart(
        cartsFromDB,
        shopId,
        productId,
        type,
        value
      );
      setCartsFromDB(changedCartsFromDB);
    }
  };

  const increaseQuantity = (event, productId, shopId, cartId) => {
    modifyQuantity(shopId, productId, cartId, "increase", event.target.value);
  };

  const decreaseQuantity = (event, productId, shopId, cartId) => {
    modifyQuantity(shopId, productId, cartId, "decrease", event.target.value);
  };

  const inputQuantityAsValue = (event, productId, shopId, cartId) => {
    modifyQuantity(
      shopId,
      productId,
      cartId,
      "quantityAsValue",
      event.target.value
    );
  };

  const deleteEmptyCart = (carts) => {
    carts.forEach((cart) => {
      if (
        cart.lineItems.length > 0 &&
        cart.lineItems.find((lineItem) => lineItem.quantityOrdered > 0)
      ) {
        return;
      } else {
        const remainingCarts = cartsFromDB.filter(
          (cartDB) => cartDB._id !== cart._id
        );

        setCartsFromDB(remainingCarts);

        if (mixedShops.includes(cart.shop._id)) {
          let filteredMixedShops = mixedShops.filter(
            (shop) => shop._id !== cart.shop._id
          );
          setMixedShops(filteredMixedShops);
        }
        if (shopsFromDBOnly.includes(cart.shop._id)) {
          let filteredShopsFromDBOnly = shopsFromDBOnly.filter(
            (shop) => shop._id !== cart.shop._id
          );
          setShopsFromDBOnly(filteredShopsFromDBOnly);
        }

        deleteItem("carts", cart._id)
          .then((response) => {
            console.log("cart", cart._id, "deleted");
          })
          .catch((error) => setError(error));
      }
    });
  };

  const saveCarts = (event) => {
    let newCartsToSave = [];
    let modifiedCartsToSave = [];

    currentCarts.forEach((cart) => {
      if (currentShopsOnly.find((shop) => shop._id === cart.shop._id)) {
        let newCart = {
          shop: cart.shop._id,
          user: localStorageOwner._id,
          userSubtotal: "",
          userTotal: "",
          status: 0,
          lineItems: cart.lineItems
            .map((lineItem) => ({
              productId: lineItem.productId,
              productName: lineItem.productName,
              priceAtOrder: lineItem.priceAtOrder,
              priceAtDelivery: "",
              quantityOrdered: lineItem.quantityOrdered,
              quantityDelivered: "",
              lineItemPrice: lineItem.lineItemPrice,
              lineItemStatus: "saved",
            }))
            .filter((lineItem) => lineItem.quantityOrdered > 0),
        };
        newCartsToSave.push(newCart);
      }

      if (mixedShops.find((shop) => shop._id === cart.shop._id)) {
        const cartToModify = cartsFromDB.find(
          (cartFromDB) => cartFromDB.shop._id === cart.shop._id
        );
        const additionalCart = currentCarts.find(
          (currentCart) => currentCart.shop._id === cart.shop._id
        );
        const allChangedLineItems = [];
        const allChangedLineItemsIds = [];
        // list all saved lineItems
        cartToModify.lineItems.forEach((lineItem) => {
          allChangedLineItems.push({
            ...lineItem,
            productId: lineItem.productId,
            productName: lineItem.productName,
            priceAtOrder: lineItem.priceAtOrder,
            quantityOrdered: lineItem.quantityOrdered,
            lineItemPrice: lineItem.lineItemPrice,
            lineItemStatus: "saved",
          });
          allChangedLineItemsIds.push(lineItem.productId);
        });
        // if there are lineItems with same productId in both carts, current and fromDB, add up their quantities
        additionalCart.lineItems.forEach((lineItem) => {
          if (allChangedLineItemsIds.includes(lineItem.productId)) {
            let changedLineItem = allChangedLineItems.find(
              (item) => item.productId === lineItem.productId
            );
            changedLineItem.quantityOrdered += lineItem.quantityOrdered;
            changedLineItem.lineItemPrice += lineItem.lineItemPrice;
            lineItem.quantityOrdered = 0;
            lineItem.productId = lineItem.productId + "___";
          } else {
            allChangedLineItems.push({
              ...lineItem,
              productId: lineItem.productId,
              productName: lineItem.productName,
              priceAtOrder: lineItem.priceAtOrder,
              priceAtDelivery: "",
              quantityOrdered: lineItem.quantityOrdered,
              quantityDelivered: "",
              lineItemPrice: lineItem.lineItemPrice,
            });
          }
        });

        allChangedLineItems = allChangedLineItems.filter(
          (lineItem) => lineItem.quantityOrdered > 0
        );
        const modifiedCart = {
          ...cartToModify,
          lineItems: allChangedLineItems,
        };
        modifiedCartsToSave.push(modifiedCart);
      }
    });

    cartsFromDB.forEach((cart) => {
      if (
        shopsFromDBOnly.find((shop) => shop._id === cart.shop._id) &&
        cart.lineItems.find((lineItem) => lineItem.lineItemStatus === "changed")
      ) {
        let modifiedCart = {
          ...cart,
          lineItems: cart.lineItems
            .map((lineItem) => ({
              ...lineItem,
              productId: lineItem.productId,
              productName: lineItem.productName,
              priceAtOrder: lineItem.priceAtOrder,
              quantityOrdered: lineItem.quantityOrdered,
              lineItemStatus: "saved",
            }))
            .filter((lineItem) => lineItem.quantityOrdered > 0),
        };
        modifiedCartsToSave.push(modifiedCart);
      }
    });

    deleteEmptyCart(modifiedCartsToSave);

    if (newCartsToSave.length > 0) {
      addMultipleItems("carts", newCartsToSave)
        .then((response) => {
          setMessage({
            message: response.message,
            status: response.status,
          });
          let returnedNewCarts = response.data;

          setCurrentCarts([]);

          setCartsFromDB([...cartsFromDB, ...returnedNewCarts]);
          setLocalStorageItems([]);
          setSavedToLocalStorageFromCartCurrent(true);
          saveToLocalStorage([]);
        })
        .catch((error) => setError(error));
    }

    if (modifiedCartsToSave.length > 0) {
      updateMultipleItems("carts", modifiedCartsToSave)
        .then((response) => {
          setMessage({
            message: response.message,
            status: response.status,
          });

          let returnedCarts = response.data;
          let returnedCartswithLineItemPrices =
            setLineItemPrices(returnedCarts);

          let cartsFromDBModified = cartsFromDB.map((cart) => {
            let matchingCart = returnedCartswithLineItemPrices.find(
              (returnedCart) => returnedCart._id === cart._id
            );

            return matchingCart ? matchingCart : cart;
          });

          setCartsFromDB(...cartsFromDB, ...cartsFromDBModified);
          setCurrentCarts([]);
          setLocalStorageItems([]);
          setSavedToLocalStorageFromCartCurrent(true);
          saveToLocalStorage([]);
        })
        .catch((error) => setError(error));
    }
  };

  const displayLineItem = (lineItem, shopId, cartId) => {
    return (
      <tr key={lineItem.productId}>
        <td>{lineItem.productName}</td>
        <td>
          <button
            className="button is-normal amount-minus"
            onClick={(event) =>
              decreaseQuantity(event, lineItem.productId, shopId, cartId)
            }
          >
            <span className="icon is-medium">
              <FontAwesomeIcon icon={faMinus} style={{ fontSize: 16 }} />
            </span>
          </button>
          <input
            type="number"
            value={lineItem.quantityOrdered}
            min="0"
            className="amount-input"
            onChange={(event) =>
              inputQuantityAsValue(event, lineItem.productId, shopId, cartId)
            }
          />
          <button
            className="button is-normal amount-plus"
            onClick={(event) =>
              increaseQuantity(event, lineItem.productId, shopId, cartId)
            }
          >
            <span className="icon is-medium">
              <FontAwesomeIcon icon={faPlus} style={{ fontSize: 16 }} />
            </span>
          </button>
        </td>
        <td>
          {lineItem.priceAtOrder && priceDisplay(lineItem.priceAtOrder, "€")}
        </td>
        <td>
          {lineItem.lineItemPrice && priceDisplay(lineItem.lineItemPrice, "€")}
        </td>
        <td>
          {lineItem.lineItemStatus ? (
            <span className="tag is-dark">{lineItem.lineItemStatus}</span>
          ) : (
            ""
          )}
        </td>
      </tr>
    );
  };

  const displayLineItems = (shopId) => {
    let allDisplayedItems = [];

    let currentC = currentCarts.find((cart) => cart.shop._id === shopId);

    let fromDBC = cartsFromDB.find((cart) => cart.shop._id === shopId);

    if (currentC) {
      currentC.lineItems.forEach((lineItem) =>
        allDisplayedItems.push(displayLineItem(lineItem, shopId, "new"))
      );
    }
    if (fromDBC) {
      fromDBC.lineItems.forEach((lineItem) =>
        allDisplayedItems.push(displayLineItem(lineItem, shopId, fromDBC._id))
      );
    }

    allDisplayedItems.join();
    return allDisplayedItems;
  };

  const displayCart = (shopId, shopName) => {
    return (
      <>
        <h2 className="title title-with-subtitle is-size-4">{shopName}</h2>
        <table className="table" key={shopId}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Price/Unit</th>
              <th>Price</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>{displayLineItems(shopId)}</tbody>
        </table>
      </>
    );
  };

  const displayCarts = () => {
    const allShops = [...currentShopsOnly, ...mixedShops, ...shopsFromDBOnly];
    const allCarts = allShops.map((shop) => displayCart(shop._id, shop.name));

    return allCarts;
  };

  return (
    <>
      <div className="container cartadmin">
        <section className="section">
          <h2 className="title is-size-5">{`${localStorageOwner.lastName}, ${localStorageOwner.firstName}`}</h2>
          <h1 className="title is-size-3">Open Carts</h1>

          {/* {message && (
            <Message message={message.message} status={message.status} />
          )} */}

          {displayCarts()}

          <button
            className="button is-normal has-text-white has-background-grey-dark save-order"
            onClick={saveCarts}
          >
            Save Carts
          </button>
        </section>
      </div>
    </>
  );
}

export default CartCurrent;
