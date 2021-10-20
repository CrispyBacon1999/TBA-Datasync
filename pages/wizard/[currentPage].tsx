import { useRouter } from "next/dist/client/router";
import React, { useState } from "react";
import { Grid, Icon, Step } from "semantic-ui-react";
import AllianceSelect from "../../components/AllianceSelect";
import EliminationSchedule from "../../components/EliminationSchedule";
import EliminationUploads from "../../components/EliminationUploads";
import EventSelect from "../../components/EventSelect";
import QualSchedule from "../../components/QualSchedule";
import QualUploads from "../../components/QualUploads";
import TBAKeys from "../../components/TBAKeys";
import TeamSelect from "../../components/TeamSelect";

const pages: { [key: string]: JSX.Element } = {
    eventSelect: <EventSelect></EventSelect>,
    eventKeys: <TBAKeys></TBAKeys>,
    teamSelect: <TeamSelect></TeamSelect>,
    qualSchedule: <QualSchedule></QualSchedule>,
    qualUpload: <QualUploads></QualUploads>,
    allianceSelect: <AllianceSelect></AllianceSelect>,
    elimSchedule: <EliminationSchedule></EliminationSchedule>,
    elimUpload: <EliminationUploads></EliminationUploads>,
};

export default function WizardPage() {
    const router = useRouter();
    const currentPage = router.query.currentPage as string;

    return (
        <div className="wizard-grid">
            <Step.Group vertical>
                <Step
                    active={currentPage === "eventSelect"}
                    href="/wizard/eventSelect"
                >
                    <Icon name="calendar"></Icon>
                    <Step.Content>
                        <Step.Title>Event Selection</Step.Title>
                    </Step.Content>
                </Step>
                <Step
                    active={currentPage === "eventKeys"}
                    href="/wizard/eventKeys"
                >
                    <Icon name="user secret"></Icon>
                    <Step.Content>
                        <Step.Title>Event Keys</Step.Title>
                    </Step.Content>
                </Step>
                <Step
                    active={currentPage === "teamSelect"}
                    href="/wizard/teamSelect"
                >
                    <Icon name="add user"></Icon>
                    <Step.Content>
                        <Step.Title>Team Selection</Step.Title>
                    </Step.Content>
                </Step>
                <Step
                    active={currentPage === "qualSchedule"}
                    href="/wizard/qualSchedule"
                >
                    <Icon name="calendar plus outline"></Icon>
                    <Step.Content>
                        <Step.Title>Qualification Schedule</Step.Title>
                    </Step.Content>
                </Step>
                <Step
                    active={currentPage === "qualUpload"}
                    href="/wizard/qualUpload"
                >
                    <Icon name="cloud upload"></Icon>
                    <Step.Content>
                        <Step.Title>Qualification Uploads</Step.Title>
                    </Step.Content>
                </Step>
                <Step
                    active={currentPage === "allianceSelect"}
                    href="/wizard/allianceSelect"
                >
                    <Icon name="users"></Icon>
                    <Step.Content>
                        <Step.Title>Alliance Selection</Step.Title>
                    </Step.Content>
                </Step>
                <Step
                    active={currentPage === "elimSchedule"}
                    href="/wizard/elimSchedule"
                >
                    <Icon name="calendar plus"></Icon>
                    <Step.Content>
                        <Step.Title>Elimination Schedule</Step.Title>
                    </Step.Content>
                </Step>
                <Step
                    active={currentPage === "elimUpload"}
                    href="/wizard/elimUpload"
                >
                    <Icon name="cloud upload"></Icon>
                    <Step.Content>
                        <Step.Title>Elimination Uploads</Step.Title>
                    </Step.Content>
                </Step>
            </Step.Group>
            <div className="page-data">{pages[currentPage]}</div>
        </div>
    );
}
