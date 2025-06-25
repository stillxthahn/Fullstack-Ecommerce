import { Link } from "react-router-dom";
// lazy load
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { formatPrice } from "../../utils/formatPrice";

const OrderTable = ({ user, order }) => {
 return (
  <div className="overflow-x-auto">
   <table className="table table-compact w-full">
    <thead>
     <tr>
      <th className="text-sm md:text-lg">Product</th>
      {user && <th className="text-sm md:text-lg">Actions</th>}
     </tr>
    </thead>
    <tbody>
     {order.cartItems.map((product, index) => {
      const { product_id, name, price, image_url, quantity } = product;
      return (
       <tr key={index}>
        <td>
         <Link to={`/product-details/${product_id}`}>
          <LazyLoadImage
           src={
            image_url ||
            `https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png`
           }
           alt={name}
           className="w-10 sm:w-24 object-fill"
           placeholderSrc="https://www.slntechnologies.com/wp-content/uploads/2017/08/ef3-placeholder-image.jpg"
           effect="blur"
          />
          <div className="md:text-lg">{name}</div>
          <div className="md:text-lg font-medium">
           Quantity:
           <span className="md:text-lg font-medium text-primary">
            {quantity}
           </span>
          </div>
          <div className="md:text-lg font-medium">
           Total:
           <span className="md:text-lg font-medium text-primary">
            {formatPrice(price * quantity)}
           </span>
          </div>
         </Link>
        </td>
        {user && (
         <td>
          <Link
           to={`/review-product/${product_id}`}
           className="border p-2 rounded-md md:text-lg"
          >
           Write a Review
          </Link>
         </td>
        )}
       </tr>
      );
     })}
    </tbody>
   </table>
  </div>
 );
};

export default OrderTable;
