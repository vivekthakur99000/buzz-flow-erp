import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import api from "@/lib/api";

export interface EmployeeProfile {
  _id: string;
  user: string;
  designation: string;
  department: string;
  baseSalary: number;
  leaveBalance: number;
}

interface AddEmployeeProfilePayload {
  designation: string;
  department: string;
  baseSalary: number;
  userId: string;
}

interface EmployeeProfileState {
  profiles: EmployeeProfile[];
  isLoading: boolean;
  error: string | null;
}

const initialState: EmployeeProfileState = {
  profiles: [],
  isLoading: false,
  error: null,
};

export const getAllEmployeeProfiles = createAsyncThunk(
  "employeeProfile/getAllEmployeeProfiles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/employee-profile/");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to fetch employee profiles",
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  },
);

export const addEmployeeProfile = createAsyncThunk(
  "employeeProfile/addEmployeeProfile",
  async (
    profileData: AddEmployeeProfilePayload,
    { dispatch, rejectWithValue },
  ) => {
    try {
      const response = await api.post("/employee-profile/add", profileData);
      dispatch(getAllEmployeeProfiles());
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to add employee profile",
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  },
);

const employeeProfileSlice = createSlice({
  name: "employeeProfile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllEmployeeProfiles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllEmployeeProfiles.fulfilled, (state, action) => {
        state.isLoading = false;
        const data = action.payload.data ? action.payload.data : action.payload;
        state.profiles = data.employeeProfiles || data.profiles || [];
      })
      .addCase(getAllEmployeeProfiles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(addEmployeeProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addEmployeeProfile.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addEmployeeProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default employeeProfileSlice.reducer;