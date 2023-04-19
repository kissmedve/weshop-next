import axios from "axios";
import { server } from "../../utils/config";

export const getItems = (itemGroup) => {
  return axios
    .get(`${server}/api/${itemGroup}`)
    .then((response) => response.data)
    .catch((error) => console.log(error));
};

export const getFilteredProducts = (
  filterTag,
  filterShop,
  resultsPerPage,
  targetPage
) => {
  return axios
    .get(
      `${server}/api/products?tag=${filterTag}&shop=${filterShop}&results=${resultsPerPage}&targetpage=${targetPage}`
    )
    .then((response) => response.data)
    .catch((error) => console.log(error));
};

export const getFilteredCarts = (
  filterUser,
  filterShop,
  filterStatus,
  resultsPerPage,
  targetPage
) => {
  return axios
    .get(
      `${server}/api/carts?user=${filterUser}&shop=${filterShop}&status=${filterStatus}&results=${resultsPerPage}&targetpage=${targetPage}`
    )
    .then((response) => response.data)
    .catch((error) => console.log(error));
};

export const getCartsByShopForSettlement = (filterShop) => {
  return axios
    .get(`${server}/api/carts/settlement?shop=${filterShop}&status=0&status=1`)
    .then((response) => response.data)
    .catch((error) => console.log(error));
};

export const getCartsOfCollectiveCart = (cartsIds) => {
  return axios
    .get(`${server}/api/carts/collectivecart?ids=${cartsIds}`)
    .then((response) => response.data)
    .catch((error) => console.log(error));
};

export const getFilteredCollectiveCarts = (
  filterShop,
  filterStatus,
  resultsPerPage,
  targetPage
) => {
  return axios
    .get(
      `${server}/api/collectivecarts?shop=${filterShop}&status=${filterStatus}&results=${resultsPerPage}&targetpage=${targetPage}`
    )
    .then((response) => response.data)
    .catch((error) => console.log(error));
};
