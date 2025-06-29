import React, { useEffect, useState } from "react";
import {
 PaymentElement,
 useStripe,
 useElements,
} from "@stripe/react-stripe-js";
import CheckoutSummary from "../checkoutSummary/CheckoutSummary";
import Breadcrumbs from "../breadcrumbs/Breadcrumbs";
import Header from "../header/Header";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
// firebase
import { collection, addDoc, Timestamp } from "firebase/firestore";
// import { db } from "../../firebase/config";
//redux
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../../redux/slice/cartSlice";
import Loader from "../loader/Loader";
import axios from "axios";

const CheckoutForm = () => {
 const stripe = useStripe();
 const elements = useElements();

 const [message, setMessage] = useState(null);
 const [isLoading, setIsLoading] = useState(false);

 const navigate = useNavigate();
 const dispatch = useDispatch();
 const { email, userId } = useSelector((store) => store.auth);
 const { cartItems, totalAmount } = useSelector((store) => store.cart);
 const { shippingAddress } = useSelector((store) => store.checkout);

 // Hàm gọi backend API lưu đơn hàng
 const saveOrder = async () => {
  const dateObj = new Date();
  const orderDate = dateObj.toISOString().split("T")[0];
  const orderTime = dateObj.toTimeString().split(" ")[0];
  const orderDetails = {
   userId,
   email,
   orderDate,
   orderTime,
   orderAmount: totalAmount,
   orderStatus: "Order Placed",
   cartItems,
   shippingAddress,
   createdAt: dateObj.toISOString(),
  };
  console.log("Order Details:", orderDetails);
  try {
   const res = await axios.post(
    // "http://localhost:4242/api/orders",
    "https://aasn59g8v0.execute-api.us-east-1.amazonaws.com/dev/api/orders",
    orderDetails,
    {
     headers: { "Content-Type": "application/json" },
    }
   );

   dispatch(clearCart());
   toast.success("Order saved successfully");
  } catch (error) {
   const errorMsg =
    error.response?.data?.error || error.message || "Failed to save order";
   toast.error("Error saving order: " + errorMsg);
   throw error;
  }
 };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage(null);

  if (!stripe || !elements) return;

  setIsLoading(true);

  try {
   const res = await stripe.confirmPayment({
    elements,
    confirmParams: {
     return_url: "http://localhost:5173/checkout-success",
    },
    redirect: "if_required",
   });

   if (res.error) {
    setMessage(res.error.message);
    toast.error(res.error.message);
   } else if (res.paymentIntent && res.paymentIntent.status === "succeeded") {
    await saveOrder();
    navigate("/checkout-success", { replace: true });
   }
  } catch (error) {
   console.error(error);
   toast.error("Unexpected error: " + error.message);
  } finally {
   setIsLoading(false);
  }
 };

 useEffect(() => {
  if (!stripe) return;

  const clientSecret = new URLSearchParams(window.location.search).get(
   "payment_intent_client_secret"
  );
  if (!clientSecret) return;

  // Nếu cần xử lý gì với clientSecret thì làm ở đây
 }, [stripe]);

 return (
  <>
   <Header text="Stripe Payment Gateway" />
   <section className="w-full mx-auto p-4 md:p-10 md:w-9/12 md:px-6 flex flex-col h-full">
    <div className="flex flex-col-reverse md:flex-row gap-4 justify-evenly">
     <div className="w-full md:w-2/5 h-max p-4 bg-base-100 rounded-md shadow-xl">
      <CheckoutSummary />
     </div>
     <div className="rounded-md shadow-xl pt-4 pb-8 px-10">
      <h1 className="text-3xl font-light mb-2">Stripe Checkout</h1>
      <form className="md:w-[30rem]" onSubmit={handleSubmit}>
       <PaymentElement id="payment-element" />
       <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="btn bg-blue-600"
       >
        <span id="button-text">
         {isLoading ? (
          // <div className="spinner" id="spinner"></div>
          <Loader />
         ) : (
          "Pay now"
         )}
        </span>
       </button>
       {/* Show any error or success messages */}
       {message && <div id="payment-message">{message}</div>}
      </form>
     </div>
    </div>
   </section>
  </>
 );
};

export default CheckoutForm;
