import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import api from "@/lib/api";

export interface AttendanceRecord {
  _id: string;
  user?: string;
  date: string;
  status: "Present" | "Absent" | "halfDay" | "Leave";
  checkInTime?: string | null;
  checkOutTime?: string | null;
  company?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LeaveRequest {
  _id: string;
  user?: {
    name?: string;
  };
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
}

interface LeaveFormPayload {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
}

interface HRState {
  attendanceToday: AttendanceRecord | null;
  leaveRequests: LeaveRequest[];
  isLoading: boolean;
  error: string | null;
}

const initialState: HRState = {
  attendanceToday: null,
  leaveRequests: [],
  isLoading: false,
  error: null,
};

export const punchIn = createAsyncThunk(
  "hr/punchIn",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/hr/punch-in");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || "Failed to punch in");
      }
      return rejectWithValue("An unexpected error occurred");
    }
  },
);

export const punchOut = createAsyncThunk(
  "hr/punchOut",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/hr/punch-out");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || "Failed to punch out");
      }
      return rejectWithValue("An unexpected error occurred");
    }
  },
);

export const fetchLeaveRequests = createAsyncThunk(
  "hr/fetchLeaveRequests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/hr/all-requests");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to fetch leave requests",
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  },
);

export const applyLeave = createAsyncThunk(
  "hr/applyLeave",
  async (payload: LeaveFormPayload, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/hr/leave", payload);
      dispatch(fetchLeaveRequests());
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || "Failed to apply for leave");
      }
      return rejectWithValue("An unexpected error occurred");
    }
  },
);

export const updateLeaveStatus = createAsyncThunk(
  "hr/updateLeaveStatus",
  async (
    payload: { leaveId: string; status: "Approved" | "Rejected" },
    { dispatch, rejectWithValue },
  ) => {
    try {
      const response = await api.post(`/hr/leave/${payload.leaveId}`, {
        status: payload.status,
      });
      dispatch(fetchLeaveRequests());
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to update leave status",
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  },
);

const hrSlice = createSlice({
  name: "hr",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(punchIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(punchIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.attendanceToday = action.payload.data?.attendance || action.payload.attendance || null;
      })
      .addCase(punchIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to punch in";
      })
      .addCase(punchOut.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(punchOut.fulfilled, (state, action) => {
        state.isLoading = false;
        state.attendanceToday = action.payload.data?.attendance || action.payload.attendance || null;
      })
      .addCase(punchOut.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to punch out";
      })
      .addCase(fetchLeaveRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeaveRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        const data = action.payload.data ? action.payload.data : action.payload;
        state.leaveRequests = data.leaveRequests || data.leaves || [];
      })
      .addCase(fetchLeaveRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to fetch leave requests";
      })
      .addCase(applyLeave.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(applyLeave.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(applyLeave.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to apply for leave";
      })
      .addCase(updateLeaveStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateLeaveStatus.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateLeaveStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to update leave status";
      });
  },
});

export default hrSlice.reducer;