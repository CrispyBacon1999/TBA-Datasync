import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import {
    Button,
    Card,
    Container,
    Form,
    Grid,
    Header,
    Input,
    List,
    ListItemProps,
    Message,
    Popup,
    Segment,
    Step,
} from "semantic-ui-react";
import type { Event_Simple } from "tba-api-v3client-ts";
import { useClippy } from "../../lib/clippy/clippy";

import Link from "next/link";
import { getCurrentEvent, getTBAWriteCredentials } from "../../lib/fileio/data";
import { InferGetServerSidePropsType } from "next";

const eventRequestURL = "https://www.thebluealliance.com/request/apiwrite";
const tbaAccountURL = "https://www.thebluealliance.com/account";

export default function EventSelect(
    props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
    const [wizardStage, setWizardStage] = useState(props.wizardState);
    const [eventCode, setEventCode] = useState(props.eventCode);
    const [clientId, setClientId] = useState(props.writeKeys.clientId);
    const [clientSecret, setClientSecret] = useState(props.writeKeys.secret);
    const [popupOpen, setPopupOpen] = useState(false);

    const router = useRouter();
    // const { clippy } = useClippy("Bonzi");

    // useEffect(() => {
    //     clippy.then((clippy) => {
    //         console.log("Clippy loaded");
    //         clippy.show();
    //         // if (!eventCode) {
    //         clippy.moveTo(220, 0);
    //         clippy.speak(
    //             "Looks like you don't have an event selected. Pick one before you do anything else!"
    //         );
    //         clippy.play("GestureRight");
    //         // }
    //     });
    // }, []);

    return (
        <Container>
            <Header>TBA Write API Setup:</Header>
            <Step.Group ordered>
                <Step active={wizardStage === 0} completed={wizardStage > 0}>
                    Copy Event Code
                </Step>
                <Step active={wizardStage === 1} completed={wizardStage > 1}>
                    Request Access to Event
                </Step>
                <Step active={wizardStage === 2} completed={wizardStage > 2}>
                    Copy Event Client ID and Secret
                </Step>
            </Step.Group>
            <Segment>
                <Popup
                    open={popupOpen}
                    on="click"
                    content="Copied to clipboard!"
                    trigger={
                        <Button
                            color={wizardStage === 0 ? "blue" : "grey"}
                            onClick={() => {
                                navigator.clipboard.writeText(eventCode);
                                if (wizardStage === 0) {
                                    setWizardStage(1);
                                }
                                setPopupOpen(true);
                                setTimeout(() => {
                                    setPopupOpen(false);
                                }, 3000);
                            }}
                        >
                            Copy event code to clipboard
                        </Button>
                    }
                ></Popup>

                <Button
                    color={wizardStage === 1 ? "blue" : "grey"}
                    as="a"
                    href={eventRequestURL}
                    target="_blank"
                    onClick={() => {
                        setWizardStage(2);
                    }}
                >
                    TBA Event Request Page
                </Button>
                <Button
                    color={wizardStage === 2 ? "blue" : "grey"}
                    as="a"
                    href={tbaAccountURL}
                    target="_blank"
                    onClick={() => {
                        setWizardStage(3);
                    }}
                >
                    TBA Account Page
                </Button>
                <Button
                    disabled={clientId === "" || clientSecret === ""}
                    color={wizardStage === 3 ? "blue" : "grey"}
                    onClick={() => {
                        fetch("/api/app/writeKeys", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                clientId,
                                secret: clientSecret,
                            }),
                        }).then(() => {
                            router.push("/wizard/teamselect");
                        });
                    }}
                >
                    Set event teams
                </Button>
            </Segment>
            <Segment>
                <Message info>
                    On the account page, scroll until the <b>Write API Keys</b>{" "}
                    section, then pull the values from the Auth ID and Auth
                    Secret columns for your event
                </Message>
                <Form>
                    <Form.Field>
                        <label>Auth Id</label>
                        <Input
                            value={clientId}
                            onChange={(e) => {
                                setClientId(e.target.value);
                            }}
                            placeholder="Auth ID"
                            fluid
                        ></Input>
                    </Form.Field>
                    <Form.Field>
                        <label>Auth Secret</label>
                        <Input
                            value={clientSecret}
                            onChange={(e) => {
                                setClientSecret(e.target.value);
                            }}
                            placeholder="Auth Secret"
                            fluid
                        ></Input>
                    </Form.Field>
                </Form>
            </Segment>
        </Container>
    );
}

export async function getServerSideProps() {
    const eventCode = getCurrentEvent();
    const writeKeys = getTBAWriteCredentials();
    const wizardState = writeKeys.clientId && writeKeys.secret ? 3 : 0;

    return { props: { eventCode, writeKeys, wizardState } };
}
