import axios from "axios";
import { server } from "../../utils/config";

export const getSingleItem = (itemGroup, id) => {
  return axios
    .get(`${server}/api/${itemGroup}/${id}`)
    .then((response) => response.data);
};
