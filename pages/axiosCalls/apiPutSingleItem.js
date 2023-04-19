import axios from "axios";
import { server } from "../../utils/config";

export const updateSingleItem = (itemGroup, id, payload) => {
  return axios
    .put(`${server}/api/${itemGroup}/${id}`, payload)
    .then((response) => response.data);
};

export const findMatchingCartAndUpdate = (shopId, userId, status, payload) => {
  return axios
    .put(
      `${server}/api/carts/find?shop=${shopId}&user=${userId}&status=${status}`,
      payload
    )
    .then((response) => response.data);
};
