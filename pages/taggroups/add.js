import React, { useState } from "react";
import Message from "../../components/Message";
import { addItem } from "../axiosCalls/apiPostSingleItem";
import { createMachineName } from "../../utils/createMachineName";

function TagGroupAdd() {
  // local states
  const [tagGroupData, setTagGroupData] = useState({
    name: "",
    machineName: "",
  });
  const [message, setMessage] = useState();
  const [error, setError] = useState();
  // const [isLoading, setLoading] = useState();

  const handleChange = (event) => {
    if (event.target.name === "name") {
      setTagGroupData({
        ...tagGroupData,
        name: event.target.value,
        machineName: createMachineName(event.target.value),
      });
    } else {
      setTagGroupData({
        ...tagGroupData,
        [event.target.name]: event.target.value,
      });
    }
  };
  console.log("tagGroupData", tagGroupData);

  const addTagGroup = async (event) => {
    event.preventDefault();
    await addItem("taggroups", tagGroupData)
      .then((response) => {
        setMessage({
          message: response.message,
          status: response.status,
        });
      })
      .catch((error) => setError(error));

    setTagGroupData({ name: "", machineName: "" });
  };

  return (
    <>
      <div className="container addsingle">
        <section className="section">
          <h2 className="title is-size-4">Add Tag Group</h2>
          {message && (
            <Message message={message.message} status={message.status} />
          )}

          <form onSubmit={addTagGroup}>
            <div className="block">
              <div className="columns">
                <div className="field column">
                  <label htmlFor="name " className="label">
                    Name
                  </label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      name="name"
                      id="name"
                      value={tagGroupData.name}
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
                      value={tagGroupData.machineName}
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

export default TagGroupAdd;
