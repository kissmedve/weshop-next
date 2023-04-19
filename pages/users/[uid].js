import React, { useState, useEffect } from "react";
import { getSingleItem } from "../axiosCalls/apiGetSingleItem";
import { updateSingleItem } from "../axiosCalls/apiPutSingleItem";
import Spinner from "../../components/Spinner";
import Message from "../../components/Message";

function UserEdit({ user }) {
  // local states
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "Basic",
    active: true,
  });
  const [message, setMessage] = useState();
  const [error, setError] = useState();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setUserData(user);
    setLoading(false);
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  const handleChange = (event) => {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value,
    });
  };

  const editUser = (event) => {
    event.preventDefault();
    updateSingleItem("users", userData._id, userData)
      .then((response) => {
        setMessage({
          message: response.message,
          status: response.status,
        });
        setUserData(response.data);
      })
      .catch((error) => setError(error));
  };

  return (
    <>
      <div className="container editsingle">
        <section className="section">
          <h2 className="title is-size-4">Edit User</h2>
          {message && (
            <Message message={message.message} status={message.status} />
          )}

          <form onSubmit={editUser}>
            <div className="block">
              <div className="columns">
                <div className="field column">
                  <label htmlFor="firstName" className="label">
                    First name
                  </label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      name="firstName"
                      id="firstName"
                      value={userData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="field column">
                  <label htmlFor="lastName" className="label">
                    Last name
                  </label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      name="lastName"
                      id="lastName"
                      value={userData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="columns">
                <div className="field column">
                  <label htmlFor="email" className="label">
                    Email
                  </label>
                  <div className="control">
                    <input
                      className="input"
                      type="email"
                      name="email"
                      id="email"
                      value={userData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="columns">
                <div className="field column">
                  <label htmlFor="role" className="label">
                    Role
                  </label>
                  <div className="control">
                    <label className="radio">
                      <input
                        type="radio"
                        name="role"
                        id="role"
                        value="Basic"
                        checked={userData.role === "Basic"}
                        onChange={handleChange}
                      />
                      Basic
                    </label>
                    <label className="radio">
                      <input
                        type="radio"
                        name="role"
                        id="role"
                        value="Admin"
                        checked={userData.role === "Admin"}
                        onChange={handleChange}
                      />
                      Admin
                    </label>
                  </div>
                </div>

                <div className="field column">
                  <label htmlFor="status" className="label">
                    Status
                  </label>
                  <div className="control">
                    <label className="radio">
                      <input
                        type="radio"
                        name="status"
                        id="status"
                        value="true"
                        checked={userData.active === true}
                        onChange={handleChange}
                      />
                      Active
                    </label>
                    <label className="radio">
                      <input
                        type="radio"
                        name="status"
                        id="status"
                        value="false"
                        checked={userData.active === false}
                        onChange={handleChange}
                      />
                      Not active
                    </label>
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

export default UserEdit;

export async function getServerSideProps(context) {
  const uid = context.params.uid;
  const user = await getSingleItem("users", uid);
  return {
    props: { user },
  };
}
