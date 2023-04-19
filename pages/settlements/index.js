import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  getItems,
  getFilteredCollectiveCarts,
  getCartsByShopForSettlement,
  getCartsOfCollectiveCart,
} from "../axiosCalls/apiGetMultipleItems";
import { getSingleItem } from "../axiosCalls/apiGetSingleItem";
import { priceDisplay } from "../../utils/priceDisplay";
import { priceInCents } from "../../utils/priceInCents";
import { splitDecimals } from "../../utils/splitDecimals";
import { highestCustomId } from "../../utils/highestCustomId";
import SelectShops from "../../components/SelectShops";
import PriceInputNumber from "../../components/PriceInputNumber";
import Spinner from "../../components/Spinner";
import ButtonDelete from "../../components/ButtonDelete";
import ButtonPrint from "../../components/ButtonPrint";
import Message from "../../components/Message";
import { addItem } from "../axiosCalls/apiPostSingleItem";
import { updateMultipleItems } from "../axiosCalls/apiPutMultipleItems";

function Settlements({ shops, openCollectiveCarts }) {
  // local states
  const [selectableShops, setSelectableShops] = useState([]);
  const [carts, setCarts] = useState([]);
  const [collectiveCarts, setCollectiveCarts] = useState([]);
  const [collectiveCartToSaveId, setCollectiveCartToSaveId] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [consolidatedLineItems, setConsolidatedLineItems] = useState([]);
  const [subtotals, setSubtotals] = useState(); // total per cart w/o custom positions
  const [totals, setTotals] = useState(); // total per cart with custom positions
  const [totalsSubtotal, setTotalsSubtotal] = useState(); // total over all carts w/o custom positions
  const [totalsTotal, setTotalsTotal] = useState(); // total over all carts with custom positions
  const [message, setMessage] = useState();
  const [error, setError] = useState();

  // initial values
  useEffect(() => {
    setCollectiveCarts(openCollectiveCarts[0]);
    setSelectableShops(shops);
    setLoading(false);
  }, []);

  // work on a new settlement: select all open carts related to a shop
  const selectOpenCartsByShop = (event) => {
    getCartsByShopForSettlement(event.target.value)
      .then((response) => {
        setCarts(response);
      })
      .catch((error) => setError(error));
  };

  // resume work on a settlement: get collectiveCart AND involved carts
  const selectCollectiveCart = async (event) => {
    let cartsIds = [];
    let resumedConsolidatedLineItems = [];
    await getSingleItem("collectivecarts", event.target.value).then(
      (response) => {
        cartsIds = response.carts;
        const collectiveCartShop = {
          _id: response.shop._id,
          name: response.shop.name,
        };
        resumedConsolidatedLineItems = response.lineItems.map((lineItem) => ({
          productId: lineItem.productId,
          productName: lineItem.productName,
          quantityDeliveredTotal: lineItem.quantityDelivered,
          priceAtDeliveryTotal: lineItem.priceAtDelivery,
          priceAtDeliveryTotalEuros: splitDecimals(
            lineItem.priceAtDelivery,
            2
          )[0],
          priceAtDeliveryTotalCents: splitDecimals(
            lineItem.priceAtDelivery,
            2
          )[1],
        }));

        setConsolidatedLineItems(resumedConsolidatedLineItems);
      }
    );

    await getCartsOfCollectiveCart(cartsIds)
      .then((response) => {
        const respCarts = response;

        const filledConsolidatedLineItems = resumedConsolidatedLineItems.map(
          (consLineItem) => {
            const productOrders = respCarts.map((cart, index) => {
              let cartLineItem = cart.lineItems.find(
                (item) => item.productId === consLineItem.productId
              );
              return {
                user: {
                  lastName: cart.user.lastName,
                  firstName: cart.user.firstName,
                  _id: cart.user._id,
                },
                cartIndex: index,
                quantityOrdered: cartLineItem.quantityOrdered,
                quantityDelivered: cartLineItem.quantityDelivered,
                priceAtOrder: cartLineItem.priceAtOrder,
              };
            });
            return {
              ...consLineItem,
              orders: productOrders,
            };
          }
        );
        setConsolidatedLineItems(filledConsolidatedLineItems);
      })
      .catch((error) => setError(error));
  };

  // collect line items from user carts and
  // merge them to line items of respective products
  // with all pertaining user orders attached

  const buildLineItemsWithMultipleUsers = (carts) => {
    const lineItemsWithOneUser = carts.map((cart, cartIndex) => {
      return cart.lineItems.map((lineItem) => {
        let userLineItem = {
          productId: lineItem.productId,
          productName: lineItem.productName,
          quantityDeliveredTotal: "",
          priceAtDeliveryTotal: "",
          priceAtDeliveryTotalEuros: "",
          priceAtDeliveryTotalCents: "",
          orders: [
            {
              quantityOrdered: lineItem.quantityOrdered,
              quantityDelivered: "",
              priceAtOrder: lineItem.priceAtOrder,
              priceAtDelivery: "",
              userId: cart.user._id,
              userName: cart.user.name,
              cartIndex: cartIndex,
            },
          ],
          quantityRemainder: "",
          moneyRemainder: "",
        };
        return userLineItem;
      });
    });
    const allLineItemsWithOneUser = lineItemsWithOneUser.reduce(
      (acc, curr) => acc.concat(curr),
      []
    );

    let lineItemsWithUsersCombined = [];

    for (let i = 0; i < allLineItemsWithOneUser.length; i++) {
      let lineItemUsersCombined = lineItemsWithUsersCombined.find(
        (lineItems) =>
          lineItems.productId === allLineItemsWithOneUser[i].productId
      );

      if (lineItemUsersCombined) {
        lineItemUsersCombined.orders.push(allLineItemsWithOneUser[i].orders[0]);
      } else {
        lineItemsWithUsersCombined.push(allLineItemsWithOneUser[i]);
      }
    }

    const combined = lineItemsWithUsersCombined.map(
      (lineItem, lineItemIndex) => {
        for (let i = 0; i < carts.length; i++) {
          if (
            !lineItem.orders[i] ||
            (lineItem.orders[i] && lineItem.orders[i].cartIndex !== i)
          ) {
            lineItem.orders.splice(i, 0, {
              quantityOrdered: "",
              quantityDelivered: "",
              priceAtOrder: "",
              priceAtDelivery: "",
              userId: "",
              userName: "",
              cartIndex: i,
            });
          }
        }
        return lineItem;
      }
    );
    return combined;
  };

  useEffect(() => {
    if (carts.length === 0) return;
    setConsolidatedLineItems(buildLineItemsWithMultipleUsers(carts));
  }, [carts]);

  // manage loading display
  if (isLoading) {
    return <Spinner />;
  }

  // add custom line item ( same as others, just not based in catalog)
  const addCustomLineItem = (event, type) => {
    let cartOrders = [];
    carts.forEach((cart, cartIndex) =>
      cartOrders.push({
        userId: cart.user._id,
        userName: cart.user.name,
        cartIndex: cartIndex,
        quantityOrdered: "",
        quantityDelivered: "",
        priceAtOrder: "",
        priceAtDelivery: "",
      })
    );
    const customLineItem = {
      productName: "",
      productId: `${type}-${highestCustomId(consolidatedLineItems, type) + 1}`,
      quantityDeliveredTotal: "",
      priceAtDeliveryTotal: "",
      priceAtDeliveryTotalEuros: "",
      priceAtDeliveryTotalCents: "",
      quantityRemainder: "",
      moneyRemainder: "",
      orders: cartOrders,
    };
    let consolidated = [...consolidatedLineItems, customLineItem];
    setConsolidatedLineItems(consolidated);
  };

  // delete custom line item (non custom ones are based in db and can't be deleted here)
  const deleteCustomLineItem = (event, productId) => {
    const consolidated = consolidatedLineItems.filter(
      (lineItem) => lineItem.productId !== productId
    );
    setConsolidatedLineItems(consolidated);
  };

  // value inputs

  // productName of line item
  const changeProductName = (event, productId) => {
    const consolidated = consolidatedLineItems.map((lineItem) => {
      if (lineItem.productId === productId) {
        lineItem.productName = event.target.value;
      }
      return lineItem;
    });
    setConsolidatedLineItems(consolidated);
  };

  // quantity delivered total per line item
  const changeQtyDeliveredTotal = (event, productId) => {
    const consolidated = consolidatedLineItems.map((lineItem, index) => {
      if (lineItem.productId === productId) {
        lineItem.quantityDeliveredTotal = Number(event.target.value);
        lineItem.quantityRemainder = calculateQuantityRemainder(index);
        lineItem.moneyRemainder = calculateMoneyRemainder(index);
        calculateOrderPricesAtDelivery(index);
        calculateSubtotalsPricesOrder();
        calculateTotalsPricesOrder();
        calculateTotalsPricesSubtotal();
        calculateTotalsPricesTotal();
      }
      return lineItem;
    });
    setConsolidatedLineItems(consolidated);
  };

  // price at delivery total per line item (initial input, Euros and Cents)
  const inputPriceAtDeliveryTotal = (event, productId) => {
    let target =
      event.target.name === "priceEuros"
        ? "priceAtDeliveryTotalEuros"
        : "priceAtDeliveryTotalCents";
    const consolidated = consolidatedLineItems.map((lineItem) => {
      if (lineItem.productId === productId) {
        lineItem[target] = event.target.value;
        lineItem.priceAtDeliveryTotal = priceInCents(
          lineItem.priceAtDeliveryTotalEuros,
          lineItem.priceAtDeliveryTotalCents
        );
      }
      return lineItem;
    });
    setConsolidatedLineItems(consolidated);
  };

  // price at delivery total (re-input after validation, Euros and Cents)
  const changePriceAtDeliveryTotal = (type, value, productId) => {
    let target =
      type === "priceEuros"
        ? "priceAtDeliveryTotalEuros"
        : "priceAtDeliveryTotalCents";
    const consolidated = consolidatedLineItems.map(
      (lineItem, lineItemIndex) => {
        if (lineItem.productId === productId) {
          lineItem[target] = value;
          lineItem.priceAtDeliveryTotal = priceInCents(
            lineItem.priceAtDeliveryTotalEuros,
            lineItem.priceAtDeliveryTotalCents
          );
          calculateOrderPricesAtDelivery(lineItemIndex);
          calculateSubtotalsPricesOrder();
          calculateTotalsPricesOrder();
          calculateTotalsPricesSubtotal();
          calculateTotalsPricesTotal();
          lineItem.moneyRemainder = calculateMoneyRemainder(lineItemIndex);
        }
        return lineItem;
      }
    );
    setConsolidatedLineItems(consolidated);
  };

  // quantity ordered by user (for "custom" articles not included in catalog)
  const changeQtyOrderedUser = (event, productId, orderIndex) => {
    const consolidated = consolidatedLineItems.map(
      (lineItem, lineItemIndex) => {
        if (lineItem.productId === productId) {
          lineItem.orders.map((order) => {
            if (order.cartIndex === orderIndex)
              order.quantityOrdered = Number(event.target.value);
            return order;
          });
        }
        return lineItem;
      }
    );
    setConsolidatedLineItems(consolidated);
  };

  // quantity delivered per line item order
  const changeQtyDeliveredUser = (event, productId, orderIndex) => {
    const consolidated = consolidatedLineItems.map((lineItem, index) => {
      if (lineItem.productId === productId) {
        lineItem.orders.map((order) => {
          if (order.cartIndex === orderIndex) {
            order.quantityDelivered = Number(event.target.value);
            calculateOrderPricesAtDelivery(index);
            calculateSubtotalsPricesOrder();
            calculateTotalsPricesOrder();
          }
          return order;
        });
        lineItem.quantityRemainder = calculateQuantityRemainder(index);
        lineItem.moneyRemainder = calculateMoneyRemainder(index);
      }
      return lineItem;
    });
    setConsolidatedLineItems(consolidated);
  };

  // line item calculations

  const calculateQuantityRemainder = (lineItemIndex) => {
    let lineItem = consolidatedLineItems[lineItemIndex];
    let orderQuantities = lineItem.orders
      .map((order) => order.quantityDelivered)
      .reduce((acc, curr) => acc + curr, 0);
    let qtyDelivTotal = lineItem.quantityDeliveredTotal
      ? lineItem.quantityDeliveredTotal
      : 0;
    let quantityRemainder = qtyDelivTotal - orderQuantities;
    return quantityRemainder;
  };

  const calculateMoneyRemainder = (lineItemIndex) => {
    let lineItem = consolidatedLineItems[lineItemIndex];
    if (!lineItem.quantityDeliveredTotal) return;
    let priceDelivTotal = lineItem.priceAtDeliveryTotal || 0;
    let qtyRemainder = lineItem.quantityRemainder || 0;
    let moneyRemainder =
      (qtyRemainder * priceDelivTotal) / lineItem.quantityDeliveredTotal;
    return moneyRemainder;
  };

  const calculateOrderPricesAtDelivery = (lineItemIndex) => {
    let specLineItem = consolidatedLineItems[lineItemIndex];
    specLineItem.orders.map((order, index) => {
      if (
        order.quantityDelivered >= 0 &&
        specLineItem.priceAtDeliveryTotal &&
        specLineItem.quantityDeliveredTotal
      ) {
        order.priceAtDelivery =
          (specLineItem.priceAtDeliveryTotal * order.quantityDelivered) /
          specLineItem.quantityDeliveredTotal;
      }
      return order;
    });
  };

  // perform calculations in table

  const calculateSubtotalsPricesOrder = () => {
    let subtotals = [];
    let orders = consolidatedLineItems
      .filter((lineItem) => !lineItem.productId.includes("extra"))
      .map((lineItem) => lineItem.orders);
    for (let i = 0; i < orders[0].length; i++) {
      subtotals.push(
        orders.reduce((acc, curr) => acc + (curr[i].priceAtDelivery || 0), 0)
      );
    }
    setSubtotals(subtotals);
  };

  const calculateTotalsPricesOrder = () => {
    let totals = [];
    let orders = consolidatedLineItems.map((lineItem) => lineItem.orders);
    for (let i = 0; i < orders[0].length; i++) {
      totals.push(
        orders.reduce((acc, curr) => acc + (curr[i].priceAtDelivery || 0), 0)
      );
    }
    setTotals(totals);
  };

  const calculateTotalsPricesTotal = () => {
    let priceDeliveryTotalsTotal = consolidatedLineItems
      .map((lineItem) => lineItem.priceAtDeliveryTotal || 0)
      .reduce((acc, curr) => acc + curr, 0);
    setTotalsTotal(priceDeliveryTotalsTotal);
  };

  const calculateTotalsPricesSubtotal = () => {
    let priceDeliveryTotalsSubtotal = consolidatedLineItems
      .filter((lineItem) => !lineItem.productId.includes("extra"))
      .map((lineItem) => lineItem.priceAtDeliveryTotal || 0)
      .reduce((acc, curr) => acc + curr, 0);
    setTotalsSubtotal(priceDeliveryTotalsSubtotal);
  };

  // print
  const printTable = (event) => {};

  // save carts

  const saveCollectiveCart = async () => {
    let lineItemTotals = consolidatedLineItems.map((lineItem) => ({
      ...lineItem,
      productId: lineItem.productId,
      productName: lineItem.productName,
      quantityDelivered: lineItem.quantityDeliveredTotal,
      priceAtDelivery: lineItem.priceAtDeliveryTotal,
      quantityRemainder: lineItem.quantityRemainder,
      moneyRemainder: lineItem.moneyRemainder,
    }));

    let collectiveCartUsers = carts.map((cart) => cart.user._id);
    let collectiveCartCarts = carts.map((cart) => cart._id);

    let collectiveCartToSave = {
      ...collectiveCartToSave,
      lineItems: lineItemTotals,
      subtotal: totalsSubtotal,
      total: totalsTotal,
      shop: carts[0].shop._id,
      // deliveryDate: "",
      carts: collectiveCartCarts,
      users: collectiveCartUsers,
      // status: 1,
    };

    if (!collectiveCartToSaveId) {
      await addItem("collectivecarts", collectiveCartToSave)
        .then((response) => {
          setMessage({
            message: response.data.message,
            status: response.status,
          });
        })
        .catch((error) => setError(error));
    } else {
      await updateSingleItem(
        "collectivecarts",
        collectiveCartToSaveId,
        collectiveCartToSave
      )
        .then((response) => {
          setMessage({
            message: response.data.message,
            status: response.status,
          });
        })
        .catch((error) => setError(error));
    }
  };

  const updateIncludedCarts = async () => {
    let flattenedLineItems = consolidatedLineItems.flatMap((lineItem) => {
      return lineItem.orders.map((order) => ({
        ...order,
        productId: lineItem.productId,
        productName: lineItem.productName,
        priceAtOrder: order.priceAtOrder,
        priceAtDelivery: order.priceAtDelivery,
        quantityOrdered: order.quantityOrdered,
        quantityDelivered: order.quantityDelivered,
        userSubtotal: subtotals && subtotals[order.cartIndex],
        userTotal: totals && totals[order.cartIndex],
        user: order.userId,
        shop: carts[order.cartIndex].shop._id,
        status: 0,
        cartId: carts[order.cartIndex]._id,
      }));
    });

    let cartUsers = carts.map((cart) => cart.user._id);

    let userCarts = cartUsers.map((cartUser) => {
      let userLineItems = flattenedLineItems.filter(
        (flattened) => flattened.user === cartUser
      );
      let userCartData = {
        userSubtotal: userLineItems[0].userSubtotal,
        userTotal: userLineItems[0].userTotal,
        user: userLineItems[0].user,
        shop: userLineItems[0].shop,
        status: userLineItems[0].status,
        _id: userLineItems[0].cartId,
      };
      let userCartLineItems = userLineItems.map((lineItem) => ({
        ...lineItem,
        productId: lineItem.productId,
        productName: lineItem.productName,
        priceAtOrder: lineItem.priceAtOrder,
        priceAtDelivery: lineItem.priceAtDelivery,
        quantityOrdered: lineItem.quantityOrdered,
        quantityDelivered: lineItem.quantityDelivered,
      }));
      return {
        ...userCartData,
        lineItems: userCartLineItems,
      };
    });

    await updateMultipleItems("carts", userCarts)
      .then((response) => {
        setMessage({
          message: response.data.message,
          status: response.status,
        });
      })
      .catch((error) => setError(error));
  };

  // save augmented carts and collective cart
  const save = (event) => {
    saveCollectiveCart();
    updateIncludedCarts();
  };

  // display 'extra' line items separately (for additional charges, fees, rebates etc)
  const extraLineItems = consolidatedLineItems.filter((lineItem) =>
    lineItem.productId.includes("extra")
  );

  return (
    <>
      <div className="container cartadmin">
        <section className="section item-table">
          <div className="header columns">
            <div className="column">
              <h1 className="title is-size-3">Settlement</h1>
            </div>
            <div className="column is-narrow">
              <button
                id="save"
                className="button is-small has-background-grey-dark has-text-white-ter"
                title="save"
              >
                <span className="icon">
                  <i className="fa fa-save"></i>
                </span>
              </button>
              <ButtonPrint printFunction={printTable} title="Print Table" />
            </div>
          </div>

          <div className="block">
            <div className="columns">
              <div className="column">
                <SelectShops
                  shops={selectableShops}
                  handleChange={selectOpenCartsByShop}
                  customLabel="Open new settlement for"
                />
              </div>

              <div className="column">
                <div className="field ">
                  <label htmlFor="collectiveCart" className="label">
                    Resume work on settlement:
                  </label>
                  <div className="select is-normal">
                    <select
                      name="collectiveCart"
                      onChange={selectCollectiveCart}
                    >
                      <option value="">Select</option>
                      {collectiveCarts &&
                        collectiveCarts.map((cart) => (
                          <option key={cart._id} value={cart._id}>
                            {cart.shop.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="block">
            <div className="table-container">
              {/*  ======================== table START======================== */}
              <table className="table is-narrow settlement">
                {/*  =================== thead START ============================= */}
                <thead>
                  <tr>
                    <th className="item" rowSpan="2">
                      Item
                    </th>
                    <th className="delivered-total" colSpan="2">
                      Delivered Total
                    </th>
                    {carts && carts.length > 0 ? (
                      carts.map((cart) => (
                        <th key={cart._id} className="user" colSpan="3">
                          {cart.user.lastName} {cart.user.firstName}
                        </th>
                      ))
                    ) : (
                      <th className="user" colSpan="3">
                        No Cart
                      </th>
                    )}
                    <th className="remainder" colSpan="2">
                      Remainder
                    </th>
                    <th className="delete-custom"></th>
                  </tr>
                  <tr>
                    <th className="delivered-qty-total">Qty</th>
                    <th className="delivered-price-total">Price</th>
                    {carts && carts.length > 0 ? (
                      carts.map((cart, i) => (
                        <React.Fragment key={i}>
                          <th className="qty-ordered">Ord</th>
                          <th className="qty-delivered">Del</th>
                          <th className="price">Price</th>
                        </React.Fragment>
                      ))
                    ) : (
                      <>
                        <th className="qty-ordered">Ord</th>
                        <th className="qty-delivered">Del</th>
                        <th className="price">Price</th>
                      </>
                    )}

                    <th className="qty-remainder">Qty</th>
                    <th className="money-remainder">€</th>
                    <th className="delete-custom">&nbsp;</th>
                  </tr>
                </thead>
                {/*  =================== thead END============================= */}

                {/*  =================== tbody 1 START ============================= */}
                <tbody id="itemlist">
                  <>
                    {consolidatedLineItems && consolidatedLineItems.length > 0
                      ? consolidatedLineItems.map((lineItem) =>
                          !lineItem.productId.includes("extra") ? (
                            <tr className="item" key={lineItem.productId}>
                              <td className="item-title">
                                {lineItem.productId.includes("custom") ? (
                                  <input
                                    className="input"
                                    type="text"
                                    name="productName"
                                    value={lineItem.productName}
                                    onChange={(event) =>
                                      changeProductName(
                                        event,
                                        lineItem.productId
                                      )
                                    }
                                  />
                                ) : (
                                  lineItem.productName
                                )}
                              </td>
                              <td className="delivered-qty-total">
                                <input
                                  className="input"
                                  type="number"
                                  min="0"
                                  name="qtyDeliveredTotal"
                                  value={lineItem.quantityDeliveredTotal}
                                  onChange={(event) =>
                                    changeQtyDeliveredTotal(
                                      event,
                                      lineItem.productId
                                    )
                                  }
                                />
                              </td>
                              <td className="delivered-price-total">
                                <PriceInputNumber
                                  priceEuros={
                                    lineItem.priceAtDeliveryTotalEuros
                                  }
                                  priceCents={
                                    lineItem.priceAtDeliveryTotalCents
                                  }
                                  handleChange={inputPriceAtDeliveryTotal}
                                  changePrices={changePriceAtDeliveryTotal}
                                  setMessage={setMessage}
                                  openModal={() => setModalIsOpen(true)}
                                  noLabel={true}
                                  id={lineItem.productId}
                                  noBasePrice={true}
                                />
                              </td>
                              {lineItem.orders &&
                                lineItem.orders.map((order, orderIndex) => (
                                  <React.Fragment key={orderIndex}>
                                    <td className="quantity-ordered">
                                      {lineItem.productId.includes("custom") ? (
                                        <input
                                          className="input"
                                          type="number"
                                          name="quantityOrdered"
                                          value={order.quantityOrdered}
                                          onChange={(event) =>
                                            changeQtyOrderedUser(
                                              event,
                                              lineItem.productId,
                                              orderIndex
                                            )
                                          }
                                        />
                                      ) : (
                                        order.quantityOrdered
                                      )}
                                    </td>
                                    <td className="quantity-delivered">
                                      {order.quantityOrdered !== "" && (
                                        <input
                                          className="input"
                                          type="number"
                                          name="quantityDelivered"
                                          min="0"
                                          disabled={
                                            lineItem.quantityDeliveredTotal &&
                                            lineItem.priceAtDeliveryTotal
                                              ? false
                                              : true
                                          }
                                          value={order.quantityDelivered}
                                          onChange={(event) =>
                                            changeQtyDeliveredUser(
                                              event,
                                              lineItem.productId,
                                              orderIndex
                                            )
                                          }
                                        />
                                      )}
                                    </td>
                                    <td className="price">
                                      {order.priceAtDelivery &&
                                        priceDisplay(
                                          order.priceAtDelivery,
                                          "€"
                                        )}
                                    </td>
                                  </React.Fragment>
                                ))}
                              <td className="qty-remainder">
                                {lineItem.quantityRemainder}
                              </td>
                              <td className="money-remainder">
                                {lineItem.moneyRemainder &&
                                  priceDisplay(lineItem.moneyRemainder, "€")}
                              </td>
                              <td className="delete-custom">
                                {lineItem.productId.includes("custom") && (
                                  <ButtonDelete
                                    deleteFunction={deleteCustomLineItem}
                                    id={lineItem.productId}
                                    title="Delete custom line item"
                                  />
                                )}
                              </td>
                            </tr>
                          ) : null
                        )
                      : null}
                  </>
                  <tr className="table-buttons">
                    <td colSpan="12">
                      <button
                        id="add-lineitem"
                        className="button is-small has-text-weight-bold has-text-grey-dark"
                        onClick={(event) => addCustomLineItem(event, "custom")}
                      >
                        Add custom line item
                      </button>
                    </td>
                  </tr>
                </tbody>
                {/*  =================== tbody 1 END ============================= */}

                {/*  =================== tbody 2 START ============================= */}
                <tbody id="subtotals">
                  <tr className="has-text-weight-bold">
                    <td className="item">Subtotal</td>
                    <td className="delivered">&nbsp;</td>
                    <td className="delivered-price-total">
                      {totalsSubtotal > 0 && priceDisplay(totalsSubtotal, "€")}
                    </td>
                    {carts &&
                      carts.map((cart, index) => (
                        <React.Fragment key={cart._id}>
                          <td colSpan="2"></td>
                          <td className="price-subtotal-user">
                            {subtotals &&
                              subtotals[index] > 0 &&
                              priceDisplay(subtotals[index], "€")}
                          </td>
                        </React.Fragment>
                      ))}
                    <td>&nbsp;</td>
                    <td className="remainder-money">&nbsp;</td>
                    <td>&nbsp;</td>
                  </tr>
                </tbody>
                {/*  =================== tbody 2 END ============================= */}

                {/*  =================== tbody 3 START ============================= */}
                <tbody id="extras">
                  <>
                    {extraLineItems && extraLineItems.length > 0
                      ? extraLineItems.map((lineItem) => (
                          <tr key={lineItem.productId} className="item">
                            <td className="item-title">
                              <input
                                className="input"
                                type="text"
                                name="productName"
                                value={lineItem.productName}
                                onChange={(event) =>
                                  changeProductName(event, lineItem.productId)
                                }
                              />
                            </td>
                            <td className="delivered-qty-total">
                              <input
                                className="input"
                                type="number"
                                name="qtyDeliveredTotal"
                                value={lineItem.quantityDeliveredTotal}
                                onChange={(event) =>
                                  changeQtyDeliveredTotal(
                                    event,
                                    lineItem.productId
                                  )
                                }
                              />
                            </td>
                            <td className="delivered-price-total">
                              <PriceInputNumber
                                priceEuros={lineItem.priceAtDeliveryTotalEuros}
                                priceCents={lineItem.priceAtDeliveryTotalCents}
                                handleChange={inputPriceAtDeliveryTotal}
                                changePrices={changePriceAtDeliveryTotal}
                                setMessage={setMessage}
                                openModal={() => setModalIsOpen(true)}
                                noLabel={true}
                                id={lineItem.productId}
                                noBasePrice={true}
                              />
                            </td>
                            {lineItem.orders.map((order, orderIndex) => (
                              <React.Fragment key={orderIndex}>
                                <td className="quantity-ordered">
                                  {/* <input
                                  className="input"
                                  type="number"
                                  name="quantityOrdered"
                                  value={order.quantityOrdered}
                                  onChange={(event) =>
                                    changeQtyOrderedUser(
                                      event,
                                      lineItem.productId,
                                      orderIndex
                                    )
                                  }
                                /> */}
                                </td>
                                <td className="quantity-delivered">
                                  <input
                                    className="input"
                                    type="number"
                                    name="quantityDelivered"
                                    value={order.quantityDelivered}
                                    onChange={(event) =>
                                      changeQtyDeliveredUser(
                                        event,
                                        lineItem.productId,
                                        orderIndex
                                      )
                                    }
                                  />
                                </td>
                                <td className="price">
                                  {order.priceAtDelivery}
                                </td>
                              </React.Fragment>
                            ))}
                            <td className="qty-remainder">
                              {lineItem.quantityRemainder}
                            </td>
                            <td className="money-remainder">
                              {lineItem.moneyRemainder}
                            </td>
                            <td className="delete-custom">
                              {lineItem.productId.includes("extra") && (
                                <ButtonDelete
                                  deleteFunction={deleteCustomLineItem}
                                  id={lineItem.productId}
                                  title="Delete custom line item"
                                />
                              )}
                            </td>
                          </tr>
                        ))
                      : null}
                  </>
                  <tr className="table-buttons">
                    <td colSpan="12">
                      <button
                        id="add-extra"
                        className="button is-small has-text-weight-bold has-text-grey-dark"
                        onClick={(event) => addCustomLineItem(event, "extra")}
                      >
                        Add extra position (e.g. fee, payback)
                      </button>
                    </td>
                  </tr>
                </tbody>
                {/*  =================== tbody 3 END ============================= */}

                {/*  =================== tbody 4 START ============================= */}
                <tbody id="totals">
                  <tr className="has-text-weight-bold">
                    <td className="item">Total</td>
                    <td className="delivered">&nbsp;</td>
                    <td className="delivered-price-total">
                      {totalsTotal &&
                        totalsTotal > 0 &&
                        priceDisplay(totalsTotal, "€")}
                    </td>
                    {carts &&
                      carts.map((cart, index) => (
                        <React.Fragment key={cart._id}>
                          <td colSpan="2"></td>
                          <td className="price-total-user">
                            {totals &&
                              totals[index] > 0 &&
                              priceDisplay(totals[index], "€")}
                          </td>
                        </React.Fragment>
                      ))}
                    <td>&nbsp;</td>
                    <td className="remainder-money"></td>
                    <td>&nbsp;</td>
                  </tr>
                </tbody>
                {/*  =================== tbody 4 END ============================= */}
              </table>
              {/*  =================== table END ============================= */}
            </div>
            <div className="buttons">
              <button
                id="save"
                className="button has-background-grey-dark has-text-white"
                onClick={save}
              >
                Save
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Settlements;

export async function getServerSideProps(context) {
  // to fill up shop-cart selection:
  const shops = await getItems("shops");
  // to fill up collectiveCart selection:
  const openCollectiveCarts = await getFilteredCollectiveCarts("", "", 24, 1);
  return {
    props: { shops, openCollectiveCarts },
  };
}
