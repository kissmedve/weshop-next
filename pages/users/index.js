import React, { useState, useEffect } from "react";
import { getItems } from "../axiosCalls/apiGetMultipleItems";
import { deleteItem } from "../axiosCalls/apiDeleteItem";
import Table from "../../components/Table";
import ButtonEdit from "../../components/ButtonEdit";
import ButtonDelete from "../../components/ButtonDelete";
import ButtonLink from "../../components/ButtonLink";
import Spinner from "../../components/Spinner";

function UsersList({ users }) {
  // local states
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [message, setMessage] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    setDisplayedUsers(users);
    setLoading(false);
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  const deleteUser = (id) => {
    deleteItem("users", id)
      .then((response) => {
        let updatedUsers = displayedUsers.filter(
          (user) => user._id !== response.data
        );
        setDisplayedUsers(updatedUsers);
      })
      .catch((error) => setError(error));
  };

  return (
    <>
      <div className="container itemslist">
        <section className="section">
          <h2 className="title is-size-4">Users</h2>
          <div className="table-container">
            <Table
              headings={[
                ["First Name", 1],
                ["Last Name", 1],
                ["Email", 1],
                ["Role", 1],
                ["Status", 1],
                ["Edit", 1],
                ["Delete", 1],
              ]}
              items={displayedUsers}
              rows={displayedUsers.map((user) => [
                [
                  user.firstName,
                  user.lastName,
                  user.email,
                  user.role,
                  user.active ? "active" : "not active",
                  <ButtonEdit
                    path={`/users/${user._id}`}
                    title={"Edit User"}
                  />,
                  <ButtonDelete
                    deleteFunction={deleteUser}
                    id={user._id}
                    title={"Delete user"}
                  />,
                ],
                [user._id],
              ])}
              emptyMessage={"No users listed."}
            />
          </div>
          <div className="field block">
            <ButtonLink path={"/users/add"} name={"Add User"} />
          </div>
        </section>
      </div>
    </>
  );
}

export default UsersList;

export async function getServerSideProps(context) {
  const users = await getItems("users");

  return {
    props: { users },
  };
}
