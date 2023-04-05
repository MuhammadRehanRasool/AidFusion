import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  setMessage,
  CONSTANT,
  resetMessage,
  checkLoginFromLogin,
} from "../CONSTANT";

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

export default function Register() {
  let navigate = useNavigate();
  useEffect(() => {
    if (checkLoginFromLogin()) {
      navigate("/");
    }
  }, []);
  const __INIT__ = {
    role: "acceptor",
    username: "",
    address: "",
    password: "",
  };
  const [credentials, setCredentials] = useState(__INIT__);
  const changeCredentials = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };
  const register = async (e) => {
    e.target.style.pointerEvents = "none";
    e.target.innerHTML =
      '<div className="spinner-border custom-spin" role="status"><span className="visually-hidden">Loading...</span></div>';
    e.preventDefault();
    resetMessage();
    if (credentials.username !== "") {
      if (credentials.address !== "") {
        if (credentials.password !== "") {
          if (credentials.role !== "") {
            await axios
              .post(CONSTANT.server + "user", {
                ...credentials,
              })
              .then((responce) => {
                let res = responce.data;
                if (res.message) {
                  setMessage(res.message, "red-500");
                } else {
                  sessionStorage.setItem(
                    "loggedin",
                    JSON.stringify({
                      data: res,
                    })
                  );
                  navigate("/");
                }
              })
              .catch((error) => {
                console.log(error);
              });
          } else {
            setMessage("Please enter your role.", "red-500");
          }
        } else {
          setMessage("Please enter your password.", "red-500");
        }
      } else {
        setMessage("Please enter your valid address.", "red-500");
      }
    } else {
      setMessage("Please enter your national CNIC number.", "red-500");
    }
    e.target.style.pointerEvents = "unset";
    e.target.innerHTML = "Register";
  };
  return (
    <>
      <section className="h-screen bg-gray-100 dark:bg-[#1A1A40]">
        <img
          src={
            "https://media.istockphoto.com/id/1199706305/photo/friends-linking-arms-in-unity.jpg?s=612x612&w=0&k=20&c=sOHOOdPG5hcNdD9BWC5vzRvRE_wS43usvWGaJLCUhu8="
          }
          className="absolute w-screen h-screen object-cover"
          alt=""
        />
        <div className=" px-6 py-12 h-full">
          <div className="flex justify-center items-center flex-wrap h-full g-6 text-gray-800 ">
            <div className="w-120 p-6 bg-white shadow rounded text-gray-800  dark:bg-dimBlue relative z-30 ">
              <img src="logo.png" className="w-40 mx-auto" />
              <h1 className="mb-2 text-gray-800 text-center text-2xl font-semibold py-5 dark:text-gray-50 items-center flex justify-center">
                <Link to="/" className="mr-3">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className="w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                    ></path>
                  </svg>
                </Link>
                Register Yourself!
              </h1>

              <div className="w-[30rem]">
                <div className="mb-3">
                  <select
                    value={credentials.role}
                    onChange={changeCredentials}
                    name="role"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option selected value={""}>
                      Choose Role
                    </option>
                    <option value="acceptor">Acceptor</option>
                    <option value="donor">Donor</option>
                  </select>
                </div>
                <div className="mb-3">
                  <input
                    type="number"
                    className="form-control block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white  dark:bg-dimBlue  dark:text-gray-50 focus:border-blue-600 focus:outline-none"
                    placeholder="National CNIC Number"
                    name="username"
                    value={credentials.username}
                    onChange={changeCredentials}
                  />
                </div>
                <div className="mb-3">
                  <PlacesAutocomplete
                    payload={credentials}
                    setPayload={setCredentials}
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white  dark:bg-dimBlue  dark:text-gray-50 focus:border-blue-600 focus:outline-none"
                    placeholder="Password"
                    name="password"
                    value={credentials.password}
                    onChange={changeCredentials}
                  />
                </div>

                <button
                  onClick={register}
                  className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-3  dark:bg-dimBlue  dark:text-gray-50 uppercase text-center mb-2 w-full"
                >
                  Register
                </button>
                <div
                  className="my-5 text-center"
                  id="error"
                  style={{ display: "none" }}
                ></div>

                <div className="flex space-x-1 items-center justify-center my-6">
                  <div className="form-group form-check">
                    <p className="text-sm dark:text-blue-200">
                      Already have an account?
                    </p>
                  </div>
                  <Link
                    to="/login"
                    className="text-blue-600 text-sm hover:text-blue-700 focus:text-blue-700 active:text-blue-800 duration-200 transition ease-in-out dark:text-blue-400"
                  >
                    Log In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const PlacesAutocomplete = ({ setPayload, payload }) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({ callbackName: "ADDRESS" });

  const handleSelect = async (address) => {
    if (address !== "") {
      setValue(address, false);
      clearSuggestions();
      setPayload({
        ...payload,
        address: address,
      });
    }
  };

  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        className="combobox-input bg-gray-50 border rounded-none border-gray-300 text-gray-900 sm:text-sm focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
        placeholder="Search an address..."
      />
      <div className="absolute w-full">
        {status === "OK" &&
          data.map((one, i) => (
            <span
              key={one.place_id}
              onClick={() => {
                handleSelect(one.description);
              }}
              className="bg-gray-100 block w-full pl-5 py-3 cursor-pointer hover:bg-white transition-all ease-in-out duration-150"
            >
              {one.description}
            </span>
          ))}
      </div>
    </div>
  );
};
