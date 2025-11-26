import { createContext, useCallback, useEffect, useState } from "react";
import { getUserDocument } from "../firebase/firebase";
import { loadStoredToken, setAuthToken } from "../lib/api";

export const UserContext = createContext({
  currentUser: null,
  setCurrentUser: () => null,
  databaseUser: null,
  setDatabaseUser: () => null,
  isLoading: null,
});

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [databaseUser, setDatabaseUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const bootstrapUser = useCallback(async () => {
    const token = loadStoredToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const profile = await getUserDocument();
      setCurrentUser(profile);
      setDatabaseUser(profile);
    } catch (error) {
      console.error(error);
      setAuthToken(null);
      setCurrentUser(null);
      setDatabaseUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrapUser();
  }, [bootstrapUser]);

  const value = {
    currentUser,
    setCurrentUser,
    databaseUser,
    setDatabaseUser,
    isLoading,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
