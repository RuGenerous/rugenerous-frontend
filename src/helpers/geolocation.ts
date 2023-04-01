import axios from "axios";

const API_KEY = "7827544add0b453fb60303fade35beec"; // Replace with your ipapi API key

export async function isUSUser() {
  try {
    const response = await axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=${API_KEY}`);
    console.log(response);
    return response.data.country_code2 === "US";
  } catch (error) {
    console.error("Error determining user location:", error);
    return false;
  }
}
