import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { allUsersRoute, host } from "../utils/APIRoutes";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import {io} from "socket.io-client";

export default function Chat() {
    const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const navigate = useNavigate();
  const [currentChat, setCurrentChant] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    async function fetchData() {
      try {
        if (!localStorage.getItem("chat-app-user")) {
          navigate("/login");
        } else {
          setCurrentUser(
            await JSON.parse(localStorage.getItem("chat-app-user"))
          );
          setIsLoaded(true);
        }
      } catch (err) {
        console.log("err", err);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if(currentUser){
        socket.current = io(host);
        socket.current.emit("add-user", currentUser._id)
    }
    console.log("chat", socket)
  },[currentUser]);

  useEffect(() => {
    async function fetchData() {
      try {
        if (currentUser) {
          if (!currentUser.isAavatarImageSet) {
            const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
            setContacts(data.data);
          } else {
            navigate("/setAvatar");
          }
        }
      } catch (err) {
        console.log("err", err);
      }
    }

    fetchData();
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChant(chat);
  };

  return (
    
    <Container>
      <div className="container">
        <Contacts
          contacts={contacts}
          currentUser={currentUser}
          changeChat={handleChatChange}
        />
        
        {isLoaded && currentChat === undefined ? (
    <Welcome currentUser={currentUser} />
) : (

    <ChatContainer currentChat ={currentChat} currentUser={currentUser} socket={socket}/>
)}
      </div>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw; /* Change ; to : here */
  display: flex;
  flex-direction: column;
  justify-content: center; /* You need to specify a value for justify-content */
  gap: 1rem;
  align-items: center;
  background-color: #131324;

  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;

    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
