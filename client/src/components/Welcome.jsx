import React from "react";
import { ToastContainer } from "react-toastify";
import styled from "styled-components";
// import robot 

export default function Welcome({currentUser}){
    return (
        <Container>
            <img src="" alt="Robot" />
            <h1>Welcome, <span>{currentUser.username}</span></h1>
            <h3>Please select a chat to start messaging.</h3>
        </Container>
    )
}

const Container = styled.div`
display: flex;
justify-center: center;
align-items: center;
flex-direction: column;
color: white;

img{
    height: 20rem;
}
span {
    color: #4e0eff;
}
`;