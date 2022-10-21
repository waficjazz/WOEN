import axios from "axios";

const Axios = axios.create({
  baseURL: "http://localhost:5001/api/v1",
});

export default Axios;
