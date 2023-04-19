import React, { useState, useEffect } from "react";
import { getItems } from "../axiosCalls/apiGetMultipleItems";
import { deleteItem } from "../axiosCalls/apiDeleteItem";
import Table from "../../components/Table";
import ButtonEdit from "../../components/ButtonEdit";
import ButtonDelete from "../../components/ButtonDelete";
import ButtonLink from "../../components/ButtonLink";
import Spinner from "../../components/Spinner";
import { getSession, useSession } from "next-auth/react";
import Router from "next/router";

function TagGroupsList({ tagGroups }) {
  const { data: session, status } = useSession();
  // local states
  const [displayedTagGroups, setDisplayedTagGroups] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [message, setMessage] = useState();
  const [error, setError] = useState();

  const accessLevel = "Admin";

  useEffect(() => {
    if (session && session.user.role === "Admin") {
      setDisplayedTagGroups(tagGroups);
    }
    if (!session || session.user.role !== "Admin") {
      Router.push("/unauthorized");
    }
    setLoading(false);
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  const deleteTagGroup = (id) => {
    deleteItem("taggroups", id)
      .then((response) => {
        let updatedTagGroups = displayedTagGroups.filter(
          (group) => group._id !== response.data
        );
        setDisplayedTagGroups(updatedTagGroups);
      })
      .catch((error) => setError(error));
  };

  return (
    <>
      <div className="container itemslist">
        <section className="section">
          <h2 className="title is-size-4">Tag Groups</h2>
          <div className="table-container">
            <Table
              headings={[
                ["Name", 1],
                ["Machine Name", 1],
                ["Edit", 1],
                ["Delete", 1],
              ]}
              items={displayedTagGroups}
              rows={displayedTagGroups.map((group) => [
                [
                  group.name,
                  group.machineName,
                  <ButtonEdit
                    path={`/taggroups/${group._id}`}
                    title={"Edit Tag group"}
                  />,
                  <ButtonDelete
                    deleteFunction={deleteTagGroup}
                    id={group._id}
                    title={"Delete Tag group"}
                  />,
                ],
                [group._id],
              ])}
              emptyMessage={"No Tag groups listed."}
            />
          </div>

          <div className="field block">
            <ButtonLink path={"/taggroups/add"} name={"Add Tag group"} />
          </div>
        </section>
      </div>
    </>
  );
}

export default TagGroupsList;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const tagGroups = await getItems("taggroups");

  return {
    props: {
      tagGroups,
      session,
    },
  };
}
