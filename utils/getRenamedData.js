export function getRenamedData(parsedData) {
  function getContentType(data) {
    let rowKeys = Object.keys(data[0]);
    let contentType = "";
    if (rowKeys.includes("TagGroup MachineName")) {
      contentType = "tags";
    }
    if (rowKeys.includes("Base Price")) {
      contentType = "products";
    }
    if (rowKeys.includes("Last Name")) {
      contentType = "users";
    }
    return contentType;
  }

  function getTemplate(contentType) {
    let template = "";

    const keysTags = {
      ID: "_id",
      Name: "name",
      MachineName: "machineName",
      "TagGroup Name": "tagGroupName",
      "TagGroup MachineName": "tagGroupMachineName",
      "TagGroup ID": "tagGroupId",
    };
    const keysProducts = {
      ID: "_id",
      URL: "url",
      Title: "title",
      "Title Addition": "titleExt",
      "Image URL": "imgUrl",
      "Base Price": "basePrice",
      Price: "price",
      Currency: "currency",
      Shop: "shop",
      Tag: "tag",
    };
    const keysUsers = {
      ID: "_id",
      "Last Name": "lastName",
      "First Name": "firstName",
      Email: "email",
      Role: "role",
      Active: "active",
    };

    switch (contentType) {
      case "tags":
        template = keysTags;
        break;
      case "products":
        template = keysProducts;
        break;
      case "users":
        template = keysUsers;
        break;
      default:
        template = "no template";
    }
    return template;
  }

  const renameKeys = (template, dataItem) =>
    Object.keys(dataItem).reduce(
      (acc, key) => ({
        ...acc,
        ...{ [template[key] || key]: dataItem[key] },
      }),
      {}
    );

  const renameData = (data, template) => {
    let renamed = data.map((item) => renameKeys(template, item));
    return renamed;
  };

  const dataType = getContentType(parsedData);
  const template = getTemplate(dataType);

  let resultingData = renameData(parsedData, template);

  return {
    data: resultingData,
    contentType: dataType,
  };
}

// tags
// "ID","Name","MachineName","TagGroup Name","TagGroup MachineName","TagGroup ID"
// products
// "URL", "Title", "Title Addition", "Image URL", "Base Price", "Price", "Currency", "Shop", "Tag"
// users
// "Last Name", "First Name", "Email", "Password", "Role", "Active", "Carts"

// ==============

// carts1
// "ID", "User Subtotal", "User Total", "Shop", "User", "Status"
// carts2
// "Cart ID", "Product ID", "Product Name", "Price at Order", "Price at Delivery", "Quantity Ordered", "Quantity Delivered"
// collectiveCarts1
// "ID", "Subtotal", "Total", "Shop", "DeliveryDate", "Status"
// collectiveCarts2
// "ID", "Product ID", "Product Name", "Price at Delivery", "Quantity Ordered", "Quantity Delivered", "Quantity Remainder", "Money Remainder"
// collectiveCarts3
// "ID", "users"
// collectiveCarts4
// "ID", "carts"

// ===============
