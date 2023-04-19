import React, { useState, useEffect } from "react";
import { getItems } from "../axiosCalls/apiGetMultipleItems";
import { deleteItem } from "../axiosCalls/apiDeleteItem";
import Table from "../../components/Table";
import ButtonEdit from "../../components/ButtonEdit";
import ButtonDelete from "../../components/ButtonDelete";
import ButtonLink from "../../components/ButtonLink";
import Spinner from "../../components/Spinner";

function ShopsList({ shops }) {
  // local states
  const [displayedShops, setDisplayedShops] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [message, setMessage] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    setDisplayedShops(shops);
    setLoading(false);
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  const deleteShop = (id) => {
    deleteItem("shops", id)
      .then((response) => {
        let updatedShops = displayedShops.filter(
          (shop) => shop._id !== response.data
        );
        setDisplayedShops(updatedShops);
      })
      .catch((error) => setError(error));
  };

  return (
    <>
      <div className="container itemslist">
        <section className="section">
          <h2 className="title is-size-4">Shops</h2>
          <div className="table-container">
            <Table
              headings={[
                ["Name", 1],
                ["Machine Name", 1],
                ["Edit", 1],
                ["Delete", 1],
              ]}
              items={displayedShops}
              rows={displayedShops.map((shop) => [
                [
                  shop.name,
                  shop.machineName,
                  <ButtonEdit
                    path={`/shops/${shop._id}`}
                    title={"Edit Shop"}
                  />,
                  <ButtonDelete
                    deleteFunction={deleteShop}
                    id={shop._id}
                    title={"Delete Shop"}
                  />,
                ],
                [shop._id],
              ])}
              emptyMessage={"No Shops listed."}
            />
          </div>
          <div className="field block">
            <ButtonLink path={"/shops/add"} name={"Add Shop"} />
          </div>
        </section>
      </div>
    </>
  );
}

export default ShopsList;

export async function getServerSideProps(context) {
  const shops = await getItems("shops");

  return {
    props: { shops },
  };
}
