import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Logout from "./Logout";
import ChatInput from "./ChatInput";
import Messages from "./Messages";
import axios from "axios";
import { getAllMessagesRoute, sendMessageRoute } from "../utils/APIRoutes";
import { v4 as uuidv4 } from "uuid";

export default function ChatContainer({ currentChat, currentUser, socket }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();

  useEffect(() => {
    async function fetchMsg() {
      try {
        if (currentChat) {
          const response = await axios.post(getAllMessagesRoute, {
            from: currentUser._id,
            to: currentChat._id,
          });

          setMessages(response.data);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchMsg();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    if (socket && socket.current) {
      await axios.post(sendMessageRoute, {
        from: currentUser._id,
        to: currentChat._id,
        message: msg,
      });
      socket.current.emit("send-msg", {
        to: currentChat._id,
        from: currentUser._id,
        message: msg,
      });

      const msgs = [...messages];

      msgs.push({ fromSelf: true, messages: msg });
      console.log("msgs", msgs);

      setMessages(msgs);
    } else {
      console.error("Socket is not properly initialized.");
    }
  };

  useEffect(() => {
    if (socket.current) {
      console.log("ok");

      socket.current.on("msg-receive", (data) => {
        console.log("data", data);
        setArrivalMessage({ fromSelf: false, messages: data.message });
      });
    }
  }, [socket]);

  useEffect(() => {
    console.log(arrivalMessage);
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    console.log("messages", messages);
    scrollRef.current?.scrollIntoView({ behaviour: "smotth" });
  }, [messages]);

  return (
    <>
      {currentChat && (
        <Container>
          <div className="chat-header">
            <div className="user-details">
              <div className="avatar">
                <img
                  src={`data:image/svg+xml;base64, ${currentChat.avatarImage}`}
                  alt="avatar"
                />
              </div>
              <div className="username">
                <h3>{currentChat.username}</h3>
              </div>
            </div>
            <Logout />
          </div>

          <div className="chat-messages">
            {messages.map((message) => {
              return (
                <div ref={scrollRef} key={uuidv4()}>
                  <div
                    className={`message ${
                      message.fromSelf ? "sended" : "received"
                    }`}
                  >
                    <div className="content">
                      <p>{message.messages}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <ChatInput handleSendMsg={handleSendMsg} />
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  padding-top: 1rem;
  display: grid;
  grid-template-rows: 10% 78% 12%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.2rem;

    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }

      .username {
        h3 {
          color: white;
        }
      }
    }
  }

  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #ffffff39;
      width: 6px;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-track {
      background-color: transparent;
    }

    .message {
      display: flex;
      align-items: center;

      .content {
        max-width: 40 %;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
      }
    }
  }

  .sended {
    justify-content: flex-end;

    .content {
      background-color: #4f04ff21;
    }
  }

  .received {
    justify-content: flex-start;

    .content {
      background-color: #9900ff20;
    }
  }
`;
