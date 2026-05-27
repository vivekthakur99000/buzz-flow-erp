import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../../features/auth/authSlice'
import dashboardReducer from '../../features/dashboard/dashboardSlice'
import inventoryReducer from "../../features/inventory/inventorySlice"
import supplierReducer from "../../features/inventory/supplierSlice"
import orderReducer from "../../features/sales/orderSlice"
import customerReducer from "../../features/sales/customerSlice"


export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    inventory : inventoryReducer,
    supplier : supplierReducer,
    order : orderReducer,
    customer : customerReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch