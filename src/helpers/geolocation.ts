import axios from "axios";

export async function isUSUser() {
  try {
    const response = await axios.get(`https://api.ipgeolocation.io/ipgeo`);
    return response.data.country_code2 === "US";
  } catch (error) {
    console.error("Error determining user location:", error);
    return false;
  }
}
