import React, { useState } from "react";
import Message from "../../components/Message";
import { addItem } from "../axiosCalls/apiPostSingleItem";
import { createMachineName } from "../../utils/createMachineName";

function ShopAdd() {
  // local states
  const [shopData, setShopData] = useState({
    name: "",
    machineName: "",
  });
  const [message, setMessage] = useState();
  const [error, setError] = useState();

  const handleChange = (event) => {
    if (event.target.name === "name") {
      setShopData({
        ...shopData,
        name: event.target.value,
        machineName: createMachineName(event.target.value),
      });
    } else {
      setShopData({
        ...shopData,
        [event.target.name]: event.target.value,
      });
    }
  };
  console.log("shopData", shopData);

  const addShop = async (event) => {
    event.preventDefault();
    await addItem("shops", shopData)
      .then((response) => {
        setMessage({
          message: response.message,
          status: response.status,
        });
      })
      .catch((error) => setError(error));

    setShopData({ name: "", machineName: "" });
  };

  return (
    <>
      <div className="container addsingle">
        <section className="section ">
          <h2 className="title is-size-4">Add Shop</h2>
          {message && (
            <Message message={message.message} status={message.status} />
          )}

          <form onSubmit={addShop}>
            <div className="block">
              <div className="columns">
                <div className="field column">
                  <label htmlFor="name" className="label">
                    Name
                  </label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      name="name"
                      id="name"
                      value={shopData.name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="field column">
                  <label htmlFor="machine-name" className="label">
                    Machine Name
                  </label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      name="machineName"
                      id="machine-name"
                      value={shopData.machineName}
                      onChange={handleChange}
                    />
                  </div>
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

export default ShopAdd;
