import api from "@/lib/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface Product {
  _id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
}


export interface Pagination {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  limit: number;
}

interface InventoryState {
  products: Product[];
  pagination: Pagination | null;
  isLoading: boolean;
  error: string | null;
}

const initialState : InventoryState = {
    products :[],
    pagination : null,
    isLoading : false,
    error : null
}

const fetchProducts = createAsyncThunk(
    "inventory/get-products",
    async(params : {page : number; limit : number; search? : string}, {rejectWithValue}) => {
        try {
            const res = await api.get("/products/", {params})
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data.message || 'Login failed');
    }
    return rejectWithValue('An unexpected error occurred');
        }
    }
)

const createProduct = createAsyncThunk(
    "inventory/create-product",
    async(ProductFormValues : { name: string, sku: string, price: number, stock: number, lowStockThreshold: number }, {rejectWithValue}) => {
        try {

            const response = await api.post("/products/", ProductFormValues);
            const product = response.data?.product ?? response.data?.data?.product;

            if (!product) {
                return rejectWithValue("Invalid product response from server");
            }

            return product;
            
        }
        catch(error){  if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data.message || 'creation failed');
    }
    return rejectWithValue('An unexpected error occurred');
}
    })
    


const inventorySlice = createSlice({
    name : "inventory",
    initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder
        .addCase(fetchProducts.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(fetchProducts.fulfilled, (state, action) => {
            const {products, pagination} = action.payload.data ? action.payload.data : action.payload;
            state.isLoading = false;
            state.error = null;
            state.products = products;
            state.pagination = pagination;
        })
        .addCase(fetchProducts.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string || "Products fetch failed";
        })
        .addCase(createProduct.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(createProduct.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.products.unshift(action.payload);
        })
        .addCase(createProduct.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string || "Failed creating product";
        })
    }
})


// Export the async thunk and the reducer
export { fetchProducts, createProduct };
export default inventorySlice.reducer;
