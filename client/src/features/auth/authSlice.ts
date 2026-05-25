import api from "@/lib/api";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    role: string; // e.g., 'admin', 'user', etc.
  } | null;
  token: string | null;
}

const initialToken = localStorage.getItem("token");

const initialState: AuthState = {
  isAuthenticated: !!initialToken,
  user: null,
  token: initialToken,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async(credentials : {email : string, password : string}, {rejectWithValue}) => {
   try {
     const res = await api.post('/users/login', credentials);
     return res.data;
   } catch (error : any) {
    return rejectWithValue(error.res?.data?.message || 'Login failed');
   }
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredientials: (state, action : PayloadAction<{ user: AuthState['user'], token: string }>) => {
      const { user, token } = action.payload;
      state.isAuthenticated = true;
      state.user = user;
      state.token = token;
      localStorage.setItem("token", token);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
});

export const { setCredientials, logout } = authSlice.actions;
export default authSlice.reducer;
