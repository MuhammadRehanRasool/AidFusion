import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import UserData from "../contexts/UserData";
import Navbar from "../components/Navbar";
import { checkLoginFromNonLogin } from "../CONSTANT";
export default function Layout(props) {
  let navigate = useNavigate();
  // ------------------
  // SESSION - END
  // ------------------
  let __init_session = {
    personal: {
      id: "",
      username: "",
      role: "",
      timestamp: "",
    },
    isLoggedIn: false,
  };
  const [session, setSession] = useState(__init_session);

  useEffect(() => {
    let sessionData = JSON.parse(sessionStorage.getItem("loggedin"));
    if (sessionData) {
      setSession({
        ...__init_session,
        personal: sessionData.data,
        isLoggedIn: true,
      });
    }
  }, []);

  const value = { session, setSession };
  // ------------------
  // SESSION - END
  // ------------------
  // useEffect(() => {
  //   if (checkLoginFromNonLogin()) {
  //     navigate("/login");
  //   }
  // }, [session]);

  return (
    <>
      <UserData.Provider value={value}>
        <Navbar
          isLoggedIn={session.isLoggedIn}
          __init_session={__init_session}
          setSession={setSession}
          username={session?.personal?.username}
          role={session?.personal?.role}
        />
        <div className="mx-10">{props.children}</div>
      </UserData.Provider>
    </>
  );
}
