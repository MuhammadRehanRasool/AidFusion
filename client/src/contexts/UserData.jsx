import React from "react";

const UserData = React.createContext({
  session: {
    access_token: "",
    personal: {
      id: "",
      username: "",
      role: "",
      timestamp: "",
    },
    isLoggedIn: false,
  },
  setSession: () => {},
});

export default UserData;
