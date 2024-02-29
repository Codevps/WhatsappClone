import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import ContextMenu from "./ContextMenu";
import PhotoPicker from "./PhotoPicker";

function Avatar({ type, image, setImage }) {
  const [hover, setHover] = useState(false);

  const [grabPhoto, setGrabPhoto] = useState(false);

  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [contextMenuOptions, setContextMenuOptions] = useState([
    { name: "Take Photo", callback: () => {} },
    { name: "Choose from Library", callback: () => {} },
    {
      name: "Upload Photo",
      callback: () => {
        setGrabPhoto(true);
      },
    },
    {
      name: "Remove Photo",
      callback: () => {
        setImage("/default_avatar.png");
      },
    },
  ]);

  const PhotoPickerChange = () => {};

  const [contextMenuCoordinates, setContextMenuCoordinates] = useState({
    x: 0,
    y: 0,
  });

  const showContextMenu = (e) => {
    setIsContextMenuVisible(true);
    setContextMenuCoordinates({
      x: e.pageX,
      y: e.pageY,
    });
  };

  useEffect(() => {
    if (grabPhoto) {
      const data = document.getElementById("photo-picker");
      data.click();
      document.body.onfocus = () => {
        setGrabPhoto(false);
      };
    }
  }, [grabPhoto]);
  return (
    <>
      <div className="flex items-center justify-center">
        {type === "sm" && (
          <div className="relative h-10 w-10">
            <Image src={image} alt="avatar" className="rounded-full" fill />
          </div>
        )}{" "}
        {type === "lg" && (
          <div className="relative h-14 w-14">
            <Image src={image} alt="avatar" className="rounded-full" fill />
          </div>
        )}
        {type === "xl" && (
          <div
            className="relative cursor-pointer z-0"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <div
              className={`bg-photopicker-overlay-background h-60 w-60
            top-0 left-0 flex items-center rounded-full justify-center absolute flex-col text-center gap-2 z-10
            ${hover ? "visible" : "hidden"}
            `}
              id="context-opener"
              onClick={(e) => showContextMenu(e)}
            >
              <FaCamera
                className="text-2xl"
                id="context-opener"
                onClick={(e) => showContextMenu(e)}
              />
              <span id="context-opener" onClick={(e) => showContextMenu(e)}>
                Change <br />
                Profile <br />
                Photo
              </span>
            </div>
            <div className="h-60 w-60 ">
              <Image src={image} alt="avatar" className="rounded-full" fill />
            </div>
          </div>
        )}
      </div>
      {isContextMenuVisible && (
        <ContextMenu
          options={contextMenuOptions}
          coordinates={contextMenuCoordinates}
          ContextMenu={isContextMenuVisible}
          setContextMenu={setIsContextMenuVisible}
        />
      )}
      {grabPhoto && <PhotoPicker onchange={PhotoPickerChange} />}
    </>
  );
}

export default Avatar;
