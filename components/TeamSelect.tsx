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

export default function TeamSelect() {
    const [teams, setTeams] = React.useState<string[]>([]);
    const [currentEditedTeam, setCurrentTeam] = React.useState("");

    useEffect(() => {
        fetch("/api/teams")
            .then((res) => res.json())
            .then((teams) => {
                setTeams(teams);
            });
    }, []);

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
                            <Table.HeaderCell>Team</Table.HeaderCell>
                            {/* <Table.HeaderCell>Name</Table.HeaderCell> */}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {teams.map((teamKey) => {
                            return (
                                <Table.Row>
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
