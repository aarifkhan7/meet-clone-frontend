import { Alert, Box, Button, Container, Grid, Icon, Snackbar, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

function App({ socket, startJoinProcess }){
    let [formDisabled, setFormDisabled] = useState(false);
    let [alertSeverity, setAlertSeverity] = useState('success');
    let [alertOpen, setAlertOpen] = useState(false);
    let [alertMessage, setAlertMessage] = useState('');
    let [roomIdTF, setRoomIdTF] = useState('');

    function openAlert(){
        setAlertOpen(true);
    }
    
    function closeAlert(){
        setAlertOpen(false);
    }

    function createNewRoom(e){
        setFormDisabled(true);
        if(socket.current.connected){
            socket.current.on("createroom-success", (data) => {
                setAlertSeverity('success');
                setAlertMessage("Created Room: " + data.roomId);
                openAlert();
                setFormDisabled(false);
            });
            
            socket.current.on("createroom-failure", (data)=>{
                setAlertSeverity('error');
                setAlertMessage("Error: Could not create room");
                openAlert();
                setFormDisabled(false);
            })

            socket.current.emit("createroom", "{}");
        }else{
            setAlertSeverity('error');
            setAlertMessage("Error: Socket not connected (Server may take 2-3 minutes to start, please be patient)");
            openAlert();
            setFormDisabled(false);
        }
    }

    function joinRoom(e){
        if(socket.current.connected){
            if(roomIdTF != ""){
                socket.current.on("reqjoin-success", (data) => {
                    console.log("Joining successfull!");
                    startJoinProcess(roomIdTF, data.numParticipants);
                });

                socket.current.on("reqjoin-failure", (data) => {
                    setAlertSeverity('error');
                    setAlertMessage("Error: Could not join" + data.errorMsg ? ", " + data.errorMsg : "");
                    openAlert();
                    setFormDisabled(false);
                })

                socket.current.emit("reqjoin", {
                    roomId: roomIdTF
                })
            }else{
                setAlertSeverity('info');
                setAlertMessage("Info: Enter Room Id");
                openAlert();
                setFormDisabled(false);
            }
        }else{
            setAlertSeverity('error');
            setAlertMessage("Error: Socket not connected (Server may take 2-3 minutes to start, please be patient)");
            openAlert();
            setFormDisabled(false);
        }
    }
    

    useEffect(()=>{
        return ()=>{
            if(socket.current){
                socket.current.removeListener("createroom-success");
                socket.current.removeListener("createroom-failure");
                socket.current.removeListener("reqjoin-success");
                socket.current.removeListener("reqjoin-failure");
            }
        }
    }, [])

    return (
        <>

            <Box>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={5} textAlign="center">
                        <Box mt={15} mb={15} ml={2} mr={2}>
                            <Typography variant="h4">
                                Create a new Room
                            </Typography>
                            <Button onClick={createNewRoom} variant="contained" startIcon={<Icon>add_circle</Icon>} disabled={formDisabled}>
                                Create
                            </Button>
                        </Box>
                        <Box mt={10} mb={10} ml={2} mr={2}>
                            <Typography variant="h4">
                                Join existing Room
                            </Typography>
                            <TextField label="Room Id" required size="small" disabled={formDisabled} onChange={(e) => {setRoomIdTF(e.target.value);}} /> 
                            <Button onClick={joinRoom}  variant="contained" startIcon={<Icon>add_circle</Icon>} size="medium" disabled={formDisabled}>
                                Join
                            </Button>
                        </Box>
                        <Snackbar open={alertOpen} onClose={closeAlert}>
                            <Alert severity={alertSeverity} sx={{ width: '100%' }}
                                action={
                                    <Button variant="contained" size="small" onClick={closeAlert}>
                                        <Icon>close</Icon>
                                    </Button>
                                }
                            >
                                <Typography>
                                    {alertMessage}   
                                </Typography>
                            </Alert>
                        </Snackbar>
                    </Grid>
                    <Grid item xs={12} sm={7}>
                        <img src="/homepage_graphic.jpg" width="100%" height="80%" alt=""></img>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}

export default App;