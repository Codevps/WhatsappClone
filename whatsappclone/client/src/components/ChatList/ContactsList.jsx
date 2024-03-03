import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { GET_ALL_CONTACTS } from "@/utils/ApiRoutes";
import axios from "axios";
import { useEffect, useState } from "react";
import { BiArrowBack, BiSearchAlt2 } from "react-icons/bi";
import ChatListItem from "./ChatListItem";

function ContactsList() {
  const [allContacts, setAllContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchContacts, setSearchContacts] = useState([]);
  const [{}, dispatch] = useStateProvider();
  useEffect(() => {
    const getContacts = async () => {
      try {
        const {
          data: { users },
        } = await axios.get(GET_ALL_CONTACTS);
        setAllContacts(users);
        setSearchContacts(users);
      } catch (error) {
        console.error(error);
      }
    };
    getContacts();
  }, []);

  useEffect(() => {
    if (searchTerm.length) {
      const filteredData = {};

      Object.keys(allContacts).forEach((key) => {
        filteredData[key] = allContacts[key].filter((obj) =>
          obj.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });

      setSearchContacts(filteredData);
    } else {
      setSearchContacts(allContacts);
    }
  }, [searchTerm]);

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
      <div className="bg-search-input-container-background flex py-3 pl-5 items-center gap-3 h-14">
        <div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow mr-3">
          <div className="">
            <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-xl" />
          </div>
          <input
            type="text"
            placeholder="Search Chat"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-sm focus:outline-none text-white w-full "
          />
        </div>
      </div>
      {Object.entries(searchContacts).map(([initialLetter, userList]) => {
        return (
          <div key={Date.now() + initialLetter}>
            {searchTerm.length === "" && (
              <div className="text-teal-light pl-10 py-5">{initialLetter}</div>
            )}
            {userList.map((contact) => {
              return (
                <ChatListItem
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
