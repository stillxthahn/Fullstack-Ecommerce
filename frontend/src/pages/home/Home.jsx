import React, { useEffect } from "react";
import { Hero } from "../../components";
// custom Hook
import useFetchCollection from "../../hooks/useFetchCollection";
// Redux
import { useDispatch } from "react-redux";
import { storeProducts, getPriceRange } from "../../redux/slice/productSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const Home = () => {
 const { data } = useFetchCollection("products");
 const dispatch = useDispatch();
 const navigate = useNavigate();
 const { email } = useSelector((store) => store.auth);
 console.log("Email:", email);
 console.log(import.meta.env.VITE_ADMIN_KEY);
 if (email === import.meta.env.VITE_ADMIN_KEY) navigate("/admin/home");
 useEffect(() => {
  dispatch(storeProducts({ products: data }));
  dispatch(getPriceRange({ products: data }));
 }, [dispatch, data]);

 return (
  <div>
   <Hero />
  </div>
 );
};

export default Home;
