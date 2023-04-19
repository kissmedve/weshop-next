import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Message from "../../components/Message";

function SignIn({ providers }) {
  // local states
  const [userData, setUserData] = useState({});
  const [message, setMessage] = useState();
  const [error, setError] = useState();
  // const [isLoading, setLoading] = useState();

  // if (isLoading) {
  //   return <div>Loading ...</div>;
  // }
  const router = useRouter();
  const callbackUrl = decodeURI(router.query?.callbackUrl ?? "/");

  console.log("router", router);

  const handleChange = (event) => {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await signIn("credentials", {
      email: userData.email,
      password: userData.password,
      callbackUrl: callbackUrl ?? "/",
    });
    // console.log("result", result);
    // if (result?.error) {
    //   setError(result.error);
    // }
    // if (result?.ok) {
    //   router.push(callbackUrl);
    // }
  };

  // const checkUser = async (event) => {
  //   event.preventDefault();
  //   await sendUser("user", userData)
  //     .then((response) => {
  //       setMessage({
  //         message: response.message,
  //         status: response.status,
  //       });
  //     })
  //     .catch((error) => setError(error));
  // };

  return (
    <>
      <div className="container login">
        <section className="section ">
          <h1 className="title is-size-4">Login</h1>
          {message && (
            <Message message={message.message} status={message.status} />
          )}

          <form onSubmit={handleSubmit}>
            <div className="block">
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

export default SignIn;
