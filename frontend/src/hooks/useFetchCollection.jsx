import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const useFetchCollection = (api, collectionName) => {
 const [data, setData] = useState([]);
 const [isLoading, setIsLoading] = useState(false);
 const token = localStorage.getItem("token");
 async function fetchCollection() {
  setIsLoading(true);
  try {
   const res = await fetch(`${api}/api/${collectionName}`, {
    headers: {
     Authorization: `Bearer ${token}`,
    },
   });
   if (!res.ok) throw new Error(`Failed to fetch ${collectionName}`);
   const allData = await res.json();
   setData(allData);
  } catch (error) {
   toast.error(error.message || `Error fetching ${collectionName}`);
  }
  setIsLoading(false);
 }

 useEffect(() => {
  if (collectionName) {
   fetchCollection();
  }
 }, [collectionName]);

 return { data, isLoading };
};

export default useFetchCollection;
