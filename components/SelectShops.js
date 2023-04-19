import React from "react";

function SelectShops({ shops, handleChange, selectedShop, customLabel }) {
  return (
    <>
      <div className="field">
        <label htmlFor="shop" className="label">
          {customLabel ? customLabel : "Shop"}
        </label>
        <div className="select is-normal">
          <select name="shop" value={selectedShop} onChange={handleChange}>
            <option value="all">All</option>
            {shops.map((shop) => (
              <option key={shop._id} value={shop._id}>
                {shop.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}

export default SelectShops;
