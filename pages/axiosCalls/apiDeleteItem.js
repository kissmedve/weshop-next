import axios from "axios";
import { server } from "../../utils/config";

export const deleteItem = async (itemGroup, id) => {
  return await axios
    .delete(`${server}/api/${itemGroup}/${id}`)
    .then((response) => response.data);
};
