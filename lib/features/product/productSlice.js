import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchProducts = createAsyncThunk('product/fetchProducts',
    async ({ storeId }, thunkAPI) => {
        try {
            const { data } = await axios.get('/api/products' + (storeId ? `?storeId=${storeId}` : ''))
            return data.products
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)

const productSlice = createSlice({
  name: "product",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    setProduct: (state, action) => {
      state.list = action.payload;
    },
    clearProduct: (state) => {
      state.list = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});


export const { setProduct, clearProduct } = productSlice.actions

export default productSlice.reducer