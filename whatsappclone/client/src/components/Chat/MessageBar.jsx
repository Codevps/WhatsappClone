import React from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import { MdSend } from "react-icons/md";
function MessageBar() {
  return (
    <div className="bg-panel-header-background h-20 px-4 flex items-center gap-6 relative ">
      <>
        <div className="flex gap-6 items-center">
          <BsEmojiSmile
            className="text-panel-header-icon cursor-pointer text-xl"
            title="Emoji"
          />
          <ImAttachment
            className="text-panel-header-icon cursor-pointer text-xl"
            title="File attachment"
          />
          <div className="w-full rounded-lg h-10 flex items-center">
            <input
              type="text"
              className="bg-input-background text-sm focus:outline-none text-white h-10 rounded-lg px-5 py-4 w-[59vw]"
              placeholder="Type a message"
            />
          </div>
          <MdSend
            className="text-panel-header-icon cursor-pointer text-xl "
            title="SendMessage"
          />
          <FaMicrophone
            className="text-panel-header-icon cursor-pointer text-xl  "
            title="Send Voice Note"
          />
        </div>
      </>
    </div>
  );
}

export default MessageBar;
