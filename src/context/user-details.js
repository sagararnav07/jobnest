import { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "./user-context";
import { getUserDocument } from "../firebase/firebase";

export const UserDetailsContext = createContext({
  details: "",
  setDetails: () => {},
});

export const UserDetailsProvider = ({ children }) => {
  const [details, setDetails] = useState({});

  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!currentUser) {
        setDetails({});
        return;
      }
      try {
        const data = await getUserDocument();
        setDetails(data);
      } catch (error) {
        console.error(error);
        setDetails({});
      }
    };
    fetchDetails();
  }, [currentUser]);

  const value = { details, setDetails };
  return (
    <UserDetailsContext.Provider value={value}>
      {children}
    </UserDetailsContext.Provider>
  );
};
