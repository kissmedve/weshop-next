import React, { useState, useEffect } from "react";
import SelectTags from "../../components/SelectTags";
import SelectShops from "../../components/SelectShops";
import SelectGeneric from "../../components/SelectGeneric";
import PriceInputNumber from "../../components/PriceInputNumber";
import { priceInCents } from "../../utils/priceInCents";
import { getItems } from "../axiosCalls/apiGetMultipleItems";
import { addItem } from "../axiosCalls/apiPostSingleItem";
import Message from "../../components/Message";
import { createMachineName } from "../../utils/createMachineName";

function ProductAdd({ tags, shops }) {
  // local states
  const [productData, setProductData] = useState({
    // url: "",
    // title: "",
    // titleExt: "",
    // imgUrl: "",
    // basePriceEuros: "",
    // basePriceCents: "",
    // basePriceUnit: "",
    // priceEuros: "",
    // priceCents: "",
    // shop: "",
    // tag: "",
  });
  const [selectableTags, setSelectableTags] = useState([]);
  const [selectableShops, setSelectableShops] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [message, setMessage] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    setSelectableTags(tags);
    setSelectableShops(shops);
    setLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  const handleChange = (event) => {
    setProductData({
      ...productData,
      [event.target.name]: event.target.value,
    });
  };

  const changePrices = (type, value) => {
    setProductData({
      ...productData,
      [type]: value,
    });
  };

  const addProduct = async (event) => {
    event.preventDefault();
    console.log("productData", productData);
    const newProduct = {
      url: productData.url || "",
      title: productData.title || "",
      titleExt: productData.titleExt || "",
      imgUrl: productData.imgUrl || "",
      basePrice: priceInCents(
        productData.basePriceEuros,
        productData.basePriceCents
      ),
      price: priceInCents(productData.priceEuros, productData.priceCents),
      basePriceUnit: productData.basePriceUnit || "",
      shop: productData.shop || "",
      tag: productData.tag || "",
      quantityInCart: 0,
    };

    await addItem("products", newProduct)
      .then((response) => {
        setMessage({
          message: response.message,
          status: response.status,
        });
      })
      .catch((error) => setError(error));

    setProductData({
      // url: "",
      // title: "",
      // titleExt: "",
      // imgUrl: "",
      // basePriceEuros: "",
      // basePriceCents: "",
      // basePriceUnit: "",
      // priceEuros: "",
      // priceCents: "",
      // shop: "",
      // tag: "",
    });
  };

  return (
    <>
      <div className="container addsingle">
        <section className="section ">
          <h1 className="title is-size-3">Add Product</h1>

          {message && (
            <Message message={message.message} status={message.status} />
          )}
          <form onSubmit={addProduct}>
            <div className="block">
              <div className="columns">
                <div className="field column">
                  <label htmlFor="title" className="label">
                    Title
                  </label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      name="title"
                      id="title"
                      value={productData.title || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="field column">
                  <label htmlFor="titleExt" className="label">
                    Title addition
                  </label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      name="titleExt"
                      id="titleExt"
                      value={productData.titleExt || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="columns">
                <PriceInputNumber
                  priceEuros={productData.priceEuros}
                  priceCents={productData.priceCents}
                  basePriceEuros={productData.basePriceEuros}
                  basePriceCents={productData.basePriceCents}
                  handleChange={handleChange}
                  changePrices={changePrices}
                  noLabel={false}
                  noBasePrice={false}
                />
              </div>
              <div className="columns">
                <div className="column is-narrow">
                  <SelectGeneric
                    optionsArray={["100g", "1000g", "piece"]}
                    arrayName={"Base Price Unit"}
                    selectionName="basePriceUnit"
                    handleChange={handleChange}
                    selectedOption={productData.basePriceUnit || ""}
                    withSelect={true}
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="imgUrl" className="label">
                  Image URL
                </label>
                <p className="desc">(e.g. from file server)</p>
                <div className="control">
                  <input
                    className="input"
                    type="url"
                    name="imgUrl"
                    id="imgUrl"
                    value={productData.imgUrl || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="columns">
                <div className="column is-narrow">
                  {
                    <SelectShops
                      shops={selectableShops}
                      handleChange={handleChange}
                      selectedShop={productData.shop || ""}
                    />
                  }
                </div>
                <div className="column is-narrow">
                  {
                    <SelectTags
                      tags={selectableTags}
                      handleChange={handleChange}
                      productTag={productData.tag || ""}
                    />
                  }
                </div>
              </div>
            </div>

            <div className="field block">
              <div className="control">
                <input
                  className="button is-normal has-background-grey-dark has-text-white"
                  type="submit"
                  value="Save"
                />
              </div>
            </div>
          </form>
        </section>
      </div>
    </>
  );
}

export default ProductAdd;

export async function getServerSideProps(context) {
  const tags = await getItems("tags");
  const shops = await getItems("shops");

  return {
    props: { tags, shops },
  };
}
