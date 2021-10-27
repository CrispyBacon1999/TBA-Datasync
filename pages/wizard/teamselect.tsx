import { InferGetServerSidePropsType } from "next";
import React, { useEffect } from "react";
import {
    Button,
    Container,
    Form,
    Header,
    Input,
    Segment,
    Table,
} from "semantic-ui-react";
import { getCurrentEvent } from "../../lib/fileio/data";
import { EventService } from "../../lib/TBAApi";

export default function TeamSelect(
    props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
    const [teams, setTeams] = React.useState<string[]>(
        props.teams ? props.teams : []
    );
    const [currentEditedTeam, setCurrentTeam] = React.useState("");

    return (
        <Container>
            <Header>Select Event Teams</Header>
            <Form>
                <Input
                    placeholder="254"
                    value={currentEditedTeam}
                    onChange={(e) => {
                        setCurrentTeam(e.target.value);
                    }}
                ></Input>
                <Button
                    // Future proofing match for 5 digit numbers
                    disabled={currentEditedTeam.match(/\d{1,5}/) === null}
                    color="blue"
                    onClick={() => {
                        const tbaForm = "frc" + currentEditedTeam;
                        if (teams.includes(tbaForm)) {
                            setCurrentTeam("");
                            return;
                        }
                        setTeams(
                            [...teams, tbaForm].sort(
                                (a, b) =>
                                    parseInt(a.replace("frc", "")) -
                                    parseInt(b.replace("frc", ""))
                            )
                        );
                    }}
                >
                    Add
                </Button>
            </Form>
            <Button color="blue" onClick={() => {}}>
                Save Teams
            </Button>
            <Segment>
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Remove</Table.HeaderCell>
                            <Table.HeaderCell>Team</Table.HeaderCell>
                            {/* <Table.HeaderCell>Name</Table.HeaderCell> */}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {teams.map((teamKey) => {
                            return (
                                <Table.Row key={teamKey}>
                                    <Table.Cell collapsing>
                                        <Button
                                            size="mini"
                                            color="red"
                                            icon="minus"
                                            onClick={() => {
                                                setTeams(
                                                    teams.filter(
                                                        (t) => t !== teamKey
                                                    )
                                                );
                                            }}
                                        ></Button>
                                    </Table.Cell>
                                    <Table.Cell>
                                        {teamKey.replace("frc", "")}
                                    </Table.Cell>
                                </Table.Row>
                            );
                        })}
                    </Table.Body>
                </Table>
            </Segment>
        </Container>
    );
}

export async function getServerSideProps() {
    const currentEvent = getCurrentEvent();
    const teams = (await EventService.getEventTeamsKeys(currentEvent)).sort(
        (a, b) =>
            parseInt(a.replace("frc", "")) - parseInt(b.replace("frc", ""))
    );
    return {
        props: { teams, currentEvent },
    };
}
