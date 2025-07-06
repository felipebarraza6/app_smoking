import axios from "axios";

export const GET = async (url, config = {}) => {
  const response = await axios.get(`"/api/"}${url}`, config);
  return response;
};
