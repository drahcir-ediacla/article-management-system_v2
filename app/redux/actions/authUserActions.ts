import { axiosInstance } from "@/app/_lib/axiosInstance";
import { setAuthUser, setLoading, setError } from "../reducer/authUserSlice";
import { AppDispatch } from "../store";

export const currentAuthUser = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axiosInstance.get('/api/auth-user');
    dispatch(setAuthUser(response.data));
  } catch (error) {
    console.error("Error fetching authenticated user:", error);
    dispatch(setError('Error fetching authenticated user.'));
  } finally {
    dispatch(setLoading(false));
  }
};
