import React, { useEffect, useState } from "react";
import { Button, Container, Header } from "semantic-ui-react";
import { Match } from "tba-api-v3client-ts";
import { useTimer } from "use-timer";

export default function EliminationUploads() {
    const [fmsConnection, setFmsConnection] = useState<boolean | undefined>(
        undefined
    );
    const [currentlyUploading, setCurrentlyUploading] =
        useState<boolean>(false);
    const [uploadedMatches, setUploadedMatches] = useState<Match[]>([]);
    const { time, start, pause, reset, status } = useTimer({
        initialTime: 30,
        endTime: 0,
        timerType: "DECREMENTAL",
        onTimeOver: () => {
            console.log("Time is over");
            checkForMatches();

            reset();
            start();
        },
    });

    const checkFMSConnection = async () => {
        setFmsConnection(undefined);
        const result = await fetch("/api/fms").then((res) => res.json());
        setFmsConnection(result.fmsConnected);
    };

    const checkForMatches = async () => {
        setCurrentlyUploading(true);
        const uploadedMatches = await fetch(`/api/match/upload?levelParam=2`, {
            method: "POST",
        }).then((res) => res.json());
        setCurrentlyUploading(false);
        setUploadedMatches(uploadedMatches);

        // Restart timer
        reset();
        start();
    };

    useEffect(() => {
        checkFMSConnection();
    }, []);

    return (
        <Container>
            <Header>Elimination Uploads</Header>
            <Button
                loading={fmsConnection === undefined}
                color={
                    fmsConnection === true
                        ? "green"
                        : fmsConnection === false
                        ? "red"
                        : "grey"
                }
                onClick={checkFMSConnection}
            >
                FMS Connection
            </Button>
            <Button
                onClick={() => {
                    checkForMatches();
                    start();
                }}
            >
                {status === "RUNNING"
                    ? `Time until poll: ${time}`
                    : "Start Polling Matches"}
            </Button>
        </Container>
    );
}
