import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Loader from "../../components/loader/Loader";
//firebase
import useFetchDocument from "../../hooks/useFetchDocument";

import OrderDetailsComponent from "../../components/orderDetailsComponent/OrderDetailsComponent";

const OrderDetails = () => {
 const [order, setOrder] = useState(null);
 const { id } = useParams();
 const { document } = useFetchDocument(
  // "http://localhost:3000",
  "http://d-ec-alb-1415435561.us-east-1.elb.amazonaws.com",
  "orders",
  id
 );

 useEffect(() => {
  setOrder(document);
 }, [document]);
 console.log(order);
 return (
  <>
   {order === null ? (
    <Loader />
   ) : (
    <div className="w-full mx-auto px-2 lg:w-9/12 md:px-6 mt-6 ">
     <OrderDetailsComponent order={order} user={true} admin={false} />
    </div>
   )}
  </>
 );
};

export default OrderDetails;
