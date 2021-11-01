import React from "react";
import { Button, Container, Header } from "semantic-ui-react";

export default function EliminationSchedule() {
    return (
        <Container>
            <Header>Elimination Schedule</Header>
            <Button
                color="blue"
                onClick={() => {
                    window.location.href = "/api/schedule/elimSchedule";
                }}
            >
                Generate / Upload Schedule
            </Button>
        </Container>
    );
}
