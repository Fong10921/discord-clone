import axios from "axios";

export async function getUserwithBannerColor() {
  try {
    const response = await axios.get("/api/settings/profile/bannerColor");

    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserServerDataWithBannerColor() {
  try {
    const response = await axios.get("/api/settings/profile/serverData");

    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getCurrentUserData() {
  try {
    const response = await axios.get("/api/users");

    return response.data;
  } catch (error) {
    console.log(error);
  }
}
