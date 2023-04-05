import React, { useState } from "react";
import { NavLink, useLocation, Link, useNavigate } from "react-router-dom";

const Navbar = (props) => {
  let navigate = useNavigate();
  const logout = async () => {
    sessionStorage.removeItem("loggedin");
    props.setSession(props.__init_session);
    navigate("/login");
  };

  return (
    <nav class={`bg-black  z-50 h-[5rem]`}>
      <div class="container mx-auto px-4 py-4 md:flex md:items-center md:justify-between">
        <div class="flex items-center justify-between">
          <Link to="/">
            <h1 class="text-2xl text-white font-bold">
              <span className="" style={{ color: "#FA4D83" }}>
                Aid
              </span>
              Fusion
            </h1>
          </Link>
          <button class="md:hidden text-gray-400 hover:text-white focus:outline-none">
            <svg class="h-6 w-6 fill-current" viewBox="0 0 24 24">
              <path
                fill-rule="evenodd"
                d="M3 18h18v-2H3v2zM3 13h18v-2H3v2zM3 6v2h18V6H3z"
              ></path>
            </svg>
          </button>
        </div>

        <div class="hidden md:flex items-center">
          {!props?.isLoggedIn ? (
            <>
              <button
                onClick={() => navigate("/login")}
                type="button"
                class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-base w-32 py-2.5 mr-4"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                type="button"
                class="text-white bg-blue-500 transition-all ease-in-out duration-300 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-base w-32 py-2.5"
              >
                Register
              </button>
            </>
          ) : (
            <>
              <div className="flex flex-col mr-5">
                <span className="text-white">@{props.username}</span>
                <span className="text-white capitalize">{props.role}</span>
              </div>
              <button
                onClick={() => logout()}
                type="button"
                class="text-white bg-red-600 border border-red-500 focus:outline-none hover:bg-red-500 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-base w-32 py-2.5"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
