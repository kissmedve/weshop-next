import axios from "axios";
import { server } from "../../utils/config";

export const addMultipleItems = (itemGroup, payload) => {
  return axios
    .post(`${server}/api/${itemGroup}`, payload)
    .then((response) => response.data);
};
