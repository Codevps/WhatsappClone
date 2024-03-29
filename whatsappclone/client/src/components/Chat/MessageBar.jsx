import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { ADD_IMAGE_MESSAGE_ROUTE, ADD_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useRef, useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import { MdSend } from "react-icons/md";
import PhotoPicker from "../common/PhotoPicker";
import dynamic from "next/dynamic";

// __________Important Settings_________________
const CaptureAudio = dynamic(() => import("../common/CaptureAudio"), {
  ssr: false,
});
// ______________________________________________________

function MessageBar() {
  const [{ userInfo, currentChatUser, socket }, dispatch] = useStateProvider();
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [grabPhoto, setGrabPhoto] = useState(false);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);
  const emojiPickerRef = useRef(null);

  const handleEmojiModel = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emoji) => {
    setMessage((prev) => (prev += emoji.emoji));
  };

  useEffect(() => {
    if (grabPhoto) {
      const data = document.getElementById("photo-picker");
      data.click();
      document.body.onfocus = (e) => {
        setTimeout(() => {
          setGrabPhoto(false);
        }, 1000);
      };
    }
  }, [grabPhoto]);
  const PhotoPickerChange = async (e) => {
    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("image", file);
      const response = await axios.post(ADD_IMAGE_MESSAGE_ROUTE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          from: userInfo.id,
          to: currentChatUser.id,
        },
      });
      if (response.status == 201) {
        socket.current.emit("send-msg", {
          to: currentChatUser?.id,
          from: userInfo?.id,
          message: response.data.message,
        });
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage: {
            ...response.data.message,
          },
          fromSelf: true,
        });
      }
    } catch (error) {
      console.error(error);
    }
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
    <div className="bg-panel-header-background h-20 px-4 flex items-center gap-6  relative ">
      <>
        {!showAudioRecorder && (
          <div className="flex gap-6 items-center w-full justify-around">
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
              onClick={() => setGrabPhoto(!grabPhoto)}
            />
            <div className="w-full rounded-lg h-10 flex items-center">
              <input
                value={message}
                type="text"
                className="bg-input-background text-sm focus:outline-none text-white h-10 rounded-lg px-5 py-4 w-[92%]"
                placeholder="Type a message"
                onChange={(e) => setMessage(e.target.value)}
              />
              <button className="pl-4">
                {message.length ? (
                  <MdSend
                    onClick={sendMessage}
                    className="text-teal-500 cursor-pointer text-[1.45rem] "
                    title="SendMessage"
                  />
                ) : (
                  <FaMicrophone
                    className={`text-teal-500 cursor-pointer text-[1.45rem] m-[auto]
                  ${showAudioRecorder && "text-red-500"}
                  `}
                    title="Send Voice Note"
                    onClick={() => {
                      setShowAudioRecorder(!showAudioRecorder);
                    }}
                  />
                )}
              </button>
            </div>
          </div>
        )}
      </>
      {grabPhoto && <PhotoPicker onChange={PhotoPickerChange} />}
      {showAudioRecorder && <CaptureAudio hide={setShowAudioRecorder} />}
    </div>
  );
}

export default MessageBar;
