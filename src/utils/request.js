import axios from "axios";
import { baseURL } from "./base";
const request = axios.create({
  baseURL,
});
export default request;
