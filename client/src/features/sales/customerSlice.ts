import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import api from "@/lib/api";

export interface Customer {
  _id: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  gstNumber?: string;
  supportNotes?: string;
}

interface CustomerState {
  customers: Customer[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CustomerState = {
  customers: [],
  isLoading: false,
  error: null,
};

export const fetchCustomers = createAsyncThunk(
  "customer/fetchCustomers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/customers/");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to fetch customers",
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  },
);

export const createCustomer = createAsyncThunk(
  "customer/createCustomer",
  async (
    customerData: Omit<Customer, "_id">,
    { dispatch, rejectWithValue },
  ) => {
    try {
      const response = await api.post("/customers/add", customerData);
      dispatch(fetchCustomers());
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to create customer",
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  },
);

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.isLoading = false;
        const { customers } = action.payload.data ? action.payload.data : action.payload;
        state.customers = customers;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createCustomer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default customerSlice.reducer;