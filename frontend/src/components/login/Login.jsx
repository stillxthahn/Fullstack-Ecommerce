import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../loader/Loader";
import { useDispatch } from "react-redux";
import { setActiveUser } from "../../redux/slice/authSlice";

const Login = () => {
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [showPassword, setShowPassword] = useState(false);
 const [isLoading, setIsLoading] = useState(false);
 const navigate = useNavigate();
 const dispatch = useDispatch();
 const handleSubmit = async (e) => {
  e.preventDefault();
  document.getElementById("my-modal-4").checked = false;
  setIsLoading(true);

  try {
   const res = await fetch(
    // "http://localhost:3000/api/auth/login",
    // "http://d-ec-alb-1415435561.us-east-1.elb.amazonaws.com/api/auth/login",
    `${import.meta.env.VITE_ALB}/api/auth/login`,
    {
     method: "POST",
     headers: {
      "Content-Type": "application/json",
     },
     body: JSON.stringify({ email, password }),
    }
   );
   console.log(res.status);
   if (res.status === 200) {
    const data = await res.json();
    console.log("Login response:", data);
    if (data.token && data.user) {
     dispatch(
      setActiveUser({
       email: data.user.email,
       userName: data.user.userName || data.user.email.split("@")[0],
       userId: data.user.id,
       token: data.token,
      })
     );
     toast.success("Login successful");
     navigate("/");
    }
   } else {
    toast.error(res.json().message || "Login failed");
   }
  } catch (err) {
   console.error("Login error:", err);
   toast.error("Server error");
  }

  setIsLoading(false);
  setEmail("");
  setPassword("");
 };

 const AllFieldsRequired = Boolean(email) && Boolean(password);

 return (
  <>
   {isLoading && <Loader />}
   <div className="py-6 ">
    <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-4xl">
     <div className="w-full px-8 pt-4 pb-6">
      <p className="text-xl text-gray-600 text-center">Welcome back</p>
      <div className="divider text-xs text-gray-400 uppercase">
       or login with email
      </div>
      <form className="form-control" onSubmit={handleSubmit}>
       <div>
        <label className="label-text font-bold mb-2 block">Email Address</label>
        <input
         className="input input-bordered w-full border-2"
         type="email"
         required
         value={email}
         onChange={(e) => setEmail(e.target.value)}
        />
       </div>
       <div className="mt-4 relative">
        <div className="flex justify-between">
         <label className="label-text font-bold mb-2">Password</label>
         <Link
          to="/reset"
          className="text-xs text-gray-500"
          onClick={() =>
           (document.getElementById("my-modal-4").checked = false)
          }
         >
          Forget Password?
         </Link>
        </div>
        <input
         className="input input-bordered w-full border-2 "
         type={`${showPassword ? "test" : "password"}`}
         required
         value={password}
         onChange={(e) => setPassword(e.target.value)}
        />
        <span onClick={() => setShowPassword((prev) => !prev)}>
         {showPassword ? (
          <AiFillEye
           className="absolute top-10 right-3 "
           size={26}
           color="gray"
          />
         ) : (
          <AiFillEyeInvisible
           className="absolute top-10 right-3 "
           size={26}
           color="gray"
          />
         )}
        </span>
       </div>
       <div className="mt-4 w-full flex flex-col items-center justify-center">
        <button
         type="submit"
         className="btn w-full"
         disabled={!AllFieldsRequired}
        >
         Login
        </button>

        {/* The button to open modal */}
        {/* <label
                  onClick={testLogin}
                  htmlFor="my-modal-69"
                  className="btn btn-info btn-sm mt-2"
                >
                  Test User
                </label> */}

        {/* Put this part before </body> tag */}
        <input type="checkbox" id="my-modal-69" className="modal-toggle" />
        <label htmlFor="my-modal-69" className="modal cursor-pointer">
         <label className="modal-box relative" htmlFor="">
          <h3 className="text-lg font-bold">
           SORRY, this feature is currently Disabled due to Spamming
          </h3>
          <p className="py-4">
           Still wanna test the app ? contact <br />
           <a
            href="mailto: kartikpavan2@gmail.com"
            className="text-red-500 font-semibold"
           >
            kartikpavan2@gmail.com
           </a>
          </p>
         </label>
        </label>
       </div>
      </form>
     </div>
    </div>
   </div>
  </>
 );
};

export default Login;
