import { doc, getDoc } from "firebase/firestore";
import Breadcrumbs from "../breadcrumbs/Breadcrumbs";
import { Link, useParams } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";
import Loader from "../loader/Loader";
import ReviewComponent from "../review/ReviewComponent";
// Custom Hook
import useFetchCollection from "../../hooks/useFetchCollection";
//Lazy Load
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
// Firebase
import { useEffect, useState } from "react";
// import { db } from "../../firebase/config";
// Redux
import { useDispatch, useSelector } from "react-redux";
import {
 addToCart,
 decreaseCart,
 calculateTotalQuantity,
} from "../../redux/slice/cartSlice";

const ProductDetails = () => {
 const { cartItems } = useSelector((store) => store.cart);
 const [product, setProduct] = useState({});
 const [reviews, setReviews] = useState([]);
 const [isLoading, setIsLoading] = useState(false);
 const { id } = useParams();
 const dispatch = useDispatch();

 // Fetch product details from backend
 async function fetchProduct() {
  console.log("Fetching product with ID:", id);
  setIsLoading(true);
  try {
   const res = await fetch(
    // `http://localhost:3000/api/products/${id}`
    // `http://d-ec-alb-1415435561.us-east-1.elb.amazonaws.com/api/products/${id}`
    `${import.meta.env.VITE_ALB}/api/products/${id}`
   );
   if (!res.ok) throw new Error("Failed to fetch product");
   const data = await res.json();
   setProduct(data);
  } catch (error) {
   toast.error(error.message);
  }
  setIsLoading(false);
 }

 // Fetch reviews for product
 async function fetchReviews() {
  try {
   const res = await fetch(
    // `http://localhost:3000/api/reviews?productId=${id}`
    // `http://d-ec-alb-1415435561.us-east-1.elb.amazonaws.com/api/reviews?productId=${id}`
    `${import.meta.env.VITE_ALB}/api/reviews?productId=${id}`
   );
   if (!res.ok) throw new Error("Failed to fetch reviews");
   const data = await res.json();
   setReviews(data);
  } catch (error) {
   toast.error(error.message);
  }
 }

 useEffect(() => {
  fetchProduct();
  //   fetchReviews();
 }, [id]);
 console.log("Product Details Rendered", product);
 // Cart handlers
 function add2CartFunction(product) {
  dispatch(addToCart({ ...product, id }));
  dispatch(calculateTotalQuantity());
 }
 function decreaseQty(product) {
  dispatch(decreaseCart({ ...product, id }));
  dispatch(calculateTotalQuantity());
 }

 // Check if product is in cart
 let currentItem = cartItems.find((item) => item.id === id);
 if (isLoading) return <p>Loading...</p>;
 if (!product) return <p>Product not found</p>;

 return (
  <>
   {isLoading && <Loader />}
   <Breadcrumbs type={product.name} />
   <section className="w-full mx-auto p-4 md:p-10 lg:w-9/12 md:px-6 ">
    <h1 className="text-2xl font-semibold">Product Details </h1>
    <Link to="/all" className="link ">
     &larr; Back to All Products
    </Link>
    <article className="flex flex-col md:flex-row items-start justify-between py-4 gap-x-4">
     <div className=" w-full md:w-1/3 flex items-center justify-center border-2">
      <LazyLoadImage
       src={product.imageURL}
       alt={product.name}
       className="w-96 h-96 object-contain "
       placeholderSrc="https://www.slntechnologies.com/wp-content/uploads/2017/08/ef3-placeholder-image.jpg"
       effect="blur"
      />
     </div>
     <div className="flex-1">
      <h1 className="text-3xl  mb-2">{product.name}</h1>
      <h2 className="text-primary  px-2 py-2 max-w-max  font-bold text-lg md:text-2xl mb-2">
       {formatPrice(product.price)}
      </h2>
      <p className="text-gray-500 mb-2">{product.description}</p>
      <p className="font-semibold mb-2">
       SKU : <span className="font-light">{id}</span>
      </p>
      <p className="font-semibold mb-2">
       Brand : <span className="font-light">{product.brand}</span>
      </p>
      {/* Button Group */}
      {cartItems.includes(currentItem) && (
       <div className="btn-group items-center mb-2">
        <button
         className="btn btn-sm btn-outline"
         onClick={() => decreaseQty(product)}
        >
         {" "}
         -
        </button>
        <button className="btn btn-lg btn-ghost disabled">
         {currentItem.qty}
        </button>
        <button
         className="btn btn-sm btn-outline"
         onClick={() => add2CartFunction(product)}
        >
         +
        </button>
       </div>
      )}

      <div>
       <button
        className="btn btn-primary btn-active"
        onClick={() => add2CartFunction(product)}
       >
        Add to Cart
       </button>
      </div>
     </div>
    </article>
    <section className="rounded-md shadow-lg">
     <div className=" w-full ">
      <h1 className="text-lg md:text-2xl font-semibold mt-2 p-2">Reviews</h1>
     </div>
     {/* {!filteredReview.length ? (
      <p className="p-4">
       <Link to={`/review-product/${id}`} className="link link-primary ">
        Be the first one to review this product
       </Link>
      </p>
     ) : (
      <div className="flex flex-col gap-4 p-2 ">
       {filteredReview.map((review, index) => {
        return <ReviewComponent review={review} key={index} />;
       })}
      </div>
     )} */}
    </section>
   </section>
  </>
 );
};

export default ProductDetails;
