import { useEffect, useRef } from "react";
import VideoJS from './VideoJS'
import { Container, Icon, IconButton, Stack } from "@mui/material";
import { Mic, MicOff } from "@mui/icons-material";

export default function Stream({ streamObject, height, width, topOverlay, bottomOverlay }){
    const videoRef = useRef(null);

    useEffect(()=>{
        if(streamObject){
            let vidElem = videoRef.current;
            vidElem.srcObject = streamObject;
        }
    });

    return (
        <>
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
            {streamObject?.active ? (
                <div
                    style={{
                        position: "relative",
                        width: width,
                        height: height,
                    }}
                >
                    { topOverlay ? (
                        <div id="overlay-top"
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                padding: "10px 0px",
                                "text-align": "center",
                                "background-color": "rgba(0, 0, 0, 0.3)",
                            }}
                        >
                            Name of Stream
                        </div>
                    ) : null}

                    {bottomOverlay ? (<div id="overlay-bottom"
                        style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            padding: "10px 0px",
                            "text-align": "center"
                        }}
                    >
                        Controls appear here...
                    </div>) : null}
                    <video ref={videoRef} height={height} width={width}
                    style={{
                        display: "block"
                    }}
                    autoPlay={true} />
                </div>
            ) : "Access Not Granted"}
        </>
    );
}