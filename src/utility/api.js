import axios from "axios";

const baseURL = "http://localhost:9898/api/v1";

const api = {
  Get: async (url, parms) => {
    try {
      const res = await axios.get(`${baseURL}/${url}`, parms);
      return res;
    } catch (err) {
      return console.log(err);
    }
  },

  Post: async (url, parms) => {
    try {
      const res = await axios.post(`${baseURL}/${url}`, parms);
      return res.data;
    } catch (err) {
      return console.log(err);
    }
  },

  Put: async (url, parms) => {
    try {
      const res = await axios.put(`${baseURL}/${url}`, parms);
      return res;
    } catch (err) {
      return console.log(err);
    }
  },
};

export default api;
