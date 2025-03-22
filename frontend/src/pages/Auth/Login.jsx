import React, { useContext, useState } from "react";
import AuthLayout from "../../components/Layout/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/inputs/Input";
import { validateEmail } from "../../Utils/helper";
import axiosInstance from "../../Utils/axiosinstance";
import { API_PATH } from "../../Utils/apipath";
import { UserContext } from "../../context/userContext";

const Login = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { updateUser } = useContext(UserContext);

  const handleLogin = async (e) => {
    console.log("prevent default", e);

    e.preventDefault();

    setError(""); // Clear previous errors
    setLoading(true); // Show loading state

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (!password) {
      setError("Please enter a valid password.");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post(API_PATH.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, user } = response.data;

      if (token && user) {
        updateUser(user);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        navigate("/dashboard");
      } else {
        setError("Login failed. Please try again.");
        console.error("Token or user data missing from API response");
      }
    } catch (error) {
      if (error.response) {
        // API returned an error response
        if (error.response.status === 401) {
          setError(error.response.data.message);
        } else if (error.response.status === 500) {
          setError(error.response.data.message);
        } else {
          setError(error.response.data?.message || "Login failed.");
        }
      } else if (error.request) {
        // No response from server
        setError("Network error. Please check your connection.");
      } else {
        // Other errors
        setError("Something went wrong. Please try again.");
      }
      console.error("Login error:", error);
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  //Api call

  return (
    <AuthLayout>
      <div className="lg:w-[70%]  h-3/4 md:h-full flex flex-col  justify-center ">
        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-[5px]  mb-6 ">
          Enter Your Login details
        </p>
        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={({ target }) => setemail(target.value)}
            label="Email Address"
            placeholder="het@example.com"
            type="text"
          />
          <Input
            value={password}
            onChange={({ target }) => setpassword(target.value)}
            label="Password"
            placeholder="Min 6 Characters"
            type="password"
          />
          {error && <p className="text-red-500 text-xs pb-2.5  ">{error}</p>}
          <button type="submit" className="btn-primary">
            LOGIN
          </button>
          <p className="text-[13px] text-slate-800 mt-3  ">
            Don't Have An Account ?
            <Link to={"/signup"} className="text-primary underline ml-2">
              SignUp
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
