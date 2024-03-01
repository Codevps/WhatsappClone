import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { ADD_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useRef, useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import { MdSend } from "react-icons/md";
function MessageBar() {
  const [{ userInfo, currentChatUser, socket }, dispatch] = useStateProvider();
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  const handleEmojiModel = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emoji) => {
    setMessage((prev) => (prev += emoji.emoji));
  };
  const sendMessage = async () => {
    try {
      const { data } = await axios.post(ADD_MESSAGE_ROUTE, {
        to: currentChatUser?.id,
        from: userInfo?.id,
        message,
      });
      socket.current.emit("send-msg", {
        to: currentChatUser?.id,
        from: userInfo?.id,
        message: data.message,
      });
      dispatch({
        type: reducerCases.ADD_MESSAGE,
        newMessage: {
          ...data.message,
        },
        fromSelf: true,
      });
      setMessage("");
      setShowEmojiPicker(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const handleOutsideClickEvent = (event) => {
      if (event.target.id !== "emoji-open") {
        if (
          emojiPickerRef.current &&
          !emojiPickerRef.current.contains(event.target)
        )
          setShowEmojiPicker(false);
      }
    };
    document.addEventListener("click", handleOutsideClickEvent);
    return () => {
      document.removeEventListener("click", handleOutsideClickEvent);
    };
  }, [emojiPickerRef]);

  return (
    <div className="bg-panel-header-background h-20 px-4 flex items-center gap-6 relative ">
      <>
        <div className="flex gap-6 items-center">
          <BsEmojiSmile
            className="text-panel-header-icon cursor-pointer text-xl"
            title="Emoji"
            id="emoji-open"
            onClick={handleEmojiModel}
          />
          {showEmojiPicker && (
            <div
              className="absolute bottom-24 left-16 z-40"
              ref={emojiPickerRef}
            >
              <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
            </div>
          )}
          <ImAttachment
            className="text-panel-header-icon cursor-pointer text-xl"
            title="File attachment"
          />
          <div className="w-full rounded-lg h-10 flex items-center">
            <input
              value={message}
              type="text"
              className="bg-input-background text-sm focus:outline-none text-white h-10 rounded-lg px-5 py-4 w-[59vw]"
              placeholder="Type a message"
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <MdSend
            onClick={sendMessage}
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
