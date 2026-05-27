import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import api from "../../lib/api";
import axios from "axios";

export interface DraftOrderItem {
  product: string;
  name : string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  createdAt: string;
  customer?: {
    name?: string;
  };
  items?: Array<{
    product?: string;
    quantity?: number;
  }>;
  totalAmount?: number;
}

interface OrderState {
  orders: Order[];
  draftItems: DraftOrderItem[];
  isLoading: boolean;
  error: string | null;
}

export const fetchOrders = createAsyncThunk(
  "order/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/orders/");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to fetch orders",
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  },
);

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (
    orderData: { customerId: string; draftItems: DraftOrderItem[] },
    { rejectWithValue },
  ) => {
    try {
      const payload = {
        customer: orderData.customerId,
        items: orderData.draftItems.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        })),
      };

      const response = await api.post("/orders/create", payload);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to create order",
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  });

const initialState: OrderState = {
  orders: [],
  draftItems: [],
  isLoading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    addOrderItem: (state, action: PayloadAction<DraftOrderItem>) => {
      const existingItem = state.draftItems.find(item => item.product === action.payload.product);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.draftItems.push(action.payload);
      }
    },

    removeOrderItem: (state, action: PayloadAction<string>) => {
      state.draftItems = state.draftItems.filter(item => item.product !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        const { orders } = action.payload.data ? action.payload.data : action.payload;
        state.orders = orders;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to fetch orders";
      })
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        state.draftItems = [];
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || action.error.message || "Failed to create order";
      });
  },
});

export const { addOrderItem, removeOrderItem } = orderSlice.actions;
export default orderSlice.reducer;