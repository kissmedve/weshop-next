import React, { useState, useEffect } from "react";
import { getItems, getFilteredCarts } from "../axiosCalls/apiGetMultipleItems";
import { deleteItem } from "../axiosCalls/apiDeleteItem";
import { updateSingleItem } from "../axiosCalls/apiPutSingleItem";
import { combineNameFields } from "../../utils/combineNameFields";
import Table from "../../components/Table";
import ButtonEdit from "../../components/ButtonEdit";
import ButtonDelete from "../../components/ButtonDelete";
import SelectShops from "../../components/SelectShops";
import SelectUsers from "../../components/SelectUsers";
import SelectStatus from "../../components/SelectStatus";
import SelectResultsPerPage from "../../components/SelectResultsPerPage";
import PaginationButtons from "../../components/PaginationButtons";
import Message from "../../components/Message";
import Spinner from "../../components/Spinner";

function CartsList({ users, shops, filteredCarts }) {
  // local states
  const [selectableUsers, setSelectableUsers] = useState([]);
  const [selectableShops, setSelectableShops] = useState([]);
  const [carts, setCarts] = useState([]);
  const [currentPage, setCurrentPage] = useState("1");
  const [numberOfPages, setNumberOfPages] = useState("1");
  const [filterUser, setFilterUser] = useState("");
  const [filterShop, setFilterShop] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [resultsPerPage, setResultsPerPage] = useState("24");
  const [targetPage, setTargetPage] = useState("1");
  const [message, setMessage] = useState();
  const [error, setError] = useState();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setSelectableUsers(users);
    setSelectableShops(shops);

    setCarts(filteredCarts[0]);
    setCurrentPage(filteredCarts[1]);
    setNumberOfPages(filteredCarts[2]);
    setLoading(false);
  }, []);

  useEffect(() => {
    getFilteredCarts(
      filterUser,
      filterShop,
      filterStatus,
      resultsPerPage,
      targetPage
    )
      .then((returnedData) => {
        setCarts(returnedData[0]);
        setCurrentPage(returnedData[1]);
        setNumberOfPages(returnedData[2]);
      })
      .catch((error) => setError(error.response));
  }, [filterUser, filterShop, filterStatus, resultsPerPage, targetPage]);

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
  const handleUserFilter = (event) => {
    setFilterUser(event.target.value !== "all" ? event.target.value : "");
    setTargetPage("1");
  };
  const handleStatusFilter = (event) => {
    setFilterStatus(event.target.value !== "all" ? event.target.value : "");
    setTargetPage("1");
  };
  const handleTargetPage = (event, targetPage) => {
    setTargetPage(targetPage);
  };

  const editStatus = (event, cartId) => {
    updateSingleItem("carts", cartId, { status: event.target.value })
      .then((response) => {
        const cartsEdited = carts.map((cart) => {
          cart.status =
            cart._id === cartId ? response.data.status : cart.status;
          return cart;
        });
        setCarts(cartsEdited);
      })

      .catch((error) => {
        console.log(error);
      });
  };

  const deleteCart = (id) => {
    deleteItem("carts", id)
      .then((response) => {
        let updatedCarts = carts.filter((cart) => cart._id !== response.data);
        setCarts(updatedCarts);
      })
      .catch((error) => setError(error));
  };

  return (
    <>
      <div className="container list">
        <section className="section">
          <h1 className="title is-size-3">Carts</h1>
          {message && (
            <Message message={message.message} status={message.status} />
          )}
          <div className="filter columns is-multiline is-mobile">
            <div className="column is-narrow">
              {selectableUsers && (
                <SelectUsers
                  label={"User"}
                  withSelectSelect={false}
                  withSelectAll={true}
                  users={selectableUsers}
                  handleChange={handleUserFilter}
                  selectedUser={filterUser}
                />
              )}
            </div>

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
                ["User", 1],
                ["Shop", 1],
                ["Status", 1],
                ["Edit", 1],
                ["Delete", 1],
              ]}
              items={carts}
              rows={carts.map((cart) => [
                [
                  combineNameFields(
                    cart.user.firstName,
                    cart.user.lastName,
                    "reverse"
                  ),

                  cart.shop.name,
                  <SelectStatus
                    handleChange={editStatus}
                    id={cart._id}
                    status={cart.status}
                    withLabel={false}
                    withOptionAll={false}
                  />,
                  <ButtonEdit
                    path={`/carts/${cart._id}`}
                    title={"Edit Cart"}
                  />,
                  <ButtonDelete
                    deleteFunction={deleteCart}
                    id={cart._id}
                    title={"Delete Cart"}
                  />,
                ],
                [cart._id],
              ])}
              emptyMessage={"No Carts listed."}
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

export default CartsList;

export async function getServerSideProps(context) {
  const users = await getItems("users");
  const shops = await getItems("shops");
  const filteredCarts = await getFilteredCarts("", "", "", 24, 1);

  return {
    props: { users, shops, filteredCarts },
  };
}
