import { Grid } from "@mui/material";
import Stream from "./Stream";

export default function StreamArray({ streamsArr }){

    return (
        <>
            <Grid container spacing={2} justifyContent="center">
                {streamsArr.map(stream => (
                    <Grid item xs={12} md={4}>
                        <Stream 
                            key={stream.id}
                            streamObject={stream}
                            height={"100%"}
                            width={"100%"}
                            topOverlay={true}
                            bottomOverlay={true}
                        />
                    </Grid>
                ))}
            </Grid>
        </>
    );
}