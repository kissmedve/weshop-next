import React, { useState, useEffect } from "react";
import {
  getItems,
  getFilteredCollectiveCarts,
} from "../axiosCalls/apiGetMultipleItems";
import { deleteItem } from "../axiosCalls/apiDeleteItem";
import { updateSingleItem } from "../axiosCalls/apiPutSingleItem";
import Table from "../../components/Table";
import ButtonEdit from "../../components/ButtonEdit";
import ButtonDelete from "../../components/ButtonDelete";
import SelectShops from "../../components/SelectShops";
import SelectStatus from "../../components/SelectStatus";
import SelectResultsPerPage from "../../components/SelectResultsPerPage";
import PaginationButtons from "../../components/PaginationButtons";
import Message from "../../components/Message";
import Spinner from "../../components/Spinner";

function CollectiveCartsList({ shops, filteredCollectiveCarts }) {
  // local states
  const [selectableShops, setSelectableShops] = useState([]);
  const [collectiveCarts, setCollectiveCarts] = useState([]);

  const [currentPage, setCurrentPage] = useState("1");
  const [numberOfPages, setNumberOfPages] = useState("1");

  const [filterShop, setFilterShop] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [resultsPerPage, setResultsPerPage] = useState("24");
  const [targetPage, setTargetPage] = useState("1");
  const [message, setMessage] = useState();
  const [error, setError] = useState();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setSelectableShops(shops);
    setCollectiveCarts(filteredCollectiveCarts[0]);
    setCurrentPage(filteredCollectiveCarts[1]);
    setNumberOfPages(filteredCollectiveCarts[2]);
    setLoading(false);
  }, []);

  useEffect(() => {
    getFilteredCollectiveCarts(
      filterShop,
      filterStatus,
      resultsPerPage,
      targetPage
    )
      .then((returnedData) => {
        setCollectiveCarts(returnedData[0]);
        setCurrentPage(returnedData[1]);
        setNumberOfPages(returnedData[2]);
      })
      .catch((error) => setError(error.response));
  }, [filterShop, filterStatus, resultsPerPage, targetPage]);

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
  const handleStatusFilter = (event) => {
    setFilterStatus(event.target.value !== "all" ? event.target.value : "");
    setTargetPage("1");
  };
  const handleTargetPage = (event, targetPage) => {
    setTargetPage(targetPage);
  };

  const editStatus = (event, collectiveCartId) => {
    updateSingleItem("collectivecarts", collectiveCartId, {
      status: event.target.value,
    })
      .then((response) => {
        const collectiveCartsEdited = collectiveCarts.map((collectiveCart) => {
          collectiveCart.status =
            collectiveCart._id === collectiveCartId
              ? response.data.status
              : collectiveCart.status;
          return collectiveCart;
        });
        setCollectiveCarts(collectiveCartsEdited);
      })

      .catch((error) => {
        console.log(error);
      });
  };

  const deleteCollectiveCart = (id) => {
    deleteItem("collectivecarts", id)
      .then((response) => {
        let updatedCollectiveCarts = collectiveCarts.filter(
          (collectiveCart) => collectiveCart._id !== response.data
        );
        setCollectiveCarts(updatedCollectiveCarts);
      })
      .catch((error) => setError(error));
  };

  return (
    <>
      <div className="container list">
        <section className="section">
          <h1 className="title is-size-3">Collective Carts</h1>
          {message && (
            <Message message={message.message} status={message.status} />
          )}
          <div className="filter columns is-multiline is-mobile">
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
              <SelectStatus
                handleChange={handleStatusFilter}
                status={filterStatus}
                withLabel={true}
                withOptionAll={true}
              />
            </div>

            <div className="column is-narrow">
              <SelectResultsPerPage
                handleChange={handleResultsPerPage}
                resultsPerPage={resultsPerPage}
                options={[2, 4, 24, 48, 72]}
              />
            </div>
          </div>

          <div className="table-container">
            <Table
              headings={[
                ["Shop", 1],
                ["Status", 1],
                ["Edit", 1],
                ["Delete", 1],
              ]}
              items={collectiveCarts}
              rows={collectiveCarts.map((collectiveCart) => [
                [
                  collectiveCart.shop.name,
                  <SelectStatus
                    handleChange={editStatus}
                    id={collectiveCart._id}
                    status={collectiveCart.status}
                    withLabel={false}
                    withOptionAll={false}
                  />,
                  <ButtonEdit
                    path={`/collectivecarts/${collectiveCart._id}`}
                    title={"Edit Collective Cart"}
                  />,
                  <ButtonDelete
                    deleteFunction={deleteCollectiveCart}
                    id={collectiveCart._id}
                    title={"Delete Collective Cart"}
                  />,
                ],
                [collectiveCart._id],
              ])}
              emptyMessage={"No Collective Carts listed."}
            />
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

export default CollectiveCartsList;

export async function getServerSideProps(context) {
  const shops = await getItems("shops");
  const filteredCollectiveCarts = await getFilteredCollectiveCarts(
    "",
    "",
    24,
    1
  );

  return {
    props: { shops, filteredCollectiveCarts },
  };
}
