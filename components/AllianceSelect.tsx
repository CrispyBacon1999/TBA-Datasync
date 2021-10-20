import React from "react";
import {
    Button,
    Container,
    Dropdown,
    Header,
    Input,
    Modal,
    Select,
    Table,
} from "semantic-ui-react";

const tabOrder = [
    [1, 2, 48, 49],
    [3, 4, 47, 50],
    [5, 6, 46, 51],
    [7, 8, 45, 52],
    [9, 10, 44, 53],
    [11, 12, 43, 54],
    [13, 14, 42, 55],
    [15, 16, 41, 56],
    [17, 18, 40, 57],
    [19, 20, 39, 58],
    [21, 22, 38, 59],
    [23, 24, 37, 60],
    [25, 26, 36, 61],
    [27, 28, 35, 62],
    [29, 30, 34, 63],
    [31, 32, 33, 64],
];

export default function AllianceSelect() {
    const [allianceCount, setAllianceCount] = React.useState(8);
    const [alliances, setAlliances] = React.useState<(number | null)[][]>(
        Array.from({ length: 16 }, () => {
            return [null, null, null, null];
        })
    );
    const [open, setOpen] = React.useState(false);

    return (
        <Container>
            <Header>Alliance Selection</Header>
            <Dropdown
                options={[
                    2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
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

            <Table>
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
                            <Table.Row>
                                <Table.Cell>{i + 1}</Table.Cell>
                                {alliance.map((team, j) => {
                                    return (
                                        <Table.Cell>
                                            <Input
                                                disabled={
                                                    j !== 0 &&
                                                    alliance[j - 1] === null
                                                }
                                                tabIndex={tabOrder[i][j]}
                                                onChange={(e) => {
                                                    console.log(i, j);
                                                    const newAlliances = [
                                                        ...alliances,
                                                    ];

                                                    const parsed = parseInt(
                                                        e.target.value
                                                    );
                                                    newAlliances[i][j] = isNaN(
                                                        parsed
                                                    )
                                                        ? null
                                                        : parsed;

                                                    console.log(newAlliances);

                                                    setAlliances(newAlliances);
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
        </Container>
    );
}
