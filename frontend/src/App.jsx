import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import {
 AdminRoute,
 Modal,
 Navbar,
 ProductDetails,
 ProtectedRoute,
} from "./components";
import {
 Admin,
 AllProducts,
 Cart,
 Checkout,
 CheckoutDetails,
 CheckoutSuccess,
 Contact,
 Home,
 NotFound,
 OrderDetails,
 OrderHistory,
 ResetPassword,
 Review,
} from "./pages";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { removeActiveUser, setActiveUser } from "./redux/slice/authSlice";

const App = () => {
 const dispatch = useDispatch();

 useEffect(() => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
   const user = JSON.parse(userStr);
   dispatch(
    setActiveUser({
     email: user.email,
     userName: user.userName,
     userId: user.userId,
     token: localStorage.getItem("token"),
    })
   );
  } else {
   dispatch(removeActiveUser());
  }
 }, [dispatch]);
 return (
  <>
   <ToastContainer position="bottom-right" autoClose={4000} closeOnClick />
   <Navbar />
   <Routes>
    <Route path="/" element={<Home />} />
    <Route
     path="/my-orders"
     element={
      <ProtectedRoute>
       <OrderHistory />
      </ProtectedRoute>
     }
    />
    <Route path="/order-details/:id" element={<OrderDetails />} />
    <Route
     path="/review-product/:id"
     element={
      <ProtectedRoute>
       <Review />
      </ProtectedRoute>
     }
    />
    <Route path="/reset" element={<ResetPassword />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/all" element={<AllProducts />} />
    <Route path="/product-details/:id" element={<ProductDetails />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/checkout-details" element={<CheckoutDetails />} />
    <Route path="/checkout" element={<Checkout />} />
    <Route path="/checkout-success" element={<CheckoutSuccess />} />
    {/* ADMIN ROUTES */}
    <Route
     path="/admin/*"
     element={
      <AdminRoute>
       <Admin />
      </AdminRoute>
     }
    />

    {/* 404 routes */}
    <Route path="/*" element={<NotFound />} />
   </Routes>
   <Modal />
  </>
 );
};

export default App;
