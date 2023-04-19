import React, { useState, useEffect } from "react";
import { getItems } from "../axiosCalls/apiGetMultipleItems";
import { deleteItem } from "../axiosCalls/apiDeleteItem";
import Table from "../../components/Table";
import ButtonEdit from "../../components/ButtonEdit";
import ButtonDelete from "../../components/ButtonDelete";
import ButtonLink from "../../components/ButtonLink";
import Spinner from "../../components/Spinner";

function TagsList({ tags }) {
  // local states
  const [displayedTags, setDisplayedTags] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [message, setMessage] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    setDisplayedTags(tags);
    setLoading(false);
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  console.log("displayedTags", displayedTags);

  const deleteTag = (id) => {
    deleteItem("tags", id)
      .then((response) => {
        let updatedTags = displayedTags.filter(
          (tag) => tag._id !== response.data
        );
        setDisplayedTags(updatedTags);
      })
      .catch((error) => setError(error));
  };

  return (
    <>
      <div className="container itemslist">
        <section className="section">
          <h2 className="title is-size-4">Tags</h2>
          <div className="table-container">
            <Table
              headings={[
                ["Name", 1],
                ["Machine Name", 1],
                ["TagGroup", 1],
                ["Edit", 1],
                ["Delete", 1],
              ]}
              items={displayedTags}
              rows={displayedTags.map((tag) => [
                [
                  tag.name,
                  tag.machineName,
                  tag.tagGroup?.name,
                  <ButtonEdit path={`/tags/${tag._id}`} title={"Edit Tag"} />,
                  <ButtonDelete
                    deleteFunction={deleteTag}
                    id={tag._id}
                    title={"Delete tag"}
                  />,
                ],
                [tag._id],
              ])}
              emptyMessage={"No tags listed."}
            />
          </div>
          <div className="field block">
            <ButtonLink path={"/tags/add"} name={"Add Tag"} />
          </div>
        </section>
      </div>
    </>
  );
}

export default TagsList;

export async function getServerSideProps(context) {
  const tags = await getItems("tags");

  return {
    props: { tags },
  };
}
