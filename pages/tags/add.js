import React, { useState, useEffect } from "react";
import Message from "../../components/Message";
import { getItems } from "../axiosCalls/apiGetMultipleItems";
import { addItem } from "../axiosCalls/apiPostSingleItem";
import SelectTagGroups from "../../components/SelectTagGroups";
import { createMachineName } from "../../utils/createMachineName";

function TagAdd({ tagGroups }) {
  // local states
  const [tagData, setTagData] = useState({
    // name: "",
    // machineName: "",
    // tagGroup: "",
  });
  const [selectableTagGroups, setSelectableTagGroups] = useState([]);
  const [message, setMessage] = useState();
  const [error, setError] = useState();
  // const [isLoading, setLoading] = useState();

  useEffect(() => {
    setSelectableTagGroups(tagGroups);
  }, []);

  // if (isLoading) {
  //   return <div>Loading ...</div>;
  // }

  const handleChange = (event) => {
    if (event.target.name === "name") {
      setTagData({
        ...tagData,
        name: event.target.value,
        machineName: createMachineName(event.target.value),
      });
    } else {
      setTagData({
        ...tagData,
        [event.target.name]: event.target.value,
      });
    }
  };
  console.log("tagData", tagData);

  const addTag = async (event) => {
    event.preventDefault();
    await addItem("tags", tagData)
      .then((response) => {
        setMessage({
          message: response.message,
          status: response.status,
        });
      })
      .catch((error) => setError(error));

    setTagData({ name: "", machineName: "", tagGroup: "" });
  };

  return (
    <>
      <div className="container addsingle">
        <section className="section ">
          <h1 className="title is-size-4">Add Tag</h1>
          {message && (
            <Message message={message.message} status={message.status} />
          )}

          <form onSubmit={addTag}>
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
                      value={tagData.name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="field column">
                  <label htmlFor="machineName" className="label">
                    Machine Name
                  </label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      name="machineName"
                      id="machine-name"
                      value={tagData.machineName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <SelectTagGroups
                tagGroups={selectableTagGroups}
                handleChange={handleChange}
                selectedTagGroup={tagData.tagGroup || ""}
              />

              <div className="field block">
                <div className="control">
                  <input
                    className="button is-normal has-background-grey-dark has-text-white"
                    type="submit"
                    value="Save"
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

export default TagAdd;

export async function getServerSideProps(context) {
  const tagGroups = await getItems("taggroups");

  return {
    props: { tagGroups },
  };
}
