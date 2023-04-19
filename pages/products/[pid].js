import React, { useState, useEffect } from "react";
import { getSingleItem } from "../axiosCalls/apiGetSingleItem";
import { getItems } from "../axiosCalls/apiGetMultipleItems";
import { updateSingleItem } from "../axiosCalls/apiPutSingleItem";
import SelectTags from "../../components/SelectTags";
import SelectShops from "../../components/SelectShops";
import SelectGeneric from "../../components/SelectGeneric";
import PriceInputNumber from "../../components/PriceInputNumber";
import { splitDecimals } from "../../utils/splitDecimals";
import { priceInCents } from "../../utils/priceInCents";
import { priceDisplay } from "../../utils/priceDisplay";
import Message from "../../components/Message";

function ProductEdit({ product, tags, shops }) {
  // local states
  const [productData, setProductData] = useState();
  //   {
  //   url: "",
  //   title: "",
  //   titleExt: "",
  //   imgUrl: "",
  //   basePriceEuros: "",
  //   basePriceCents: "",
  //   basePriceUnit: "",
  //   priceEuros: "",
  //   priceCents: "",
  //   shop: "",
  //   tag: "",
  // }
  const [selectableTags, setSelectableTags] = useState([]);
  const [selectableShops, setSelectableShops] = useState([]);
  const [message, setMessage] = useState();
  const [error, setError] = useState();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setSelectableTags(tags);
    setSelectableShops(shops);
    setProductData({
      ...product,
      basePriceEuros:
        product.basePrice && product.basePrice !== "0"
          ? splitDecimals(product.basePrice, 2)[0]
          : "",
      basePriceCents:
        product.basePrice && product.basePrice !== "0"
          ? splitDecimals(product.basePrice, 2)[1]
          : "",
      priceEuros:
        product.price && product.price !== "0"
          ? splitDecimals(product.price, 2)[0]
          : "",
      priceCents:
        product.price && product.price !== "0"
          ? splitDecimals(product.price, 2)[1]
          : "",
    });
    setLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading ...</div>;
  }

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

  const editProduct = (event) => {
    event.preventDefault();

    let updatedProductData = {
      ...productData,
      price: priceInCents(productData.priceEuros, productData.priceCents),
      basePrice: priceInCents(
        productData.basePriceEuros,
        productData.basePriceCents
      ),
      quantityInCart: 0,
    };
    console.log("updatedProductData", updatedProductData);
    updateSingleItem("products", productData._id, updatedProductData)
      .then((response) => {
        setMessage({
          message: response.message,
          status: response.status,
        });
        setTagData(response.data);
      })
      .catch((error) => setError(error));
  };

  return (
    <>
      <div className="container editsingle">
        <section className="section ">
          <h1 className="title is-size-3">Edit Product</h1>
          {message && (
            <Message message={message.message} status={message.status} />
          )}

          <form onSubmit={editProduct}>
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
                      value={productData.title}
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
                      value={productData.titleExt}
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
                    selectionName={"basePriceUnit"}
                    handleChange={handleChange}
                    selectedOption={productData.basePriceUnit}
                    withSelect={true}
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="imgUrl" className="label">
                  Image URL
                  <span className="desc">(if available)</span>
                </label>
                <div className="control">
                  <input
                    className="input"
                    type="url"
                    name="imgUrl"
                    id="imgUrl"
                    value={productData.imgUrl}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="columns">
                <div className="column is-narrow">
                  {selectableShops && (
                    <SelectShops
                      shops={selectableShops}
                      handleChange={handleChange}
                      selectedShop={productData.shop._id}
                    />
                  )}
                </div>
                <div className="column is-narrow">
                  {selectableTags && (
                    <SelectTags
                      tags={selectableTags}
                      handleChange={handleChange}
                      productTag={productData.tag ? productData.tag._id : ""}
                    />
                  )}
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

export default ProductEdit;

export async function getServerSideProps(context) {
  const pid = context.params.pid;
  const product = await getSingleItem("products", pid);
  const tags = await getItems("tags");
  const shops = await getItems("shops");
  return {
    props: { product, tags, shops },
  };
}
