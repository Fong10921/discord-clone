
import { API_URLS } from "@/constants/apiUrls";
import { QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";

export async function fetchUserWithBannerColor() {
  try {
    const response = await axios.get(API_URLS.USER_PROFILE_BANNER_COLOR);

    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getCurrentUserData() {
  try {
    const response = await axios.get(API_URLS.GET_CURRENT_USER_DATA);

    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchUserServerDataWithBannerColor(
  context?: QueryFunctionContext<string[]>,
  serverImageId?: string
) {
  // Use serverImageId directly if provided, otherwise try to get it from context
  const choosenServerImage = serverImageId || context?.queryKey[1];

  try {
    const response = await axios({
      method: "get",
      url: API_URLS.SERVER_DATA,
      params: {
        choosenServerImage,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchUserPrivacySafetySetting(
) {

  try {
    const response = await axios({
      method: "get",
      url: API_URLS.PRIVACY_SAFETY,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
