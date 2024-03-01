import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { GET_ALL_CONTACTS } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import ChatLIstItem from "./ChatLIstItem";

function ContactsList() {
  const [allContacts, setAllContacts] = useState([]);
  const [{}, dispatch] = useStateProvider();
  useEffect(() => {
    const getContacts = async () => {
      try {
        const {
          data: { users },
        } = await axios.get(GET_ALL_CONTACTS);
        setAllContacts(users);
      } catch (error) {
        console.error(error);
      }
    };
    getContacts();
  }, []);

  return (
    <div className="h-full flex flex-col overflow-scroll hide-scrollbar pb-2">
      <div className="flex items-end px-3 py-4">
        <div className="flex items-center gap-12 text-white">
          <BiArrowBack
            className="cursor-pointer text-xl"
            onClick={() => {
              dispatch({ type: reducerCases.SET_ALL_CONTACTS_PAGE });
            }}
          />
          <span>New Chat</span>
        </div>
      </div>

      {Object.entries(allContacts).map(([initialLetter, userList]) => {
        return (
          <div key={Date.now() + initialLetter}>
            <div className="text-teal-light pl-10 py-5">{initialLetter}</div>
            {console.log(userList)}
            {userList.map((contact) => {
              return (
                <ChatLIstItem
                  data={contact}
                  isContactPage={true}
                  key={contact.id}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default ContactsList;
