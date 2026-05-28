import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import api from "@/lib/api";

export interface Employee {
  _id: string;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Employee";
}

interface CreateEmployeePayload {
  name: string;
  email: string;
  password: string;
  role: "Admin" | "Manager" | "Employee";
}

interface EmployeeState {
  employees: Employee[];
  isLoading: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  employees: [],
  isLoading: false,
  error: null,
};

export const fetchEmployees = createAsyncThunk(
  "employee/fetchEmployees",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/users/");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to fetch employees",
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  },
);

export const createEmployee = createAsyncThunk(
  "employee/createEmployee",
  async (
    employeeData: CreateEmployeePayload,
    { dispatch, rejectWithValue },
  ) => {
    try {
      const response = await api.post("/users/createuser", employeeData);
      dispatch(fetchEmployees());
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to create employee",
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  },
);

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.isLoading = false;
        const data = action.payload.data ? action.payload.data : action.payload;
        state.employees = data.users || data.employees || [];
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createEmployee.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createEmployee.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default employeeSlice.reducer;
