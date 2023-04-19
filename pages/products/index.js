import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMinus,
  faPlus,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import ButtonEdit from "../../components/ButtonEdit";
import ButtonDelete from "../../components/ButtonDelete";
import SelectUsers from "../../components/SelectUsers";
import {
  getItems,
  getFilteredProducts,
} from "../axiosCalls/apiGetMultipleItems";
import { deleteItem } from "../axiosCalls/apiDeleteItem";
import SelectTags from "../../components/SelectTags";
import SelectShops from "../../components/SelectShops";
import SelectResultsPerPage from "../../components/SelectResultsPerPage";
import PaginationButtons from "../../components/PaginationButtons";
import Message from "../../components/Message";
import Spinner from "../../components/Spinner";
import getLocalStorage from "../../utils/getLocalStorage";
import saveToLocalStorage from "../../utils/saveToLocalStorage";
import { priceDisplay } from "../../utils/priceDisplay";
import initializeLocalStorage from "../../utils/initializeLocalStorage";

// TODO: filter by role
// admin role: edit and delete buttons
// user role view all: all products
// user role view restricted selection: their approved product selection

function ProductsList({ tags, shops, users, filteredProducts }) {
  console.log("filteredProducts", filteredProducts);

  const { data: session, status } = useSession();

  // local states
  const [products, setProducts] = useState([]);
  const [selectableTags, setSelectableTags] = useState([]);
  const [selectableShops, setSelectableShops] = useState([]);
  const [selectableUsers, setSelectableUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [cart, setCart] = useState([]);
  const [productsJustLoaded, setProductsJustLoaded] = useState(false);
  const [localStorageOwner, setLocalStorageOwner] = useState({});
  const [localStorageChanged, setLocalStorageChanged] = useState(false);
  const [
    savedToLocalStorageFromProductsPage,
    setSavedToLocalStorageFromProductsPage,
  ] = useState(false);
  const [filterTag, setFilterTag] = useState("");
  const [filterShop, setFilterShop] = useState("");
  const [resultsPerPage, setResultsPerPage] = useState("24");
  const [isLoading, setLoading] = useState(true);
  const [numberOfPages, setNumberOfPages] = useState("1");
  const [currentPage, setCurrentPage] = useState("1");
  const [targetPage, setTargetPage] = useState("1");
  const [message, setMessage] = useState();
  const [error, setError] = useState();

  const addCartQuantitiesToProducts = (cart, products) => {
    if (cart) {
      let alteredProducts = products.map((product) => {
        let matchingItem = cart.find(
          (cartItem) => cartItem.productId === product._id
        );
        if (matchingItem) {
          product.quantityInCart = matchingItem.quantityOrdered;
        } else {
          product.quantityInCart = 0;
        }
        return product;
      });
      return alteredProducts;
    }
  };

  useEffect(() => {
    setSelectableTags(tags);
    setSelectableShops(shops);
    setSelectableUsers(users);
    setCart(initializeLocalStorage());
    setProducts(filteredProducts[0]);
    setCurrentPage(filteredProducts[1]);
    setNumberOfPages(filteredProducts[2]);
    setProductsJustLoaded(true);
    setLoading(false);
  }, []);

  useEffect(() => {
    let storageOwner = getLocalStorage("WeShopOpenCart").storageOwner;
    if (session) {
      (!storageOwner._id || storageOwner === session.user) &&
        setSelectedUser(session.user);
    }
  }, [session]);

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
    if (!savedToLocalStorageFromProductsPage) {
      let transientCart = getLocalStorage("WeShopOpenCart").stored;
      let productsWithMatchingQuantities = addCartQuantitiesToProducts(
        transientCart,
        products
      );
      setProducts(productsWithMatchingQuantities);
      setCart(transientCart);
    }
    if (savedToLocalStorageFromProductsPage) {
      setSavedToLocalStorageFromProductsPage(false);
    }
    setLocalStorageChanged(false);
  }, [localStorageChanged]);

  useEffect(() => {
    getFilteredProducts(filterTag, filterShop, resultsPerPage, targetPage)
      .then((returnedData) => {
        setProducts(returnedData[0]);
        setCurrentPage(returnedData[1]);
        setNumberOfPages(returnedData[2]);
        setProductsJustLoaded(true);
      })
      .catch((error) => setError(error.response));
  }, [filterTag, filterShop, resultsPerPage, targetPage]);

  useEffect(() => {
    if (productsJustLoaded) {
      let productsWithMatchingQuantities = addCartQuantitiesToProducts(
        cart,
        products
      );
      setProducts(productsWithMatchingQuantities);
      setProductsJustLoaded(false);
    }
  }, [productsJustLoaded, cart, products]);

  useEffect(() => {
    setSavedToLocalStorageFromProductsPage(true);
    saveToLocalStorage(cart, selectedUser);
  }, [cart, selectedUser]);

  if (isLoading) {
    return <Spinner />;
  }

  // filter settings

  const handleResultsPerPage = (event) => {
    setResultsPerPage(event.target.value);
    setTargetPage("1");
  };
  const handleShopFilter = (event) => {
    setFilterShop(event.target.value !== "all" ? event.target.value : "");
    setTargetPage("1");
  };
  const handleTagFilter = (event) => {
    setFilterTag(event.target.value !== "all" ? event.target.value : "");
    setTargetPage("1");
  };
  const handleTargetPage = (event, targetPage) => {
    setTargetPage(targetPage);
  };

  // user to attribute cart to

  const selectUser = (event) => {
    const userSelected = users.find((user) => user._id === event.target.value);
    setSelectedUser(userSelected);
  };

  // cart operations

  const addProductToCart = (productId) => {
    let productToAdd = products.find((product) => product._id === productId);
    let productToCart = {
      productId: productToAdd._id,
      productName: productToAdd.title,
      quantityOrdered: 1,
      priceAtOrder: productToAdd.price,
      status: 0,
      shop: {
        _id: productToAdd.shop._id,
        name: productToAdd.shop.name,
      },
    };
    return productToCart;
  };

  const increaseQuantity = (productId) => {
    const prs = products.map((product) => {
      product.quantityInCart =
        product._id === productId
          ? product.quantityInCart + 1
          : product.quantityInCart;
      return product;
    });
    setProducts(prs);

    if (cart.find((lineItem) => lineItem.productId === productId)) {
      const crt = cart.map((lineItem) => {
        lineItem.quantityOrdered =
          lineItem.productId === productId
            ? lineItem.quantityOrdered + 1
            : lineItem.quantityOrdered;
        return lineItem;
      });
      setCart(crt);
    } else {
      setCart([...cart, addProductToCart(productId)]);
    }
  };

  const decreaseQuantity = (productId) => {
    const prs = products.map((product) => {
      product.quantityInCart =
        product._id === productId
          ? product.quantityInCart - 1
          : product.quantityInCart;
      return product;
    });
    setProducts(prs);

    const crt = cart.map((lineItem) => {
      lineItem.quantityOrdered =
        lineItem.productId === productId
          ? lineItem.quantityOrdered - 1
          : lineItem.quantityOrdered;
      return lineItem;
    });
    const positiveLineItems = crt.filter(
      (lineItem) => lineItem.quantityOrdered > 0
    );
    setCart(positiveLineItems);
  };

  const inputQuantityAsValue = (event, productId) => {
    const prs = products.map((product) => {
      if (product._id === productId && Number(event.target.value) > 0) {
        product.quantityInCart = Number(event.target.value);
      }
      return product;
    });
    setProducts(prs);

    const crt = cart.map((lineItem) => {
      if (lineItem.productId === productId && Number(event.target.value) > 0) {
        lineItem.quantityOrdered = Number(event.target.value);
      }
      return lineItem;
    });
    // let positiveLineItems = crt.filter(
    //   (lineItem) => lineItem.quantityOrdered > 0
    // );
    setCart(crt);
  };

  const deleteProduct = (event, pid) => {
    deleteItem("products", pid)
      .then((response) => {
        let updatedProducts = products.filter(
          (product) => product._id !== response.data
        );
        setProducts(updatedProducts);
      })
      .catch((error) => setError(error));
  };

  // display

  const selectedShop =
    filterShop === ""
      ? "All Shops"
      : selectableShops.find((shop) => filterShop === shop._id).name;

  const selectedProductType =
    filterTag === ""
      ? "All Products"
      : selectableTags.find((tag) => filterTag === tag._id).name;

  return (
    <>
      <div className="container productsadmin">
        <section className="section products">
          <div className="columns is-multiline">
            <div className="column header">
              <h2 className="title title-with-subtitle is-size-5">
                {selectedShop}
              </h2>
              <h1 className="title is-size-3">{selectedProductType}</h1>
            </div>
            <div className="column is-narrow">
              <SelectUsers
                users={selectableUsers}
                label={`Fill Cart for:`}
                handleChange={selectUser}
                selectedUser={selectedUser}
              />
            </div>
          </div>
          {message && (
            <Message message={message.message} status={message.status} />
          )}
          <section className="filter">
            <div className="filters columns is-multiline is-mobile">
              <div className="column is-narrow">
                {selectableShops && (
                  <SelectShops
                    shops={selectableShops}
                    handleChange={handleShopFilter}
                    selectedShop={filterShop}
                  />
                )}
              </div>

              <div className="column is-narrow">
                {selectableTags && (
                  <SelectTags
                    tags={selectableTags}
                    handleChange={handleTagFilter}
                    selectedTag={filterTag}
                  />
                )}
              </div>

              <div className="column is-narrow">
                <SelectResultsPerPage
                  handleChange={handleResultsPerPage}
                  resultsPerPage={resultsPerPage}
                  options={[2, 4, 24, 48, 72]}
                />
              </div>
            </div>
          </section>

          <div className="block">
            <div className="columns is-multiline is-mobile is-centered">
              {products &&
                products.map((product) => (
                  <div key={product._id} className="column is-narrow">
                    <div className="card">
                      <div className="card-content">
                        <div className="card-image">
                          <figure
                            className="image is-square"
                            style={{
                              background: `url(${product.imgUrl}) center center no-repeat`,
                              backgroundSize: "cover",
                              width: "220px",
                            }}
                          ></figure>
                        </div>

                        <p className=" price is-size-5">
                          <strong className="has-text-grey-dark">
                            {priceDisplay(product.price, "€")}
                          </strong>
                        </p>
                        <p className="product-title is-size-6">
                          <a
                            href={`${product.url}`}
                            className="has-text-grey-dark"
                          >
                            <strong>{product.title}</strong>
                          </a>
                        </p>
                        <p className="product-title-ext">{product.titleExt}</p>
                        <p className="baseprice is-size-7">
                          {priceDisplay(product.basePrice, "€")}
                          {product.basePriceUnit &&
                            ` / ${product.basePriceUnit}`}
                        </p>
                        <div className="tags">
                          {product.tag && (
                            <span className="tag is-white is-normal">
                              {product.tag.name}
                            </span>
                          )}
                          {product.shop && (
                            <span className="tag is-white is-normal">
                              {product.shop.name}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="is-flex is-justify-content-space-between">
                        <div className="buttons">
                          <ButtonEdit
                            path={`/products/${product._id}`}
                            title={"Edit Product"}
                          />

                          <ButtonDelete
                            deleteFunction={deleteProduct}
                            id={product._id}
                            title={"Delete Product"}
                          />
                        </div>

                        <div
                          className={`field is-grouped ${
                            product.quantityInCart === 0 && "add-cart-zero"
                          } `}
                        >
                          <button
                            className="button is-normal has-text-white has-background-darkgreen amount-minus"
                            onClick={(event) => decreaseQuantity(product._id)}
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
                            value={product.quantityInCart}
                            min="0"
                            className="amount-input"
                            onChange={(event) =>
                              inputQuantityAsValue(event, product._id)
                            }
                          />
                          <button
                            className={`button is-normal has-text-white ${
                              product.quantityInCart === 0
                                ? "has-background-green"
                                : "has-background-darkgreen"
                            } amount-plus`}
                            onClick={(event) => increaseQuantity(product._id)}
                          >
                            {product.quantityInCart === 0 && (
                              <span className="icon is-medium">
                                <FontAwesomeIcon
                                  icon={faShoppingCart}
                                  style={{ fontSize: 16 }}
                                />
                              </span>
                            )}
                            <span className="icon is-medium">
                              <FontAwesomeIcon
                                icon={faPlus}
                                style={{ fontSize: 16 }}
                              />
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              <div className="column is-narrow filler">
                <div className="card"></div>
              </div>
              <div className="column is-narrow filler">
                <div className="card"></div>
              </div>
              <div className="column is-narrow filler">
                <div className="card"></div>
              </div>
            </div>
          </div>
          <div className="pagination">
            <PaginationButtons
              numberOfPages={numberOfPages}
              currentPage={currentPage}
              paginate={handleTargetPage}
            />
          </div>
        </section>
      </div>
    </>
  );
}

export default ProductsList;

export async function getServerSideProps(context) {
  const tags = await getItems("tags");
  const shops = await getItems("shops");
  const users = await getItems("users");
  const filteredProducts = await getFilteredProducts("", "", 24, 1);
  return {
    props: { tags, shops, users, filteredProducts },
  };
}
