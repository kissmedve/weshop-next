import React, { useState, useEffect } from "react";
import SelectGeneric from "../../components/SelectGeneric";
import Message from "../../components/Message";
import { getItems } from "../axiosCalls/apiGetMultipleItems";
import { CSVLink } from "react-csv";

function Downloads() {
  // local States
  const [selectedContentType, setSelectedContentType] = useState();
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [message, setMessage] = useState();
  const [error, setError] = useState();

  const handleContentType = (event) => {
    setSelectedContentType(event.target.value);
  };

  useEffect(() => {
    getItems(selectedContentType)
      .then((response) => {
        if (selectedContentType === "products") {
          const returnedProducts = response[0].map((item) => [
            item._id,
            item.url ? item.url : ``,
            item.title ? item.title : ``,
            item.titleExt ? item.titleExt : ``,
            item.imgUrl ? item.imgUrl : ``,
            item.basePrice ? item.basePrice : ``,
            item.price ? item.price : ``,
            item.currency ? item.currency : ``,
            item.shop ? item.shop.name ?? item.shop.name : ``,
            item.shop ? item.shop._id ?? item.shop._id : ``,
            item.tag ? item.tag.name ?? item.tag.name : ``,
            item.tag ? item.tag._id ?? item.tag._id : ``,
          ]);
          console.log("returnedProducts", returnedProducts);
          setData(returnedProducts);
          const productsHeaders = [
            "ID",
            "URL",
            "Title",
            "Title Addition",
            "Img URL",
            "Baseprice",
            "Price",
            "Currency",
            "Shop Name",
            "Shop ID",
            "Tag Name",
            "Tag ID",
          ];
          setHeaders(productsHeaders);
        }
        if (selectedContentType === "tags") {
          console.log("tags here");
          const returnedTags = response.map((item) => [
            item._id,
            item.name ? item.name : ``,
            item.machineName ? item.machineName : ``,
            item.tagGroup ? item.tagGroup.name ?? item.tagGroup.name : ``,
            item.tagGroup
              ? item.tagGroup.machineName ?? item.tagGroup.machineName
              : ``,
            item.tagGroup ? item.tagGroup._id ?? item.tagGroup._id : ``,
          ]);
          console.log("returnedTags", returnedTags);
          setData(returnedTags);

          const tagsHeaders = [
            "ID",
            "Name",
            "MachineName",
            "TagGroup Name",
            "TagGroup MachineName",
            "TagGroup ID",
          ];
          setHeaders(tagsHeaders);
        }
        if (selectedContentType === "taggroups") {
          console.log("taggroups here");
          const returnedTagGroups = response.map((item) => [
            item._id,
            item.name ? item.name : ``,
            item.machineName ? item.machineName : ``,
          ]);
          console.log("returnedTagGroups", returnedTagGroups);
          setData(returnedTagGroups);

          const tagGroupsHeaders = ["ID", "Name", "MachineName"];
          setHeaders(tagsHeaders);
        }
        if (selectedContentType === "shops") {
          console.log("shops here");
          const returnedShops = response.map((item) => [
            item._id,
            item.name ? item.name : ``,
            item.machineName ? item.machineName : ``,
          ]);
          console.log("returnedShops", returnedShops);
          setData(returnedShops);

          const shopsHeaders = ["ID", "Name", "MachineName"];
          setHeaders(shopsHeaders);
        }
        if (selectedContentType === "users") {
          console.log("users here");
          const returnedUsers = response.map((item) => [
            item._id,
            item.lastName ? item.lastName : ``,
            item.firstName ? item.firstName : ``,
            item.email ? item.email : ``,
            item.role ? item.role : ``,
            item.active ? item.active : ``,
          ]);
          console.log("returnedUsers", returnedUsers);
          setData(returnedUsers);

          const usersHeaders = [
            "ID",
            "Last Name",
            "First Name",
            "Email",
            "Role",
            "Active",
          ];
          setHeaders(usersHeaders);
        }
      })
      .catch((error) => setError(error));
  }, [selectedContentType]);

  return (
    <div className="container addsingle">
      <section className="section">
        <h2 className="title is-size-4">Download Data</h2>
        {message && (
          <Message message={message.message} status={message.status} />
        )}
        <p className="label">Select the content type you want to download:</p>
        <form>
          <div className="block">
            <SelectGeneric
              optionsArray={["products", "tags", "taggroups", "shops", "users"]}
              arrayName={""}
              selectedOptionName={"contentType"}
              handleChange={handleContentType}
              selectedOption={selectedContentType}
              withSelect={true}
            />
          </div>

          <div className="field block">
            <div className="control">
              <CSVLink
                headers={headers}
                data={data}
                filename={`${selectedContentType}.csv`}
                className="button is-normal has-background-grey-dark has-text-white"
              >
                Download File
              </CSVLink>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}

export default Downloads;
