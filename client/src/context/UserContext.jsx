/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";

/* eslint-disable react/prop-types */
export const UserDataContext = createContext();

const UserContext = ({ children }) => {
  const [user, setUser] = useState({
    email: "",
  });
  return (
    <div>
      <UserDataContext.Provider value={{ user, setUser }}>
        {children}
      </UserDataContext.Provider>
    </div>
  );
};

export default UserContext;
