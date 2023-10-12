import axios from "axios";

async function useBannerColor() {
  try {
    const response = await axios.get("http://localhost:3000/api/settings/profile/bannerColor");

    return response.data; 
  } catch (error) {
    console.log(error);
  }
}

export default useBannerColor;
