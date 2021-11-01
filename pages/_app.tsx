import "semantic-ui-css/semantic.min.css";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Container, Grid, Icon, Step } from "semantic-ui-react";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState("");
    const fullRoute = router.pathname.split("/");

    useEffect(() => {
        setCurrentPage(fullRoute[fullRoute.length - 1]);
    }, [fullRoute]);

    return (
        <>
            <Head>
                <link rel="stylesheet" href="/assets/clippy.css" />
                <title>TBA Datasync</title>
            </Head>
            <div className="wizard-grid">
                <Step.Group vertical size="mini">
                    <Step
                        active={currentPage === "eventselect"}
                        href="/wizard/eventselect"
                    >
                        <Icon name="calendar"></Icon>
                        <Step.Content>
                            <Step.Title>Event Selection</Step.Title>
                        </Step.Content>
                    </Step>
                    <Step
                        active={currentPage === "tbakeys"}
                        href="/wizard/tbakeys"
                    >
                        <Icon name="user secret"></Icon>
                        <Step.Content>
                            <Step.Title>Event Keys</Step.Title>
                        </Step.Content>
                    </Step>
                    <Step
                        active={currentPage === "teamselect"}
                        href="/wizard/teamselect"
                    >
                        <Icon name="add user"></Icon>
                        <Step.Content>
                            <Step.Title>Team Selection</Step.Title>
                        </Step.Content>
                    </Step>
                    <Step
                        active={currentPage === "qualschedule"}
                        href="/wizard/qualschedule"
                    >
                        <Icon name="calendar plus outline"></Icon>
                        <Step.Content>
                            <Step.Title>Qualification Schedule</Step.Title>
                        </Step.Content>
                    </Step>
                    <Step
                        active={currentPage === "qualupload"}
                        href="/wizard/qualupload"
                    >
                        <Icon name="cloud upload"></Icon>
                        <Step.Content>
                            <Step.Title>Qualification Uploads</Step.Title>
                        </Step.Content>
                    </Step>
                    <Step
                        active={currentPage === "allianceselect"}
                        href="/wizard/allianceselect"
                    >
                        <Icon name="users"></Icon>
                        <Step.Content>
                            <Step.Title>Alliance Selection</Step.Title>
                        </Step.Content>
                    </Step>
                    <Step
                        active={currentPage === "elimschedule"}
                        href="/wizard/elimschedule"
                    >
                        <Icon name="calendar plus"></Icon>
                        <Step.Content>
                            <Step.Title>Elimination Schedule</Step.Title>
                        </Step.Content>
                    </Step>
                    <Step
                        active={currentPage === "elimupload"}
                        href="/wizard/elimupload"
                    >
                        <Icon name="cloud upload"></Icon>
                        <Step.Content>
                            <Step.Title>Elimination Uploads</Step.Title>
                        </Step.Content>
                    </Step>
                </Step.Group>
                <div className="page-data">
                    <Grid columns={16}>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <Component {...pageProps} />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
            </div>
        </>
    );
}
export default MyApp;
