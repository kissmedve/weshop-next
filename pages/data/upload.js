import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import Message from "../../components/Message";
import { addMultipleItems } from "../axiosCalls/apiPostMultipleItems";
import { getRenamedData } from "../../utils/getRenamedData";

// uploadable content types // unique fieldname as identifier
// ===========================================================
// tags // tagGroupName / TagGroup Name
// products // basePrice / Base Price
// users // lastName / Last Name
// --------------------------------
// carts // userTotal  / (upload as json, since nested)
// collectiveCarts // deliveryDate  / (upload as json, since nested)
// --------------------------------
// tagGroups not uploadable (few items, can be managed on ui)
// shops not uploadable (few items, can be managed on ui)

function Uploads() {
  // local States
  const [selectedFile, setSelectedFile] = useState({});
  const [parsedData, setParsedData] = useState([]);
  const [contentType, setContentType] = useState();
  const [modifiedData, setModifiedData] = useState([]);
  const [message, setMessage] = useState();
  const [error, setError] = useState();

  const handleChangeFile = (event) => {
    setSelectedFile(event.target.files[0]);
    Papa.parse(event.target.files[0], {
      header: true,
      complete: (results) => {
        setParsedData(results.data);
      },
    });
  };

  console.log("parsedData", parsedData);

  useEffect(() => {
    if (parsedData && parsedData.length > 0) {
      console.log("contentType", getRenamedData(parsedData).contentType);
      console.log("data", getRenamedData(parsedData).data);
      setContentType(getRenamedData(parsedData).contentType);
      setModifiedData(getRenamedData(parsedData).data);
    }
  }, [parsedData]);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("contentType", contentType);
    console.log("parsedData", parsedData);
    console.log("modifiedData", modifiedData);
    addMultipleItems(contentType, modifiedData)
      .then((response) => console.log("response", response))
      .catch((error) => setError(error));
  };

  return (
    <div className="container addsingle">
      <section className="section">
        <h2 className="title is-size-4">Upload Data</h2>
        {message && (
          <Message message={message.message} status={message.status} />
        )}
        <p>Upload your products or tags collections via .csv files.</p>

        <form>
          <p className="label">Select a CSV file:</p>
          <div className="field block">
            <div className="file is-normal has-name">
              <label className="file-label ">
                <input
                  className="file-input"
                  type="file"
                  name="fileUpload"
                  accept=".csv"
                  onChange={handleChangeFile}
                />
                <span className="file-cta">
                  <span className="file-icon">
                    <i className="fas fa-upload"></i>
                  </span>
                  <span className="file-label">Select</span>
                </span>
                <span className="file-name">
                  {selectedFile.name ?? "No file selected"}
                </span>
              </label>
            </div>
          </div>

          <div className="field block">
            <div className="control">
              <button
                className="button is-normal has-background-grey-dark
                  has-text-white"
                onClick={handleSubmit}
              >
                Upload file
              </button>
            </div>
          </div>
        </form>
        <div className="block">
          <h2 className="title is-size-4">Templates</h2>
          <p>
            To meet the structure of the data in the database you need to
            download the respective templates first. Each template consists of a
            line of column titles and one example line of values. Don't change
            the structure! If you add new items, just fill in the information
            you have and leave everything else blank (like so: ""). If you are
            re-uploading data, leave the id numbers in place as to not creating
            duplicate data.{" "}
          </p>
          <p>Download the templates here:</p>
          <div className="buttons">
            <button
              className="button is-normal has-background-grey-dark
                  has-text-white"
            >
              "Products" Template
            </button>
            <button
              className="button is-normal has-background-grey-dark
                  has-text-white"
            >
              "Tags" Template
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Uploads;
