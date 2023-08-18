import { Box, Typography, TextField, Button, Snackbar, Alert, Icon } from "@mui/material";
import { useState } from "react";


function DetailsPageForm({ joinRoom }){
    // alert
    let [alertSeverity, setAlertSeverity] = useState('success');
    let [alertOpen, setAlertOpen] = useState(false);
    let [alertMessage, setAlertMessage] = useState('');
    function openAlert(){
        setAlertOpen(true);
    }
    
    function closeAlert(){
        setAlertOpen(false);
    }

    let [formDisabled, setFormDisabled] = useState(false);

    // component logic
    let [fullName, setFullName] = useState('');
    function btnAction(e){
        if(fullName != ""){
            setFormDisabled(true);
            joinRoom()
        }else{
            setAlertSeverity('info');
            setAlertMessage('Info: Please enter your name');
            openAlert();
        }
    }

    return (
        <>
            <Box mt={10} mb={10} textAlign="center">
                <Typography variant="h4">
                    Enter your Details
                </Typography>
                <Box mt={5}>
                    <TextField label="Name" onChange={(e) => {setFullName(e.target.value);}} required disabled={formDisabled} /><br></br><br></br>
                    <Button variant="contained" size="medium" onClick={btnAction} disabled={formDisabled}>
                        Join
                    </Button>
                </Box>
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
        </>
    );
}

export default DetailsPageForm;