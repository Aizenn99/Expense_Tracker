import React, { useContext, useState } from "react";
import AuthLayout from "../../components/Layout/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/inputs/Input";
import ProfilePhotoSelector from "../../components/inputs/ProfilePhotoSelector";
import { validateEmail } from "../../Utils/helper";
import axiosInstance from "../../Utils/axiosinstance";
import { API_PATH } from "../../Utils/apipath";
import { UserContext } from "../../context/userContext";
import uploadImage from "../../Utils/uploadImage";

const SignUp = () => {
  const [profilePic, setprofilePic] = useState(null);
  const [fullName, setfullName] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [error, seterror] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  //handle SignUp  form Submit

  const handleSignUp = async (e) => {
    e.preventDefault();
    let profileImageUrl = "";
    if (!fullName) {
      seterror("Please Enter Your Name");
      return;
    }
    if (!validateEmail(email)) {
      seterror("Enter Valid Email Address");
      return;
    }
    if (!password) {
      seterror("Please Enter Valid Password");
      return;
    }
    seterror("");

    try {
      //Upload image if present
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes;
      }

      const response = await axiosInstance.post(API_PATH.AUTH.REGISTER, {
        fullName,
        email,
        password,
        profileImageUrl,
      });

      const { token, user } = response.data;
      if (token && user) {
        updateUser(user);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response.status === 400) {
        seterror(error.response.data.message);
      } else {
        seterror("Some error occured");
      }
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col  justify-center">
        <h3 className="text-xl font-semibold text-black ">Create An Account</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6 ">
          Enter Your Details Below
        </p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setprofilePic} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 ">
            <Input
              value={fullName}
              onChange={({ target }) => setfullName(target.value)}
              label="Full Name"
              placeholder="het"
              type="text"
            />
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
          </div>
          {error && <p className="text-red-500 text-xs pb-2.5  ">{error}</p>}
          <button type="submit" className="btn-primary">
            SIGN UP
          </button>
          <p className="text-[13px] text-slate-800 mt-3  ">
            Already have an account ?
            <Link to={"/login"} className="text-primary underline ml-2">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
