import axios from "axios";

async function useCurrentUser() {
  try {
    const response = await axios.get("/api/users");

    return response.data; // This will be the list of to-dos
  } catch (error) {
    console.log(error);
  }
}

export default useCurrentUser;
