import axios from "axios";
import { server } from "../../utils/config";

export const updateMultipleItems = (itemGroup, payload) => {
  return axios
    .put(`${server}/api/${itemGroup}`, payload)
    .then((response) => response.data);
};
