import { InferGetServerSidePropsType } from "next";
import React from "react";
import { MatchService } from "../../lib/TBAApi";
import MatchTable from "../../components/MatchTable";
import { getCurrentEvent } from "../../lib/fileio/data";
import { Container } from "semantic-ui-react";
import { useRouter } from "next/dist/client/router";

export default function SingleMatch(
    props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
    const router = useRouter();
    const { key } = router.query;

    return (
        <Container>
            <h1>{key}</h1>
            <MatchTable key={props.match.key} match={props.match}></MatchTable>
        </Container>
    );
}

export async function getServerSideProps(context: any) {
    const { key } = context.query;
    const currentEvent = getCurrentEvent();
    const match = await MatchService.getMatch(key as string);

    return {
        props: {
            match,
            currentEvent,
        },
    };
}
