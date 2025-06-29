import React, { useState, useEffect } from "react";
import Loader from "../../components/loader/Loader";
import { CheckoutForm } from "../../components";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import "./stripe.css";
// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
//Redux
import { useSelector, useDispatch } from "react-redux";
import {
 calculateSubtotal,
 calculateTotalQuantity,
} from "../../redux/slice/cartSlice";
import { formatPrice } from "../../utils/formatPrice";

const Checkout = () => {
 // Redux states
 const { cartItems, totalQuantity, totalAmount } = useSelector(
  (store) => store.cart
 );
 const { shippingAddress, billingAddress } = useSelector(
  (store) => store.checkout
 );
 const { email } = useSelector((store) => store.auth);
 const dispatch = useDispatch();
 useEffect(() => {
  dispatch(calculateSubtotal());
  dispatch(calculateTotalQuantity());
 }, [dispatch, cartItems]);

 // local States
 const [clientSecret, setClientSecret] = useState("");

 const description = `Payment of ${formatPrice(totalAmount)} from ${email}`;
 useEffect(() => {
  const createPaymentIntent = async () => {
   try {
    const response = await axios.post(
     "https://aasn59g8v0.execute-api.us-east-1.amazonaws.com/dev/api/payments",
     {
      items: cartItems,
      userEmail: email,
      shippingAddress,
      billingAddress,
      description,
     },
     {
      headers: {
       "Content-Type": "application/json",
      },
     }
    );

    setClientSecret(response.data.clientSecret);
   } catch (error) {
    console.error("Error creating payment intent:", error);
   }
  };

  createPaymentIntent();
 }, []);

 const appearance = {
  theme: "stripe",
 };
 const options = {
  clientSecret,
  appearance,
 };
 return (
  <main>
   {/* {!clientSecret && <h3 className="text-2xl text-red-500">{message} </h3>} */}
   {!clientSecret && <Loader />}
   <div>
    {clientSecret && (
     <Elements options={options} stripe={stripePromise}>
      <CheckoutForm />
     </Elements>
    )}
   </div>
  </main>
 );
};

export default Checkout;
