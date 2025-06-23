// handler.js
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
 const body = JSON.parse(event.body);
 const { items, shippingAddress, description } = body;

 const totalAmount = items.reduce(
  (total, item) => total + item.price * item.qty,
  0
 );

 // Tạo PaymentIntent
 const paymentIntent = await stripe.paymentIntents.create({
  amount: totalAmount * 100,
  currency: "inr",
  automatic_payment_methods: { enabled: true },
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
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
 };
};
