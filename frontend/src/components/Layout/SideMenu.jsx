import React, { useContext } from "react";
import { SIDE_MENU_DATA } from "../../Utils/data";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import CharAvtar from "../Cards/CharAvtar";

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
 

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border border-r border-gray-200/50 backdrop-blur-[2px] py-5 sticky top-[61px] z-20 px-3">
      <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
        {user?.profileImageUrl ? (
          <img
            src={user.profileImageUrl  }
            alt="Profile"
            className="w-20 h-20 bg-slate-400 rounded-full object-cover"
          />
        ) : (
          <CharAvtar className="" fullName={user?.fullName } width="w-20" height="h-20" style="text-xl " />
        )}
        <h5 className="text-gray-950 font-medium leading-6">
          {user?.fullName || ""}
        </h5>
      </div>
      {SIDE_MENU_DATA.map((item, index) => (
        <button
          key={`menu_${index}`}
          onClick={() => handleClick(item.path)}
          className={`flex w-full items-center curpo gap-4  cursor-pointer text-[15px] py-3 px-6 rounded-lg mb-3 ${
            activeMenu === item.label
              ? "bg-primary text-white"
              : "text-gray-700"
          }`}
        >
          <item.icon className="text-xl" />
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default SideMenu;
