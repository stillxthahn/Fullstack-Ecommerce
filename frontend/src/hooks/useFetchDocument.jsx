import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const useFetchDocument = (api, collectionName, documentId) => {
 const [document, setDocument] = useState(null);
 const [isLoading, setIsLoading] = useState(false);
 const token = localStorage.getItem("token");
 const getDocument = async () => {
  setIsLoading(true);
  try {
   const res = await fetch(`${api}/api/${collectionName}/${documentId}`, {
    headers: {
     Authorization: `Bearer ${token}`,
    },
   });
   if (!res.ok) throw new Error(`Failed to fetch document: ${documentId}`);
   const data = await res.json();
   setDocument({ id: documentId, ...data });
  } catch (error) {
   toast.error(error.message || "Error fetching document");
  }
  setIsLoading(false);
 };

 useEffect(() => {
  if (collectionName && documentId) {
   getDocument();
  }
 }, [collectionName, documentId]);

 return { document, isLoading };
};

export default useFetchDocument;
