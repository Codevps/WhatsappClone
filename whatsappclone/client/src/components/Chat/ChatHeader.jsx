import React from "react";
import Avatar from "../common/Avatar";
import { MdCall } from "react-icons/md";
import { IoVideocam } from "react-icons/io5";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";

function ChatHeader() {
  const [{ currentChatUser }, dispatch] = useStateProvider();

  return (
    <div className="h-16 py-3 flex justify-between items-center bg-panel-header-background z-10">
      <div className="flex items-center justify-center gap-6">
        <Avatar type="sm" image={currentChatUser?.profilePicture} />
        <div className="flex flex-col">
          <span className="text-primary-strong">{currentChatUser?.name}</span>
          <span className="text-secondary text-sm">Offline</span>
        </div>
      </div>
      <div className="flex gap-6">
        <MdCall className="text-xl text-panel-header-icon cursor-pointer" />
        <IoVideocam className="text-xl text-panel-header-icon cursor-pointer" />
        <BiSearchAlt2
          className="text-xl text-panel-header-icon cursor-pointer"
          onClick={() => dispatch({ type: reducerCases.SET_MESSAGE_SEARCH })}
        />
        <BsThreeDotsVertical className="text-xl text-panel-header-icon cursor-pointer" />
      </div>
    </div>
  );
}

export default ChatHeader;
