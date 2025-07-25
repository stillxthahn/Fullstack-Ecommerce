import React, { useState } from "react";
import { toast } from "react-toastify";
import Loader from "../loader/Loader";
import { useNavigate, useParams } from "react-router-dom";
import { categories } from "../../utils/adminProductCategories";
import { defaultValues } from "../../utils/adminAddProductDefaultValues";
import { useSelector } from "react-redux";
import axios from "axios";

//! Handle Input Changes
const AddProducts = () => {
 const navigate = useNavigate();
 const { id: paramsId } = useParams();
 const { products: reduxProducts } = useSelector((store) => store.product);
 const [file, setFile] = useState();
 const productEdit = reduxProducts.find((item) => item.id === paramsId);
 const [product, setProduct] = useState(() => {
  return detectForm(paramsId, defaultValues, productEdit);
 });
 const [uploadProgress, setUploadProgress] = useState(0);
 const [isLoading, setIsLoading] = useState(false);

 //! Check for Add or Edit
 function detectForm(paramsId, func1, func2) {
  if (paramsId === "ADD") return func1;
  return func2;
 }

 function handleInputChange(e) {
  const { name, value } = e.target;
  setProduct({ ...product, [name]: value });
 }
 //! File Upload
 function handleImageChange(e) {
  const file = e.target.files[0];
  setFile(file);
 }
 //! Add Product

 async function addProduct(e) {
  e.preventDefault();
  setIsLoading(true);
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("name", product.name);
  formData.append("price", product.price);
  formData.append("category", product.category);
  formData.append("brand", product.brand);
  formData.append("description", product.description);
  formData.append("file", file);
  try {
   await axios.post(
    `${import.meta.env.VITE_APIGW}/api/products`,
    // "http://localhost:3000/api/products/lambda",
    formData,
    {
     headers: {
      //   Accept: "*/*",
      //   "Content-Type": "multipart/form-data",
      //   Authorization: `Bearer ${token}`,
     },
     //   onUploadProgress: (e) => {
     //    const percent = (e.loaded / e.total) * 100;
     //    setUploadProgress(percent);
     //   },
    }
   );

   setUploadProgress(0);
   setProduct(defaultValues);
   toast.success("Product added successfully");
   navigate("/admin/all-products");
  } catch (error) {
   console.error(error.response?.data || error.message);
   toast.error("Something went wrong. Check console.");
  } finally {
   setIsLoading(false);
  }
 }

 //! Edit Product
 async function editProduct(e) {
  e.preventDefault();
  setIsLoading(true);
  // Check if the image is updated
  if (product.imageURL !== productEdit.imageURL) {
   // deleting image from database storage
   const storageRef = ref(storage, productEdit.imageURL);
   //  await deleteObject(storageRef);
  }
  try {
   await setDoc(doc(db, "products", paramsId), {
    name: product.name,
    imageURL: product.imageURL,
    price: Number(product.price),
    category: product.category,
    brand: product.brand,
    description: product.description,
    // Preserving created at
    createdAt: productEdit.createdAt,
    editedAt: Timestamp.now().toDate(),
   });
   setUploadProgress(0);
   setProduct(defaultValues);
   setIsLoading(false);
   toast.success("Product Updated Successfully");
   navigate("/admin/all-products");
  } catch (error) {
   console.log(error.message);
   toast.error("Something Went Wrong , Check Console");
   setIsLoading(false);
  }
 }
 //! Disable button until everything added to input fields
 const AllFieldsRequired =
  Boolean(product.brand) &&
  Boolean(product.category) &&
  Boolean(product.description) &&
  Boolean(file) &&
  Boolean(product.name) &&
  Boolean(product.name);

 return (
  <>
   {isLoading && <Loader />}

   <main className="h-full border-r-2 p-1">
    <h1 className="text-xl md:text-3xl font-semibold pb-3">
     {detectForm(paramsId, "Add New Product", "Edit Product")}
    </h1>
    <form
     className="form-control"
     onSubmit={detectForm(paramsId, addProduct, editProduct)}
    >
     <div className="py-2">
      <label className="label-text font-bold mb-2 block text-lg">
       Product Name:
      </label>
      <input
       className="input input-bordered max-w-lg w-full border-2"
       type="text"
       placeholder="Product Name"
       required
       name="name"
       value={product.name}
       onChange={handleInputChange}
      />
     </div>

     <div className="py-2">
      <label className="label-text font-bold mb-2 block text-lg">
       Product Price:{" "}
      </label>
      <input
       className="input input-bordered max-w-lg w-full border-2"
       type="number"
       placeholder="Product Price"
       required
       name="price"
       value={product.price}
       onChange={handleInputChange}
      />
     </div>
     <div className="py-2">
      <label className="label-text font-bold mb-2 block text-lg">
       Product Category:
      </label>
      <select
       className="select select-bordered w-full max-w-lg"
       required
       name="category"
       value={product.category}
       onChange={handleInputChange}
      >
       <option disabled value="">
        -- Choose a Product Category --
       </option>
       {categories.map((c) => {
        return (
         <option key={c.id} value={c.name}>
          {c.name}
         </option>
        );
       })}
      </select>
     </div>
     <div className="py-2">
      <label className="label-text font-bold mb-2 block text-lg">
       Product Brand:{" "}
      </label>
      <input
       className="input input-bordered max-w-lg w-full border-2"
       type="text"
       placeholder="Product Brand"
       required
       name="brand"
       value={product.brand}
       onChange={handleInputChange}
      />
     </div>
     <div className="py-2">
      <label className="label-text font-bold mb-2 block text-lg">
       Product Description:{" "}
      </label>
      <textarea
       className="textarea textarea-bordered h-32 max-w-lg w-full"
       type="text"
       placeholder="Product Description"
       required
       name="description"
       value={product.description}
       onChange={handleInputChange}
      ></textarea>
     </div>
     <div>
      <label className="label-text font-bold mb-2 block text-lg">
       Product Image:{" "}
      </label>
      <div className="border-2 rounded-sm  max-w-xl w-full px-4 pb-2">
       <div>
        <progress
         className="progress progress-primary w-44 md:w-72 xl:w-full"
         value={uploadProgress}
         max="100"
        ></progress>
       </div>
       <input
        className="max-w-lg w-full"
        accept="image/all"
        type="file"
        placeholder="IMAGE URL"
        name="image"
        onChange={handleImageChange}
       />
       {/* {product.imageURL === "" ? null : (
                                <input
                                    className="input input-sm input-bordered max-w-lg w-full my-2"
                                    type="text"
                                    value={product.imageURL}
                                    required
                                    placeholder="Image URL"
                                    disabled
                                />
                            )} */}
      </div>
     </div>

     <button
      type="submit"
      className="btn btn-primary text-lg max-w-[200px]  mt-2"
      disabled={!AllFieldsRequired}
     >
      {detectForm(paramsId, "Add Product", "Update Product")}
     </button>
    </form>
   </main>
  </>
 );
};

export default AddProducts;
