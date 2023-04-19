import React from "react";

function PriceInputNumber({
  priceEuros,
  priceCents,
  basePriceEuros,
  basePriceCents,
  handleChange,
  changePrices,
  noLabel,
  noBasePrice,
  id,
}) {
  const handleBlur = (event, type, id) => {
    let value = "";
    switch (type) {
      case "priceEuros":
        value = priceEuros;
        break;
      case "priceCents":
        value = priceCents;
        break;
      case "basePriceEuros":
        value = basePriceEuros;
        break;
      case "basePriceCents":
        value = basePriceCents;
        break;
    }

    let newValue = "";

    if (type === "priceEuros" || type === "basePriceEuros") {
      newValue = value;
    }

    // make sure cents have 2 digits
    if (type === "priceCents" || type === "basePriceCents") {
      if (value === "") {
        newValue = "00";
      } else if (value && value.length === 1) {
        newValue = "0" + value;
      } else if (value && value.length === 2) {
        newValue = value;
      } else if (value && value.length > 2) {
        newValue = value[0] + value[1];
      }
    }
    changePrices(type, newValue, id);
  };

  return (
    <>
      <div className="column">
        <div className="grouped field">
          {noLabel === false ? (
            <label htmlFor="price" className="label">
              Price
            </label>
          ) : null}
          <div className="is-horizontal is-flex">
            <div className="control mr-1">
              <input
                className="input priceEuros"
                type="number"
                name="priceEuros"
                size="5"
                placeholder="EUR"
                value={priceEuros || ""}
                onChange={(event) => handleChange(event, id)}
                onBlur={(event) => handleBlur(event, "priceEuros", id)}
              />
            </div>
            <div className="control">
              <input
                className="input priceCents"
                type="number"
                name="priceCents"
                maxLength="2"
                max="99"
                placeholder="Ct"
                value={priceCents || ""}
                onChange={(event) => handleChange(event, id)}
                onBlur={(event) => handleBlur(event, "priceCents", id)}
              />
            </div>
          </div>
        </div>
      </div>
      {noBasePrice === false ? (
        <div className="column">
          <div className="grouped field">
            {noLabel === false ? (
              <label htmlFor="basePrice" className="label">
                Base Price
              </label>
            ) : null}
            <div className="is-horizontal is-flex">
              <div className="control mr-1">
                <input
                  className="input basePriceEuros"
                  type="number"
                  name="basePriceEuros"
                  size="5"
                  placeholder="EUR"
                  value={basePriceEuros || ""}
                  onChange={(event) => handleChange(event, id)}
                  onBlur={(event) => handleBlur(event, "basePriceEuros", id)}
                />
              </div>
              <div className="control">
                <input
                  className="input basePriceCents"
                  type="number"
                  name="basePriceCents"
                  maxLength="2"
                  max="99"
                  placeholder="Ct"
                  value={basePriceCents || ""}
                  onChange={(event) => handleChange(event, id)}
                  onBlur={(event) => handleBlur(event, "basePriceCents", id)}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default PriceInputNumber;
