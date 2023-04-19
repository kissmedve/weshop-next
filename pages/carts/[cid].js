import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { getSingleItem } from "../axiosCalls/apiGetSingleItem";
import { addItem } from "../axiosCalls/apiPostSingleItem";
import {
  updateSingleItem,
  findMatchingCartAndUpdate,
} from "../axiosCalls/apiPutSingleItem";
import { priceDisplay } from "../../utils/priceDisplay";
import { statusName } from "../../utils/statusName";
import Message from "../../components/Message";

function CartEdit({ savedCart }) {
  // local states
  const [cart, setCart] = useState();
  const [cartJustLoaded, setCartJustLoaded] = useState(false);
  const [message, setMessage] = useState();
  const [error, setError] = useState();
  const [isLoading, setLoading] = useState(true);

  // const loggedInUserId = "62ca80c8d32edba64f18ef38"; // John Doe

  const addLineItemPricesToCart = () => {
    console.log({ cart });
    let lineItemsWithLineItemPrices = cart.lineItems.map((lineItem) => {
      let lineItemQuantity =
        cart.status > 0 ? lineItem.quantityDelivered : lineItem.quantityOrdered;
      return {
        ...lineItem,
        lineItemPrice: lineItem.priceAtOrder * lineItemQuantity,
      };
    });
    setCart({
      ...cart,
      lineItems: lineItemsWithLineItemPrices,
    });
  };

  useEffect(() => {
    setCart(savedCart);

    setCartJustLoaded(true);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (cartJustLoaded) {
      addLineItemPricesToCart();
      setCartJustLoaded(false);
    }
  }, [cartJustLoaded]);

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  const increaseQuantity = (event, productId) => {
    const lineItems = cart.lineItems.map((lineItem) => {
      if (lineItem.productId === productId) {
        lineItem.quantityOrdered += 1;
        lineItem.lineItemPrice =
          lineItem.quantityOrdered * lineItem.priceAtOrder;
      }
      return lineItem;
    });

    setCart({
      ...cart,
      lineItems: lineItems,
    });
  };

  const decreaseQuantity = (event, productId) => {
    const lineItems = cart.lineItems.map((lineItem) => {
      if (lineItem.productId === productId) {
        lineItem.quantityOrdered > 0
          ? (lineItem.quantityOrdered -= 1)
          : (lineItem.quantityOrdered = 0);
        lineItem.lineItemPrice =
          lineItem.quantityOrdered * lineItem.priceAtOrder;
      }
      return lineItem;
    });

    setCart({
      ...cart,
      lineItems,
    });
  };

  const inputQuantityAsValue = (event, productId) => {
    const lineItems = savedCart.lineItems.map((lineItem) => {
      if (lineItem.productId === productId) {
        Number(event.target.value) >= 0
          ? (lineItem.quantityOrdered = Number(event.target.value))
          : (lineItem.quantityOrdered = 0);
        lineItem.lineItemPrice =
          Number(event.target.value) * lineItem.priceAtOrder;
      }
      return lineItem;
    });

    setCart({
      ...cart,
      lineItems,
    });
  };

  const saveCart = (event) => {
    let cartToSave = {
      user: cart.user._id,
      shop: cart.shop._id,
      status: cart.status || 0,
      lineItems: cart.lineItems,
    };

    updateSingleItem("carts", cart._id, cartToSave)
      .then((response) => {
        setMessage({
          message: response.data.message,
          status: response.status,
        });
      })
      .catch((error) => setError(error));
  };

  const openCartDisplay = () => {
    const cartIsOpen =
      cart.lineItems &&
      cart.lineItems.length > 0 &&
      (cart.status < 1 || !cart.status);
    if (cartIsOpen)
      return (
        <>
          <h2 className="title title-with-subtitle is-size-4">
            {cart.shop.name}
          </h2>
          <strong className="title is-size-6">{cart.user.name}</strong>
          <span className="tag is-dark">
            {statusName(cart.status, cart._id)}
          </span>
          <table className="table" key={cart._id}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price/Unit</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {cart.lineItems.map((lineItem) => (
                <tr key={lineItem.productId}>
                  <td>{lineItem.productName}</td>
                  <td>
                    <button
                      className="button is-normal amount-minus"
                      onClick={(event) =>
                        decreaseQuantity(event, lineItem.productId)
                      }
                    >
                      <span className="icon is-medium">
                        <FontAwesomeIcon
                          icon={faMinus}
                          style={{ fontSize: 16 }}
                        />
                      </span>
                    </button>
                    <input
                      type="number"
                      value={lineItem.quantityOrdered}
                      min="0"
                      className="amount-input"
                      onChange={(event) =>
                        inputQuantityAsValue(event, lineItem.productId)
                      }
                    />
                    <button
                      className="button is-normal amount-plus"
                      onClick={(event) =>
                        increaseQuantity(event, lineItem.productId)
                      }
                    >
                      <span className="icon is-medium">
                        <FontAwesomeIcon
                          icon={faPlus}
                          style={{ fontSize: 16 }}
                        />
                      </span>
                    </button>
                  </td>
                  <td>
                    {lineItem.priceAtOrder &&
                      priceDisplay(lineItem.priceAtOrder, "€")}
                  </td>
                  <td>
                    {lineItem.lineItemPrice &&
                      priceDisplay(lineItem.lineItemPrice, "€")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="buttons">
            <button
              className="button is-normal has-text-white has-background-grey-dark save-order"
              onClick={(event) => saveCart(event, cart)}
            >
              Save cart
            </button>
          </div>
        </>
      );
  };
  const closedCartDisplay = (cart) => {
    const cartIsClosed =
      cart.lineItems && cart.lineItems.length > 0 && cart.status > 0;
    if (cartIsClosed)
      return (
        <>
          <h2 className="title title-with-subtitle is-size-4">
            {cart.shop.name}
          </h2>
          <strong className="title is-size-6">{cart.user.name}</strong>
          <span className="tag is-dark">
            saved / {statusName(cart.status, cart._id)}
          </span>
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty Ord</th>
                <th>Qty Deliv</th>
                <th>Price/Unit</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {cart.lineItems.map((lineItem) => (
                <tr key={lineItem.productId}>
                  <td>{lineItem.productName}</td>
                  <td>{lineItem.quantityOrdered}</td>
                  <td>{lineItem.quantityDelivered}</td>
                  <td>
                    {lineItem.priceAtOrder &&
                      priceDisplay(lineItem.priceAtOrder, "€")}
                  </td>
                  <td>
                    {lineItem.lineItemPrice &&
                      priceDisplay(lineItem.lineItemPrice, "€")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      );
  };
  const emptyCartDisplay = (cart) => {
    if (!cart.lineItems)
      return (
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="5">Your cart is empty.</td>
            </tr>
          </tbody>
        </table>
      );
  };

  return (
    <>
      <div className="container cartadmin">
        <section className="section">
          <h1 className="title is-size-3">Cart</h1>
          <div className="title is-size-6">
            User: {cart.user.firstName} {cart.user.lastName}
          </div>

          {message && (
            <Message message={message.message} status={message.status} />
          )}
          {cart && cart.lineItems.length > 0 ? (
            <>
              {openCartDisplay(cart)}
              {closedCartDisplay(cart)}
              {emptyCartDisplay(cart)}
              <hr />
            </>
          ) : (
            ""
          )}
        </section>
      </div>
    </>
  );
}
export default CartEdit;

export async function getServerSideProps(context) {
  const cid = context.params.cid;
  const savedCart = await getSingleItem("carts", cid);
  return {
    props: { savedCart },
  };
}
