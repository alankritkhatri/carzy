import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const loadState = () => {
  try {
    const serializedState = localStorage.getItem("userState");
    if (serializedState === null) {
      return {
        username: "",
        isAuthenticated: false,
        role: "",
        token: "",
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return {
      username: "",
      isAuthenticated: false,
      role: "",
      token: "",
    };
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(loadState);

  const setUserData = (userData) => {
    const newState = {
      username: userData.username,
      role: userData.role,
      token: userData.token,
      isAuthenticated: true,
    };
    setUser(newState);
    localStorage.setItem("userState", JSON.stringify(newState));
  };

  const clearUserData = () => {
    const newState = {
      username: "",
      role: "",
      token: "",
      isAuthenticated: false,
    };
    setUser(newState);
    localStorage.setItem("userState", JSON.stringify(newState));
  };

  return (
    <AuthContext.Provider value={{ user, setUserData, clearUserData }}>
      {children}
    </AuthContext.Provider>
  );
};
