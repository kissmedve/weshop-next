import React, { useState, useEffect } from "react";
import { getSingleItem } from "../axiosCalls/apiGetSingleItem";
import { updateSingleItem } from "../axiosCalls/apiPutSingleItem";
import Message from "../../components/Message";

function ShopEdit({ shop }) {
  // local states
  const [shopData, setShopData] = useState();
  const [message, setMessage] = useState();
  const [error, setError] = useState();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setShopData(shop);
    setLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  const handleChange = (event) => {
    setShopData({
      ...shopData,
      [event.target.name]: event.target.value,
    });
  };

  const editShop = (event) => {
    event.preventDefault();
    updateSingleItem("shops", shopData._id, shopData).then((response) => {
      setMessage({
        message: response.message,
        status: response.status,
      });
      setShopData(response.data);
    });
  };

  return (
    <>
      <div className="container editsingle">
        <section className="section ">
          <h2 className="title is-size-4">Edit Shop</h2>
          {message && (
            <Message message={message.message} status={message.status} />
          )}

          <form onSubmit={editShop}>
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

export default ShopEdit;

export async function getServerSideProps(context) {
  const shid = context.params.shid;
  const shop = await getSingleItem("shops", shid);
  return {
    props: { shop },
  };
}
