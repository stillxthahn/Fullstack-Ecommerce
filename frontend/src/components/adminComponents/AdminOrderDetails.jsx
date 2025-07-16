import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Loader from "../../components/loader/Loader";
//firebase
import useFetchDocument from "../../hooks/useFetchDocument";
import OrderDetailsComponent from "../../components/orderDetailsComponent/OrderDetailsComponent";

const AdminOrderDetails = () => {
 const [order, setOrder] = useState(null);
 const { id } = useParams();
 const { document } = useFetchDocument(
  //   "http://d-ec-alb-1415435561.us-east-1.elb.amazonaws.com",
  import.meta.env.VITE_ALB,
  "orders",
  id
 );

 useEffect(() => {
  setOrder(document);
 }, [document]);

 return (
  <>
   {order === null ? (
    <Loader />
   ) : (
    <div>
     <OrderDetailsComponent
      order={order}
      user={false}
      admin={true}
      orderId={id}
     />
    </div>
   )}
  </>
 );
};

export default AdminOrderDetails;
