import React, { useEffect, useState } from "react";
import ChatList from "./ChatList/ChatList";
import Empty from "./Empty";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { CHECK_USER_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import { useRouter } from "next/router";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";

function Main() {
  const [{ userInfo }, dispatch] = useStateProvider();
  const router = useRouter();
  const [redirectLogin, setRedirectLogin] = useState(false);

  useEffect(() => {
    if (redirectLogin) router.push("/login");
    return () => {};
  }, [redirectLogin]);

  onAuthStateChanged(firebaseAuth, async (currentUser) => {
    console.log(currentUser);
    if (!currentUser) setRedirectLogin(true);
    if (!userInfo && currentUser?.email) {
      const { data } = axios.post(CHECK_USER_ROUTE, {
        email: currentUser?.email,
      });
      console.log({ data });

      if (!data) router.push("/login");
      const { id, name, email, profilePicture, about } = data?.data;
      dispatch({
        type: reducerCases.SET_USER_INFO,
        userInfo: {
          id,
          name,
          email,
          profilePicture,
          about,
        },
      });
    }
  });
  return (
    <>
      <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden">
        <ChatList />
        <Empty />
      </div>
    </>
  );
}

export default Main;
