import { useState, useContext, createContext, useEffect } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });

  // Load from localStorage on mount
  useEffect(() => {
    const data = localStorage.getItem("auth");
    if (data) {
      const parsed = JSON.parse(data);
      setAuth({
        user: parsed.user,
        token: parsed.token,
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
