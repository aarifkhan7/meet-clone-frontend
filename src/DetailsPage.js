import { Alert, Snackbar, AppBar, Box, Button, Container, Grid, Icon, TextField, Toolbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Stream from "./Stream";
import DetailsPageForm from "./DetailsPageForm";

function App({ cancelJoin, joinRoom, localStream }){
    // alert

    let [localStreamState, setLocalStreamState] = useState(null);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({audio: true, video: true}).then((stream) => {
            localStream.current = stream;
            setLocalStreamState(stream);
        }).catch((err) => {
            console.log("User blocked video!");
            console.log(err);
        });
    }, [])

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                <Button color="inherit" onClick={cancelJoin}><Icon>close</Icon></Button>
                </Toolbar>
            </AppBar>
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={5} textAlign="center">
                    <DetailsPageForm joinRoom={joinRoom}></DetailsPageForm>
                </Grid>
                <Grid item xs={12} sm={7}>
                    <Stream streamObject={localStreamState} width={"100%"} height={"500px"}>
                    </Stream>
                </Grid>
            </Grid>
        </>
    );
}

export default App;