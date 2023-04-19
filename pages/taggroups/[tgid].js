import React, { useState, useEffect } from "react";
import { getSingleItem } from "../axiosCalls/apiGetSingleItem";
import { updateSingleItem } from "../axiosCalls/apiPutSingleItem";
import Message from "../../components/Message";

function TagGroupEdit({ tagGroup }) {
  // local states
  const [tagGroupData, setTagGroupData] = useState();
  const [message, setMessage] = useState();
  const [error, setError] = useState();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setTagGroupData(tagGroup);
    setLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  const handleChange = (event) => {
    setTagGroupData({
      ...tagGroupData,
      [event.target.name]: event.target.value,
    });
  };

  const editTagGroup = (event) => {
    event.preventDefault();
    updateSingleItem("taggroups", tagGroupData._id, tagGroupData).then(
      (response) => {
        setMessage({
          message: response.message,
          status: response.status,
        });
        setTagGroupData(response.data);
      }
    );
  };

  return (
    <>
      <div className="container editsingle">
        <section className="section">
          <h2 className="title is-size-4">Edit Tag Group</h2>
          {message && (
            <Message message={message.message} status={message.status} />
          )}

          <form onSubmit={editTagGroup}>
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

export default TagGroupEdit;

export async function getServerSideProps(context) {
  const tgid = context.params.tgid;
  const tagGroup = await getSingleItem("taggroups", tgid);
  return {
    props: { tagGroup },
  };
}
