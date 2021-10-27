import { InferGetServerSidePropsType } from "next";
import React from "react";
import { EventService } from "../../lib/TBAApi";
import MatchTable from "../../components/MatchTable";
import { getCurrentEvent } from "../../lib/fileio/data";
import { Container } from "semantic-ui-react";

export default function MatchList(
    props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
    return (
        <Container>
            <h1>Matches</h1>
            {props.matches.map((match) => (
                <MatchTable key={match.key} match={match}></MatchTable>
            ))}
        </Container>
    );
}

export async function getServerSideProps() {
    const currentEvent = getCurrentEvent();
    const matches = await EventService.getEventMatches(currentEvent);

    return {
        props: {
            matches,
            currentEvent,
        },
    };
}
