import React, { useState, useEffect } from "react";
import { getSingleItem } from "../axiosCalls/apiGetSingleItem";
import { getItems } from "../axiosCalls/apiGetMultipleItems";
import { updateSingleItem } from "../axiosCalls/apiPutSingleItem";
import SelectTagGroups from "../../components/SelectTagGroups";
import Spinner from "../../components/Spinner";
import Message from "../../components/Message";

function TagEdit({ tag, tagGroups }) {
  // local states
  const [selectableTagGroups, setSelectableTagGroups] = useState([]);
  const [tagData, setTagData] = useState({});
  const [message, setMessage] = useState();
  const [error, setError] = useState();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    console.log("tag", tag);
    setTagData(tag);
    setSelectableTagGroups(tagGroups);
    setLoading(false);
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  const handleChange = (event) => {
    setTagData({
      ...tagData,
      [event.target.name]: event.target.value,
    });
  };

  const editTag = (event) => {
    event.preventDefault();
    updateSingleItem("tags", tagData._id, tagData)
      .then((response) => {
        setMessage({
          message: response.message,
          status: response.status,
        });
        setTagData(response.data);
      })
      .catch((error) => setError(error));
  };
  console.log("tagData", tagData);

  return (
    <>
      <div className="container editsingle">
        <section className="section">
          <h2 className="title is-size-4">Edit Tag</h2>
          {message && (
            <Message message={message.message} status={message.status} />
          )}

          <form onSubmit={editTag}>
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
            </div>                                                                                                                                            

            <SelectTagGroups
              tagGroups={selectableTagGroups}
              handleChange={handleChange}
              selectedTagGroup={tagData.tagGroup ? tagData.tagGroup._id : ""}
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
          </form>
        </section>
      </div>
    </>
  );
}

export default TagEdit;

export async function getServerSideProps(context) {
  const tid = context.params.tid;
  const tag = await getSingleItem("tags", tid);
  const tagGroups = await getItems("taggroups");
  return {
    props: { tag, tagGroups },
  };
}
