import "./groupdesc.css";
import React, { useContext, useState, useEffect } from "react";
import { StateContext } from "../context/StateProvider";
import { IconButton } from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import CloseIcon from "@material-ui/icons/Close";
import CreateIcon from "@material-ui/icons/Create";
import DoneIcon from "@material-ui/icons/Done";
import { socketFunctions } from "./socket";
import aes256 from "aes256"

function Profile() {
  const {
    groupDescStatus,
    openGroupDesc,
    currentRoom,
    leftRoom,
    updateRoom,
    user,
  } = useContext(StateContext);
  const [name, setName] = useState("");
  const [nameCheck, setNameCheck] = useState(true);
  const [about, setAbout] = useState("");
  const [aboutCheck, setAboutCheck] = useState(true);

  useEffect(() => {
    setName(currentRoom && currentRoom.name);
    setAbout(currentRoom && currentRoom.description);
  }, [currentRoom]);

  const handleClose = () => {
    setNameCheck(true);
    setAboutCheck(true);
    openGroupDesc(false);
  };

  const onNameSubmit = async () => {
    await updateRoom(name, about);
    socketFunctions.sendMessage({
      body: aes256.encrypt(currentRoom && currentRoom._id, user && user.name + "<check> joined"),
      user_id: user && user._id,
      user_name: user && user.name,
      type: "joinRoom",
      room: currentRoom && currentRoom.name,
      room_id: currentRoom && currentRoom._id,
      token: window.localStorage["token"],
    });
    socketFunctions.sendMessage({
      body: aes256.encrypt(currentRoom && currentRoom._id, user.name + "<check> changed group name to " + name),
      user_id: user._id,
      user_name: user.name,
      type: "info",
      room: name,
      room_id: currentRoom && currentRoom._id,
      token: window.localStorage["token"],
    });
    await setNameCheck(!nameCheck);
  };

  const onAboutSubmit = async () => {
    await updateRoom(name, about);
    socketFunctions.sendMessage({
      body: aes256.encrypt(currentRoom && currentRoom._id, user && user.name + "<check> joined"),
      user_id: user && user._id,
      user_name: user && user.name,
      type: "joinRoom",
      room: currentRoom && currentRoom.name,
      room_id: currentRoom && currentRoom._id,
      token: window.localStorage["token"],
    });
    socketFunctions.sendMessage({
      body: aes256.encrypt(currentRoom && currentRoom._id, user.name + "<check> changed group description to " + about),
      user_id: user._id,
      user_name: user.name,
      type: "info",
      room: name,
      room_id: currentRoom && currentRoom._id,
      token: window.localStorage["token"],
    });
    await setAboutCheck(!aboutCheck);
  };

  return groupDescStatus
    ? currentRoom && (
        <div className="group-desc">
          <header className="group-desc-header">
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
            <h3>Group info</h3>
          </header>
          <div className="group-desc-body">
            <div className="group-desc-image">
              <img alt="groupIcon" src={currentRoom.group_icon} />
              <div
                className={`group-name ${
                  !nameCheck && "group-name-bottom-border"
                }`}
              >
                {nameCheck ? (
                  <>
                    <h2>{currentRoom.name}</h2>
                    <CreateIcon onClick={() => setNameCheck(!nameCheck)} />
                  </>
                ) : (
                  <div>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoFocus
                    />
                    <DoneIcon onClick={onNameSubmit} />
                  </div>
                )}
              </div>
              <p>
                {currentRoom.type === "public" &&
                  `Group . ${currentRoom.users.length} participants`}
              </p>
            </div>
          </div>
          <div className="group-desc-about">
            <div
              className={`group-description ${
                !aboutCheck && "group-name-bottom-border"
              }`}
            >
              {aboutCheck ? (
                <>
                  {currentRoom.description === "Description ..." ||
                  currentRoom.description === "" ? (
                    <span>Add group description</span>
                  ) : (
                    <h3>{currentRoom.description}</h3>
                  )}
                  <CreateIcon onClick={() => setAboutCheck(!aboutCheck)} />
                </>
              ) : (
                <div>
                  <input
                    value={about}
                    placeholder="Description ..."
                    onChange={(e) => setAbout(e.target.value)}
                    autoFocus
                  />
                  <DoneIcon onClick={onAboutSubmit} />
                </div>
              )}
            </div>
            <p>
              Group created by {currentRoom.create_by}, on{" "}
              {new Date(currentRoom.create_at * 1000).toLocaleDateString()} at{" "}
              {new Date(currentRoom.create_at * 1000).getHours()}:
              {new Date(currentRoom.create_at * 1000).getMinutes()}
            </p>
          </div>
          <div className="group-desc-participants">
            <p>{currentRoom.users.length} participants</p>
            {currentRoom.users.map((x, i) => (
              <h2 key={i}>{x}</h2>
            ))}
          </div>
          <footer className="group-desc-footer">
            <div
              className="group-exit"
              onClick={() => {
                openGroupDesc(false);
                leftRoom();
              }}
            >
              <IconButton>
                <ExitToAppIcon style={{ color: "red" }} />
              </IconButton>
              <p>Exit group</p>
            </div>
          </footer>
        </div>
      )
    : null;
}

export default Profile;
