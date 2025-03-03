import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { axiosHandler } from "../../lib/axiosHandler";
// import { setAccessToken } from "../../lib/tokenHandler";
// import { AppDispatch } from "../store";

interface UserData {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  status: "Active" | "Inactive";
  role: "Writer" | "Editor";
  password: string;
}

interface AuthState {
  data: UserData | null;
  loading: boolean;
  error: string | null,
}

const initialState: AuthState = {
  data: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, action: PayloadAction<UserData>) => {
      if (JSON.stringify(state.data) !== JSON.stringify(action.payload)) {
        state.data = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setAuthUser,
  setLoading,
  setError
} = authSlice.actions;



export default authSlice.reducer;
