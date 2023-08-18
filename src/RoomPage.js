import { BottomNavigation, BottomNavigationAction, Box, CssBaseline, Grid, Icon, Paper } from "@mui/material";
import StreamArray from "./StreamArray";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import Peer from "peerjs";

const peerConnOptions = {
}

function RoomPage({socket, roomDetails, localStream}){
    let [streamArr, setStreamArr] = useState([localStream.current]);

    function handleNavClick(){
        alert("To be Implemented.");
    }

    useEffect(() => {
        console.log("socket Object:");
        console.log(socket.current);
        console.log("roomDetails Object:")
        console.log(roomDetails.current);
        
        let peerIdArr = [];
        for(let i = 0; i < roomDetails.current.numParticipants; i++){
            peerIdArr.push(uuidv4());
        }

        socket.current.emit("offers", {
            pID: peerIdArr
        })

        socket.current.on("remote-id", function (data) {
            // someone has joined the room
            // create a local peer obj for it
            // send the reply
            // wait for connection
            // on call add the stream
            if(!roomDetails.current.peerPairs){
                roomDetails.current.peerPairs = [];
            }

            let newPeerId = uuidv4();
            let newPeerPair = {
                localPeerId: newPeerId,
                remotePeerId: data.remotePeerId,
                peerObj: new Peer(newPeerId, peerConnOptions)
            };

            newPeerPair.peerObj.parentObj = newPeerPair;

            newPeerPair.peerObj.on("open", function (id) {
                console.log("Peer Obj created with id: " + id);

                this.parentObj.peerObj.on("call", (mediaConnection) => {
                    this.parentObj.mediaConn = mediaConnection;
                    this.parentObj.mediaConn.parentObj = this.parentObj;
                    this.parentObj.numStreams = 0;
                    this.parentObj.mediaConn.answer(localStream.current);
                    this.parentObj.mediaConn.on("stream", (remoteStream) => {
                        if(this.parentObj.numStreams == 0){
                            this.parentObj.numStreams++;
                            console.log("Fetched a stream");
                            console.log(remoteStream);
                            setStreamArr(n => [...n, remoteStream]);
                        }
                    });
                })
            })

            
            
            roomDetails.current.peerPairs.push(newPeerPair);

            socket.current.emit("answer", {
                remoteSocketId: data.remoteSocketId,
                localPeerId: newPeerId,
                remotePeerId: data.remotePeerId
            });
        })

        socket.current.on("relay-answer", function (data) {
            // new joiner got a reply to an offer
            // add it to the details

            if(!roomDetails.current.peerPairs){
                roomDetails.current.peerPairs = [];
            }

            let newPeerPair = {
                localPeerId: data.localPeerId,
                remotePeerId: data.remotePeerId,
                peerObj: new Peer(data.localPeerId, peerConnOptions)
            }

            newPeerPair.peerObj.parentObj = newPeerPair;
            
            newPeerPair.peerObj.on("open", function (id) {
                console.log("Peer Obj created with id: " + id);
                this.parentObj.mediaConn = newPeerPair.peerObj.call(data.remotePeerId, localStream.current);
                this.parentObj.mediaConn.parentObj = this.parentObj;
                this.parentObj.numStreams = 0;
                this.parentObj.mediaConn.on('stream', function (stream) {
                    if(this.parentObj.numStreams == 0){
                        this.parentObj.numStreams++;
                        console.log("Fetched a stream");
                        console.log(stream);
                        setStreamArr(n => [...n, stream]);
                    }
                })
            })

            roomDetails.current.peerPairs.push(newPeerPair);
        })

        return () => {
            socket.current.removeListener("remote-id");
            socket.current.removeListener("relay-answer");
        }
    }, []);

    return (
        <>
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
            {/* <CssBaseline/> */}
            <Box>
                <StreamArray streamsArr={streamArr}></StreamArray>
            </Box>
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                <BottomNavigation>
                    <BottomNavigationAction onClick={handleNavClick} label="Mic" icon={<Icon>mic_off</Icon>}></BottomNavigationAction>
                    <BottomNavigationAction onClick={handleNavClick} label="Camera" icon={<Icon>videocam</Icon>}></BottomNavigationAction>
                    <BottomNavigationAction onClick={handleNavClick} label="Chat" icon={<Icon>chat</Icon>}></BottomNavigationAction>
                    <BottomNavigationAction onClick={handleNavClick} label="Exit Room" icon={<Icon>logout</Icon>}></BottomNavigationAction>
                </BottomNavigation>
            </Paper>
        </>
    );
}

export default RoomPage;