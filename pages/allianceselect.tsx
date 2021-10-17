import React, { useState } from "react";
import { Button, Header, Input, Segment, TextArea } from "semantic-ui-react";

export default function AllianceSelection() {
    const [alliances, setAlliances] = useState<string[][]>([]);
    const [allianceData, setAllianceData] = useState("");

    const addAlliance = () => {
        setAlliances([...alliances, []]);
    };

    const uploadAlliances = () => {
        const data = JSON.stringify(JSON.parse(allianceData));
        console.log(data);
        fetch("/api/alliances", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: data,
        }).then(() => {
            console.log("Uploaded");
        });
    };

    return (
        <Segment>
            <Header>Alliance Selection</Header>
            <TextArea
                value={allianceData}
                onChange={(e) => setAllianceData(e.target.value)}
            ></TextArea>
            <Button
                onClick={() => {
                    uploadAlliances();
                }}
            >
                UPLOAD
            </Button>
        </Segment>
    );
}
