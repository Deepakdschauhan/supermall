import { useState, useEffect } from "react";
import { db, auth } from "../firebase"; // make sure this imports Firebase properly
import { doc, getDoc } from "firebase/firestore";

const useUserRole = () => {
  const [role, setRole] = useState(null); // Store role here
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserRole = async () => {
      const user = auth.currentUser;

      if (user) {
        const userDocRef = doc(db, "users", user.uid); // Fetch user by UID
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          // Make sure we are getting the role
          const userData = docSnap.data();
          console.log("User Role Data:", userData); // Debugging line
          setRole(userData.role); // Set the role to the state
        } else {
          console.log("No such document!");
        }
      } else {
        console.log("User is not logged in.");
      }

      setLoading(false);
    };

    getUserRole();
  }, []);

  return { role, loading };
};

export default useUserRole;
