import React, { useState, useEffect } from "react";
import Message from "../components/Message";

function Register() {
  // local states
  const [userData, setUserData] = useState({});
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

  const checkUser = async (event) => {
    event.preventDefault();
    await sendUser("user", userData)
      .then((response) => {
        setMessage({
          message: response.message,
          status: response.status,
        });
      })
      .catch((error) => setError(error));
  };

  return (
    <>
      <div className="container login">
        <section className="section ">
          <h1 className="title is-size-4">Register</h1>
          {message && (
            <Message message={message.message} status={message.status} />
          )}

          <form onSubmit={checkUser}>
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
                      value={userData.name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="field column">
                  <label htmlFor="username" className="label">
                    Username
                  </label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      name="username"
                      id="username"
                      value={userData.username}
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

                <div className="field column">
                  <label htmlFor="password" className="label">
                    Password
                  </label>
                  <div className="control">
                    <input
                      className="input"
                      type="password"
                      name="password"
                      id="password"
                      value={userData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="field block">
                <div className="control">
                  <input
                    className="button is-normal has-background-grey-dark has-text-white"
                    type="submit"
                    value="Submit"
                  />
                </div>
              </div>
            </div>
          </form>
        </section>
      </div>
    </>
  );
}

export default Register;
