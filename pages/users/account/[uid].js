import React, { useState, useEffect } from "react";
import { getSingleItem } from "../../axiosCalls/apiGetSingleItem";
import {
  getItems,
  getFilteredCarts,
} from "../../axiosCalls/apiGetMultipleItems";
import { updateSingleItem } from "../../axiosCalls/apiPutSingleItem";
import ButtonLink from "../../../components/ButtonLink";
import ButtonView from "../../../components/ButtonView";
import Table from "../../../components/Table";
import { statusName } from "../../../utils/statusName";
import Spinner from "../../../components/Spinner";
import Message from "../../../components/Message";

function UserAccount({ user, carts }) {
  // local states
  const [userData, setUserData] = useState({});
  const [selectableCarts, setSelectableCarts] = useState([]);
  const [message, setMessage] = useState();
  const [error, setError] = useState();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setUserData(user);
    setSelectableCarts(carts[0]);
    setLoading(false);
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <div className="container editsingle">
        <section className="section">
          <h1 className="title is-size-3">{userData.name}</h1>
          {message && (
            <Message message={message.message} status={message.status} />
          )}
          <div className="box profile">
            <h2 className="title is-size-4">Profile</h2>

            <div className="is-flex">
              <div className="label">Name:</div>
              <div>{userData.name}</div>
            </div>
            <div className="is-flex">
              <div className="label">Username:</div>
              <div>{userData.uniqueName}</div>
            </div>
            <div className="is-flex">
              <div className="label">Email:</div>
              <div>{userData.email}</div>
            </div>
            <div className="is-flex">
              <div className="label">Role:</div>
              <div>{userData.role}</div>
            </div>
            <div className="buttons mt-4">
              <ButtonLink
                path={`/users/${userData._id}`}
                name={"Edit Profile"}
              />
              <ButtonLink
                path={`/users/${userData._id}/password`}
                name={"Edit Password"}
              />
            </div>
          </div>
          <div className="box carts">
            <h2 className="title is-size-4">Carts</h2>
            <Table
              headings={[
                ["Shop", 1],
                ["Status", 1],
                ["View", 1],
              ]}
              items={selectableCarts}
              rows={selectableCarts.map((cart) => [
                [
                  cart.shop.name,
                  statusName(cart.status, cart._id),
                  <ButtonView
                    path={`/carts/${cart._id}`}
                    title={"View Cart"}
                  />,
                ],
                [cart._id],
              ])}
              emptyMessage={"No Carts listed."}
            />
          </div>
        </section>
      </div>
    </>
  );
}

export default UserAccount;

export async function getServerSideProps(context) {
  const uid = context.params.uid;
  const user = await getSingleItem("users", uid);
  const carts = await getFilteredCarts(uid, "", "", 24, 1);
  return {
    props: { user, carts },
  };
}
