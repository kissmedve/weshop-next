export const filterParams = (queryObject) => {
  const filters = {};

  for (let i = 0; i < Object.keys(queryObject).length; i++) {
    if (
      Object.values(queryObject)[i] !== "" &&
      Object.values(queryObject)[i] !== undefined &&
      Object.values(queryObject)[i] !== null
    ) {
      if (Array.isArray(Object.values(queryObject)[i])) {
        filters[Object.keys(queryObject)[i]] = {
          $all: Object.values(queryObject)[i],
        };
      } else {
        filters[Object.keys(queryObject)[i]] = Object.values(queryObject)[i];
      }
    }
  }
  return filters;
};
