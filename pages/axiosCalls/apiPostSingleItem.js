import axios from "axios";
import { server } from "../../utils/config";

export const addItem = (itemGroup, payload) => {
  return axios
    .post(`${server}/api/${itemGroup}/add`, payload)
    .then((response) => response.data);
};
