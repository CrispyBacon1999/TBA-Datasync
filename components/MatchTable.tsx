import { Header, Table } from "semantic-ui-react";
import { Match } from "tba-api-v3client-ts";

export default function MatchTable({ match }: { match: Match }) {
    return (
        <>
            <Header as="h4">{match.key}</Header>
            <Table celled fixed size="small">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell colSpan="3" textAlign="center">
                            Teams
                        </Table.HeaderCell>
                        <Table.HeaderCell textAlign="center">
                            Score
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    <Table.Row
                        style={{
                            backgroundColor: "#fee",
                            fontWeight:
                                (match.alliances?.red?.score ?? 0) >
                                (match.alliances?.blue?.score ?? 0)
                                    ? "bold"
                                    : "normal",
                        }}
                        className={
                            match.winning_alliance === "red" ? "winner" : ""
                        }
                    >
                        <Table.Cell textAlign="center">
                            {match.alliances?.red?.team_keys[0].replace(
                                "frc",
                                ""
                            )}
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                            {match.alliances?.red?.team_keys[1].replace(
                                "frc",
                                ""
                            )}
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                            {match.alliances?.red?.team_keys[2].replace(
                                "frc",
                                ""
                            )}
                        </Table.Cell>
                        <Table.Cell
                            textAlign="center"
                            style={{ backgroundColor: "#fdd" }}
                        >
                            {match.alliances?.red?.score}
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row
                        style={{
                            backgroundColor: "#eef",
                            fontWeight:
                                (match.alliances?.blue?.score ?? 0) >
                                (match.alliances?.red?.score ?? 0)
                                    ? "bold"
                                    : "normal",
                        }}
                    >
                        <Table.Cell textAlign="center">
                            {match.alliances?.blue?.team_keys[0].replace(
                                "frc",
                                ""
                            )}
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                            {match.alliances?.blue?.team_keys[1].replace(
                                "frc",
                                ""
                            )}
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                            {match.alliances?.blue?.team_keys[2].replace(
                                "frc",
                                ""
                            )}
                        </Table.Cell>
                        <Table.Cell
                            textAlign="center"
                            style={{ backgroundColor: "#ddf" }}
                        >
                            {match.alliances?.blue?.score}
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        </>
    );
}
