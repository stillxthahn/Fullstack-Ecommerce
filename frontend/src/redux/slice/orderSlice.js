import { createSlice } from "@reduxjs/toolkit";

const initialState = {
 orderHistory: [],
 totalAmount: null,
};

const orderSlice = createSlice({
 name: "orders",
 initialState,
 reducers: {
  storeOrders: (state, action) => {
   state.orderHistory = action.payload;
  },
  totalOrderAmount: (state, action) => {
   const newArray = [];
   state.orderHistory.map((item) => {
    const { order_amount } = item;
    newArray.push(order_amount);
   });
   const total = newArray.reduce(
    (total, curr) => parseFloat(total) + parseFloat(curr),
    0
   );
   state.totalAmount = total;
  },
 },
});

export const { storeOrders, totalOrderAmount } = orderSlice.actions;

export default orderSlice.reducer;
