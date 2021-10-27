import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import {
    Button,
    Card,
    Container,
    Grid,
    Header,
    Input,
    List,
    ListItemProps,
    Segment,
} from "semantic-ui-react";
import type { Event_Simple } from "tba-api-v3client-ts";

export default function EventSelect() {
    const [eventCode, setEventCode] = useState("");
    const [eventList, setEventList] = useState<Event_Simple[]>([]);
    const [searchBarText, setSearchBarText] = useState("");

    const handleEventSelect = (key: string) => {
        console.log(key);
        fetch("/api/app/eventCode", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ code: key }),
        }).then(() => {
            console.log("Event code set");
            setEventCode(key);
        });
    };

    const router = useRouter();

    useEffect(() => {
        fetch("/api/app/eventCode")
            .then((res) => res.json())
            .then((data) => {
                setEventCode(data.code);
            });
        fetch("/api/event")
            .then((res) => res.json())
            .then((events: Event_Simple[]) => {
                setEventList(events);
            });
    }, []);

    return (
        <Container>
            <Header>Event Select</Header>
            <Segment>
                <Input
                    icon="search"
                    placeholder="Search..."
                    onChange={(e) => setSearchBarText(e.target.value)}
                />
                <Card>
                    <Card.Content>
                        <Card.Header>Selected Event</Card.Header>
                        <Card.Description>{eventCode}</Card.Description>
                        <Button
                            disabled={eventCode === ""}
                            color={eventCode !== "" ? "blue" : "grey"}
                            onClick={() => {
                                router.push("/wizard/tbakeys");
                            }}
                        >
                            Set TBA Upload Keys
                        </Button>
                    </Card.Content>
                </Card>
            </Segment>

            <List celled animated>
                {eventList
                    .filter((item: Event_Simple) => {
                        return item.name
                            .toLowerCase()
                            .includes(searchBarText.toLowerCase());
                    })
                    .map((event: Event_Simple) => (
                        <List.Item
                            style={{ cursor: "pointer" }}
                            key={event.key}
                            onClick={() => handleEventSelect(event.key)}
                        >
                            <List.Content>
                                <List.Header>{event.name}</List.Header>
                                <List.Description>{event.key}</List.Description>
                            </List.Content>
                        </List.Item>
                    ))}
            </List>
        </Container>
    );
}
