import React, { useState } from "react";
import { User, UserContext } from "./userContext";

interface UserProviderProps {
    children: React.ReactNode;
}
  
const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
