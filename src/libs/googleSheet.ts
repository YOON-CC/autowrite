import axios from "axios";

const getMountains = async () => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}`);
  console.log(response.data);
  return response.data;
};

export { getMountains };
