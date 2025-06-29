const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const newArray = [];
const calculateOrderAmount = (items) => {
 items.map((item) => {
  const { price, qty } = item;
  const totalItemAmount = price * qty;
  return newArray.push(totalItemAmount);
 });
 const totalCartAmount = newArray.reduce((total, curr) => total + curr, 0);
 return totalCartAmount * 100;
};

exports.handler = async (event) => {
 try {
  const headers = {
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Headers": "*",
   "Access-Control-Allow-Methods": "*",
  };

  if (event.httpMethod === "OPTIONS") {
   return {
    statusCode: 200,
    headers,
    body: JSON.stringify({}),
   };
  }

  const body = JSON.parse(event.body);
  const { items, shippingAddress, description } = body;

  const paymentIntent = await stripe.paymentIntents.create({
   amount: calculateOrderAmount(items),
   currency: "inr",
   automatic_payment_methods: {
    enabled: true,
   },
   description,
   shipping: {
    address: {
     line1: shippingAddress.line1,
     line2: shippingAddress.line2,
     city: shippingAddress.city,
     country: shippingAddress.country,
    },
    name: shippingAddress.name,
    phone: shippingAddress.phone,
   },
  });

  return {
   statusCode: 200,
   headers,
   body: JSON.stringify({
    clientSecret: paymentIntent.client_secret,
   }),
  };
 } catch (error) {
  console.error("Stripe error:", error);
  return {
   statusCode: 500,
   body: JSON.stringify({
    error: "Payment creation failed",
    message: error.message,
   }),
  };
 }
};
