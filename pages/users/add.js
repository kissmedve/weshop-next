import React, { useState } from "react";
import Message from "../../components/Message";
import { addItem } from "../axiosCalls/apiPostSingleItem";

function UserAdd() {
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
  // const [isLoading, setLoading] = useState();

  // if (isLoading) {
  //   return <div>Loading ...</div>;
  // }

  const handleChange = (event) => {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value,
    });
  };

  const addUser = async (event) => {
    event.preventDefault();
    await addItem("users", userData)
      .then((response) => {
        console.log("response.status", response.status);
        setMessage({
          message: response.message,
          status: response.status,
        });
      })
      .catch((error) => setError(error));

    setUserData({
      firstName: "",
      lastName: "",
      email: "",
      role: "Basic",
      active: true,
    });
  };

  return (
    <>
      <div className="container addsingle">
        <section className="section">
          <h2 className="title is-size-4">Add User</h2>
          {message && (
            <Message message={message.message} status={message.status} />
          )}

          <form onSubmit={addUser}>
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
                        value={userData.role}
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
                        value={userData.role}
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
                        value={userData.active}
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
                        value={userData.active}
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

export default UserAdd;
