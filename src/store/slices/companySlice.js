import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCompanyByIdAPI } from "../../services/handleApi";

const initialState = {
  company: null,
  loading: false,
  error: null,
};

export const fetchCompany = createAsyncThunk(
  "company/fetchCompany",
  async (id) => {
    try {
      const response = await getCompanyByIdAPI(id);
      return response;
    } catch (error) {
      console.error("Error fetching company:", error);
      throw error;
    }
  }
);

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCompany.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCompany.fulfilled, (state, action) => {
      state.loading = false;
      state.company = action.payload;
    });
    builder.addCase(fetchCompany.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export default companySlice.reducer;
