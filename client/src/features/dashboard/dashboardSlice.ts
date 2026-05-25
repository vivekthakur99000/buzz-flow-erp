import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import api from "@/lib/api";

// 1. Define the shape of a single order in the recent orders array
export interface RecentOrder {
  _id: string;
  grandTotal: number;
  customer: {
    name: string;
  };
}

// 2. Define the main metrics object
export interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  lowStockCount: number;
  activeEmployeeCount: number;
  recentOrders: RecentOrder[];
}

// 3. Define the Redux State
interface DashboardState {
  metrics: DashboardMetrics | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  metrics: null,
  isLoading: false,
  error: null,
};

export const fetchDashboardMetrics = createAsyncThunk(
    "dashboard/fetchMetrics",
    async (_, { rejectWithValue }) => {
      try {
        const response = await api.get("/dashboard");
        return response.data; // Assuming the backend sends the metrics directly in the response body
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          return rejectWithValue(error.response.data.message || "Failed to fetch dashboard metrics");
        }
        return rejectWithValue("An unexpected error occurred");
      } }
);

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
      .addCase(fetchDashboardMetrics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardMetrics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;

        state.metrics = action.payload.data ? action.payload.data : action.payload; // Assuming the payload is already in the correct shape of DashboardMetrics
      })
      .addCase(fetchDashboardMetrics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    }
})

export default dashboardSlice.reducer;