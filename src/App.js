import HomePage from "./HomePage";
import DetailsPage from "./DetailsPage";
import RoomPage from "./RoomPage";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import JoiningPage from "./JoiningPage";

function App(){
    let socket = useRef(null);
    let roomDetails = useRef({});
    let localStream = useRef(null);

    let [screen, setScreen] = useState('home');
    
    function startJoinProcess(roomId, numParticipants){
        setScreen('details');
        console.log("Starting Join Process");
        roomDetails.current.roomId = roomId;
        roomDetails.current.numParticipants = numParticipants;
    }

    function cancelJoin(){
        setScreen('home')
        roomDetails = {};
        localStream = null;
    }

    function joinRoom(){
        setScreen('joining');
        // socket.on("metadata-success", (data)=>{
        //     roomDetails.current.numParticipants = data.numParticipants;
        // });

        setScreen('room');

        // socket.emit("metadata");
    }

    useEffect(() => {
        socket.current = io(process.env.REACT_APP_socketURL);

        // Socket Connection Event Listeners
        socket.current.on("connect", () => {
            console.log("Socket connected to Server");
        })

        socket.current.on("disconnect", () => {
            console.log("Socket disconnected!");
        })

        // Socket Events Logging
        socket.current.onAny((event, data) => {
            console.log("Got:", event);
            console.log(data);
        })

        return ()=>{
            socket.current.removeAllListeners();
            socket.current.disconnect();
        }
    }, []);

    return (
        <>
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />

            {screen == 'home' ? (
                <HomePage socket={socket} startJoinProcess={startJoinProcess}></HomePage>
            ) : null}
            {screen == 'details' ? (
                <DetailsPage cancelJoin={cancelJoin} joinRoom={joinRoom} localStream={localStream}></DetailsPage>
            ) : null}
            {screen == 'joining' ? (
                <JoiningPage></JoiningPage>
            ) : null}
            {screen == 'room' ? (
                <RoomPage socket={socket} roomDetails={roomDetails} localStream={localStream}></RoomPage>
            ) : null}
        </>
    );
}

export default App;