import { InferGetServerSidePropsType } from "next";
import React, { useEffect } from "react";
import {
    Button,
    Container,
    Dropdown,
    Grid,
    Header,
    Input,
    Modal,
    Select,
    Table,
} from "semantic-ui-react";
import { Team_Simple } from "tba-api-v3client-ts";
import { EventService } from "../../lib/TBAApi";
import { getCurrentEvent } from "../../lib/fileio/data";

export default function AllianceSelect(
    props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
    const [allianceCount, setAllianceCount] = React.useState(8);
    const [alliances, setAlliances] = React.useState<(number | null)[][]>(
        Array.from({ length: 16 }, () => {
            return [null, null, null, null];
        })
    );
    const [open, setOpen] = React.useState(false);
    const [teams, setTeams] = React.useState<Team_Simple[]>(
        props.teams ? props.teams : []
    );
    const [pickedTeams, setPickedTeams] = React.useState<string[]>([]);
    const [teamSort, setTeamSort] = React.useState<{
        column: "name" | "number";
        direction: "ascending" | "descending";
    }>({ column: "number", direction: "ascending" });

    let picked = [];

    useEffect(() => {
        picked = [];
        for (let i = 0; i < alliances.length; i++) {
            for (let j = 0; j < alliances[i].length; j++) {
                if (alliances[i][j] !== null) {
                    picked.push(alliances[i][j]);
                }
            }
        }
    }, [alliances]);

    function calcTabOrder(i: number, j: number) {
        if (j < 2) {
            return Math.floor(i * 2 + 1 + i);
        } else if (j === 2) {
            return Math.floor(16 * 3 - i);
        } else if (j === 3) {
            return Math.floor(16 * 3 + i) + 1;
        }
    }

    return (
        <>
            <Header>Alliance Selection</Header>
            <Dropdown
                options={[
                    // 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
                    2, 4, 5, 8, 16,
                ].map((n) => ({
                    key: n,
                    text: n + " Alliances",
                    value: n,
                }))}
                value={allianceCount}
                onChange={(e, { value }) => setAllianceCount(value as number)}
                search
                button
            />
            <Modal
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
                trigger={<Button color="blue">Submit Alliances</Button>}
                size="tiny"
            >
                <Modal.Header>Submit alliances?</Modal.Header>
                <Modal.Content>
                    Are you sure you want to submit these alliances?
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        positive
                        onClick={() => {
                            fetch("/api/alliances", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(
                                    alliances
                                        .filter((_, i) => i < allianceCount)
                                        .map((a) =>
                                            a
                                                .filter((x) => x !== null)
                                                .map((t) =>
                                                    t ? "frc" + t : undefined
                                                )
                                        )
                                ),
                            })
                                .then((res) => res.json())
                                .then((res) => {
                                    console.log(res);
                                    setOpen(false);
                                });
                        }}
                    >
                        Submit
                    </Button>
                    <Button
                        negative
                        onClick={() => {
                            setOpen(false);
                        }}
                    >
                        Go back
                    </Button>
                </Modal.Actions>
            </Modal>

            <Grid>
                <Grid.Row>
                    <Grid.Column width={6}>
                        <Table size="small" sortable collapsing>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell
                                        sorted={
                                            teamSort.column === "number"
                                                ? teamSort.direction
                                                : undefined
                                        }
                                        onClick={() => {
                                            setTeamSort({
                                                column: "number",
                                                direction:
                                                    teamSort.direction ===
                                                    "ascending"
                                                        ? "descending"
                                                        : "ascending",
                                            });
                                        }}
                                    >
                                        Team Number
                                    </Table.HeaderCell>
                                    <Table.HeaderCell
                                        sorted={
                                            teamSort.column === "name"
                                                ? teamSort.direction
                                                : undefined
                                        }
                                        onClick={() => {
                                            setTeamSort({
                                                column: "name",
                                                direction:
                                                    teamSort.direction ===
                                                    "ascending"
                                                        ? "descending"
                                                        : "ascending",
                                            });
                                        }}
                                    >
                                        Team
                                    </Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {teams
                                    .sort((team1, team2) => {
                                        if (
                                            team1 !== undefined &&
                                            team2 !== undefined
                                        ) {
                                            if (teamSort.column === "number") {
                                                if (
                                                    teamSort.direction ===
                                                    "ascending"
                                                ) {
                                                    return (
                                                        team1.team_number -
                                                        team2.team_number
                                                    );
                                                } else {
                                                    return (
                                                        team2.team_number -
                                                        team1.team_number
                                                    );
                                                }
                                            } else {
                                                if (
                                                    teamSort.direction ===
                                                    "ascending"
                                                ) {
                                                    return (
                                                        team1.nickname?.localeCompare(
                                                            team2.nickname || ""
                                                        ) || 0
                                                    );
                                                } else {
                                                    return (
                                                        team2.nickname?.localeCompare(
                                                            team1.nickname || ""
                                                        ) || 0
                                                    );
                                                }
                                            }
                                        }
                                        return 0;
                                    })
                                    .map((team, i) => (
                                        <Table.Row key={team.key}>
                                            <Table.Cell>
                                                {team.team_number}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {team.nickname}
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                            </Table.Body>
                        </Table>
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Table size="small" collapsing>
                            <Table.Header>
                                <Table.HeaderCell>Alliance</Table.HeaderCell>
                                <Table.HeaderCell>Captain</Table.HeaderCell>
                                <Table.HeaderCell>Pick 1</Table.HeaderCell>
                                <Table.HeaderCell>Pick 2</Table.HeaderCell>
                                <Table.HeaderCell>Pick 3</Table.HeaderCell>
                            </Table.Header>
                            <Table.Body>
                                {alliances
                                    .filter((_, i) => i < allianceCount)
                                    .map((alliance, i) => (
                                        <Table.Row key={"alliance" + i}>
                                            <Table.Cell>{i + 1}</Table.Cell>
                                            {alliance.map((team, j) => {
                                                return (
                                                    <Table.Cell
                                                        key={"team" + j}
                                                    >
                                                        <Input
                                                            disabled={
                                                                j !== 0 &&
                                                                alliance[
                                                                    j - 1
                                                                ] === null
                                                            }
                                                            // tabIndex={tabOrder[i][j]}
                                                            tabIndex={calcTabOrder(
                                                                i,
                                                                j
                                                            )}
                                                            onChange={(e) => {
                                                                console.log(
                                                                    i,
                                                                    j
                                                                );
                                                                const newAlliances =
                                                                    [
                                                                        ...alliances,
                                                                    ];

                                                                const parsed =
                                                                    parseInt(
                                                                        e.target
                                                                            .value
                                                                    );
                                                                newAlliances[i][
                                                                    j
                                                                ] = isNaN(
                                                                    parsed
                                                                )
                                                                    ? null
                                                                    : parsed;

                                                                console.log(
                                                                    newAlliances
                                                                );

                                                                setAlliances(
                                                                    newAlliances
                                                                );
                                                            }}
                                                            value={team}
                                                        ></Input>
                                                    </Table.Cell>
                                                );
                                            })}
                                        </Table.Row>
                                    ))}
                            </Table.Body>
                        </Table>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </>
    );
}

export async function getServerSideProps() {
    const currentEvent = getCurrentEvent();
    const teams = await EventService.getEventTeamsSimple(currentEvent);

    return {
        props: {
            teams,
            currentEvent,
        },
    };
}
