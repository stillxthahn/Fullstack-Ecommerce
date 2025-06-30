import React, { useState } from "react";
import { toast } from "react-toastify";
import Loader from "../loader/Loader";
import { useNavigate } from "react-router-dom";
// firebase
import { doc, setDoc, Timestamp } from "firebase/firestore";
// import { db } from "../../firebase/config";

const ChangeOrderStatus = ({ order, orderId }) => {
 const [status, setStatus] = useState("");
 const [isLoading, setIsloading] = useState(false);
 const navigate = useNavigate();
 console.log("ChangeOrderStatus", order);
 const changeStatus = async (e, orderId) => {
  e.preventDefault();
  setIsloading(true);
  console.log("status", status);
  const orderDetails = {
   //    user_id: order.user_id,
   //    email: order.email,
   //    order_date: order.order_date,
   //    order_time: order.order_time,
   //    order_amount: order.order_amount,
   order_status: status,
   //    cartItems: order.cartItems,
   //    shippingAddress: order.shippingAddress,
   //    created_at: order.created_at,
   //    editedAt: new Date(), //
  };

  try {
   const token = localStorage.getItem("token");

   const res = await fetch(
    // `http://localhost:3000/api/orders/${orderId}`,
    // `http://d-ec-alb-1415435561.us-east-1.elb.amazonaws.com/api/orders/${orderId}`,
    `https://d-ec-alb.luongthanh.online/api/orders/${orderId}`,
    {
     method: "PUT",
     headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
     },
     body: JSON.stringify(orderDetails),
    }
   );

   if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to update order");
   }

   toast.success(`Order status changed to ${status}`);
   navigate("/admin/orders");
  } catch (error) {
   toast.error(error.message);
   console.error("Update error:", error);
  } finally {
   setIsloading(false);
  }
 };

 return (
  <>
   {isLoading && <Loader />}
   <div className="w-full md:w-96  p-2 rounded-sm shadow-lg">
    <h1 className="text-2xl">Update Order Status</h1>
    <form onSubmit={(e) => changeStatus(e, orderId)} className="form-control">
     <select
      value={status}
      onChange={(e) => setStatus(e.target.value)}
      className="select select-secondary w-full max-w-xs"
     >
      <option disabled>--Status---</option>
      <option value="orderPlaced">Order Placed</option>
      <option value="Processing...">Processing...</option>
      <option value="Item(s) Shipped">Item(s) Shipped</option>
      <option value="Item(s) Delivered">Item(s) Delivered</option>
     </select>
     <button type="submit" className="btn btn-primary-content btn-sm mt-2">
      Update status
     </button>
    </form>
   </div>
  </>
 );
};

export default ChangeOrderStatus;
