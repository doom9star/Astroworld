import axios from "axios";

export const cAxios = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
});
