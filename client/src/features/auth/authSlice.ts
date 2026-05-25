import api from "@/lib/api";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    role: string; // e.g., 'admin', 'user', etc.
  } | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialToken = localStorage.getItem("token");

const initialState: AuthState = {
  isAuthenticated: !!initialToken,
  user: null,
  token: initialToken,
  isLoading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async(credentials : {email : string, password : string}, {rejectWithValue}) => {
   try {
     const res = await api.post('/users/login', credentials);
     return res.data;
   } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data.message || 'Login failed');
    }
    return rejectWithValue('An unexpected error occurred');
  }
  }
)

export const registerWorkspace = createAsyncThunk(
  'auth/registerWorkspace',
  async(workspaceData : {companyName : string, companyEmail : string, companyPhone : string, companyAddress : string, name : string, email : string, password : string}, {rejectWithValue}) => {
    try {
      const res = await api.post('/users/register', workspaceData);
      return res.data;
      
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Registration failed');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

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

  extraReducers : (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      // Optionally, you can set a loading state here
      state.isLoading = true;
      state.error = null;
    })
    .addCase(loginUser.fulfilled, (state, action) => {
      // Your backend wraps everything in 'data'
      const { token } = action.payload; 
      state.isAuthenticated = true;
      state.token = token;
      localStorage.setItem("token", token);
      state.isLoading = false;
      state.error = null;
    })
    .addCase(loginUser.rejected, (state, action) => {
      // Optionally, you can set an error state here using action.payload
      state.isLoading = false;
      state.error = action.payload as string || 'Login failed';
    })
    .addCase(registerWorkspace.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(registerWorkspace.fulfilled, (state, action) => {
      // Safely extract from the 'data' wrapper
      const { user, token } = action.payload;
      state.isAuthenticated = true;
      state.user = user;
      state.token = token;
      localStorage.setItem("token", token);
      
      // TURN OFF LOADING
      state.isLoading = false;
      state.error = null;
    })
    .addCase(registerWorkspace.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string || 'Registration failed';
    }); 
  }
});

export const { setCredientials, logout } = authSlice.actions;
export default authSlice.reducer;
