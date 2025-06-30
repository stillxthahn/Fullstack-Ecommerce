import React, { useEffect } from "react";
import { Header, OrdersComponent } from "../../components";

import useFetchCollection from "../../hooks/useFetchCollection";
import Loader from "../../components/loader/Loader";
import { useNavigate } from "react-router-dom";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { storeOrders } from "../../redux/slice/orderSlice";
import { formatPrice } from "../../utils/formatPrice";

const OrderHistory = () => {
 const { data, isLoading } = useFetchCollection(
  //   "http://localhost:3000",
  //   "http://d-ec-alb-1415435561.us-east-1.elb.amazonaws.com",
  "https://d-ec-alb.luongthanh.online",
  "orders"
 );
 const { orderHistory } = useSelector((store) => store.order);
 const { userId } = useSelector((store) => store.auth);
 const dispatch = useDispatch();
 const navigate = useNavigate();
 useEffect(() => {
  dispatch(storeOrders(data));
 }, [dispatch, data]);

 function handleClick(orderId) {
  navigate(`/order-details/${orderId}`);
 }
 console.log("Order History Rendered", orderHistory);
 const filteredOrders = orderHistory.filter(
  (order) => order.user_id === userId
 );
 console.log("filteredOrders History", filteredOrders);

 return (
  <>
   {isLoading && <Loader />}
   <Header text="My Orders" />
   <main className="w-full mx-auto px-2 lg:w-9/12 md:px-6 mt-6 ">
    <OrdersComponent orders={filteredOrders} user={true} admin={false} />
   </main>
  </>
 );
};

export default OrderHistory;
