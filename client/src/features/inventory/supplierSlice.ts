import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";
import axios from "axios";

// 1. The Supplier Interface
export interface Supplier {
  _id: string;
  name: string;
  contactPerson?: string;
  email: string;
  phone: string;
}

interface SupplierState {
  suppliers: Supplier[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SupplierState = {
  suppliers: [],
  isLoading: false,
  error: null,
};

// 2. Fetch Suppliers Thunk
export const fetchSuppliers = createAsyncThunk(
  "supplier/fetchSuppliers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/suppliers/");
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || "Failed to fetch suppliers");
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

// 3. Create Supplier Thunk
export const createSupplier = createAsyncThunk(
  "supplier/createSupplier",
  async (supplierData: Omit<Supplier, "_id">, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post("/suppliers/create", supplierData);
      
      // Because the backend doesn't return the new object, we trigger a re-fetch!
      dispatch(fetchSuppliers());
      
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || "Failed to create supplier");
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

// 4. The Slice
const supplierSlice = createSlice({
  name: "supplier",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- FETCH LIFECYCLE ---
      .addCase(fetchSuppliers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.isLoading = false;
        // Extract safely from the ApiResponse wrapper
        const { suppliers } = action.payload.data ? action.payload.data : action.payload;
        state.suppliers = suppliers;
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // --- CREATE LIFECYCLE ---
      .addCase(createSupplier.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSupplier.fulfilled, (state) => {
        // We just turn off loading. The fetchSuppliers thunk handles the data update!
        state.isLoading = false; 
      })
      .addCase(createSupplier.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default supplierSlice.reducer;