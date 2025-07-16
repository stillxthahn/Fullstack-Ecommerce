import React, { useEffect, useState } from "react";
import useFetchCollection from "../../hooks/useFetchCollection";
import Loader from "../../components/loader/Loader";
import { useNavigate } from "react-router-dom";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { storeOrders } from "../../redux/slice/orderSlice";

import OrdersComponent from "../ordersComponent/OrdersComponent";

const Orders = () => {
 const { data, isLoading } = useFetchCollection(
  //   "http://localhost:3000",
  //   "http://d-ec-alb-1415435561.us-east-1.elb.amazonaws.com",
  import.meta.env.VITE_ALB,
  "orders"
 );
 const { orderHistory } = useSelector((store) => store.order);
 const { userId } = useSelector((store) => store.auth);
 const dispatch = useDispatch();
 const navigate = useNavigate();

 useEffect(() => {
  dispatch(storeOrders(data));
 }, [dispatch, data]);

 return (
  <>
   {isLoading && <Loader />}
   <h1 className="text-xl md:text-3xl font-light mb-4">ALL ORDERS</h1>
   <div>
    <OrdersComponent orders={orderHistory} user={false} admin={true} />
   </div>
  </>
 );
};

export default Orders;
