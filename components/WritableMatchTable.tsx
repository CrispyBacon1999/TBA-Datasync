import { Header, Table } from "semantic-ui-react";
import { WritableMatch } from "../lib/WriteApi";

export default function MatchTable({ match }: { match: WritableMatch<any> }) {
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
                    >
                        <Table.Cell textAlign="center">
                            {match.alliances?.red?.teams[0].replace("frc", "")}
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                            {match.alliances?.red?.teams[1].replace("frc", "")}
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                            {match.alliances?.red?.teams[2].replace("frc", "")}
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
                            {match.alliances?.blue?.teams[0].replace("frc", "")}
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                            {match.alliances?.blue?.teams[1].replace("frc", "")}
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                            {match.alliances?.blue?.teams[2].replace("frc", "")}
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
