import {
    Match,
    Match_Score_Breakdown_2020,
    Match_Score_Breakdown_2020_Alliance,
} from "tba-api-v3client-ts";
import Parser from "./Parser";
import type { Cheerio, Element, CheerioAPI } from "cheerio";

type Alliance = {
    station1: number;
    station2: number;
    station3: number;
};

const CompLevels: { [key: string]: Match.comp_level } = {
    Qualification: Match.comp_level.QM,
    Quarterfinal: Match.comp_level.QF,
    Semifinal: Match.comp_level.SF,
    Final: Match.comp_level.F,
};

export default class InfiniteRechargeParser extends Parser<Match_Score_Breakdown_2020> {
    // get breakdown(): Match_Score_Breakdown_2020 {
    //     return {} as Match_Score_Breakdown_2020;
    // }

    get key(): string {
        const title = this.$("main .container-fluid .container h3")
            .first()
            .text()
            .trim();
        const splitTitle = title.split(" ");
        const compLevel = CompLevels[splitTitle[0]];
        const setNum = this.setNumber;
        const eventCode = process.env.CURRENT_EVENT as string;
        return `${eventCode}_${compLevel}${setNum !== -1 ? setNum + "m" : ""}${
            this.matchNumber
        }`;
    }

    get matchNumber(): number {
        const title = this.$("main .container-fluid .container h3")
            .first()
            .text()
            .trim();
        const splitTitle = title.split(" ");

        const tiebreaker = splitTitle[1] === "Tiebreaker";
        // Grab the match number
        let matchNum = parseInt(splitTitle[tiebreaker ? 2 : 1]);
        console.log(matchNum);
        const compLevel = CompLevels[splitTitle[0]];
        console.log(compLevel);
        // For different competition levels, calculate out the match number, without the set number
        if (compLevel === Match.comp_level.QF) {
            // Add 8 to the match number if it's a tiebreaker match
            matchNum += tiebreaker ? 8 : 0;
            // Do integer division to get the actual match number, along with the set number
            return Math.floor((matchNum - 1) / 4) + 1;
        } else if (compLevel === Match.comp_level.SF) {
            matchNum += tiebreaker ? 4 : 0;
            return Math.floor((matchNum - 1) / 2) + 1;
        } else if (compLevel === Match.comp_level.F) {
            return matchNum;
        } else {
            return matchNum;
        }
    }

    get compLevel(): Match.comp_level {
        const title = this.$("main .container-fluid .container h3")
            .first()
            .text()
            .trim();
        const splitTitle = title.split(" ");
        const compLevel = CompLevels[splitTitle[0]];
        return compLevel;
    }

    get setNumber(): number {
        const title = this.$("main .container-fluid .container h3")
            .first()
            .text()
            .trim();
        const splitTitle = title.split(" ");
        // Check if it's a tiebreaker match, super jank way of doing it
        const tiebreaker = splitTitle[1] === "Tiebreaker";
        // Grab the match number
        let matchNum = parseInt(splitTitle[tiebreaker ? 2 : 1]);
        const compLevel = CompLevels[splitTitle[0]];
        if (compLevel === Match.comp_level.QF) {
            matchNum += tiebreaker ? 8 : 0;
            return ((matchNum - 1) % 4) + 1;
        } else if (compLevel === Match.comp_level.SF) {
            matchNum += tiebreaker ? 4 : 0;
            return ((matchNum - 1) % 2) + 1;
        } else if (compLevel === Match.comp_level.F) {
            return 1;
        } else {
            return -1;
        }
    }

    // Pull blue teams
    get blueTeams(): Alliance {
        const teamsBulletSeparated = this.$("table thead tr th").first().text();
        console.log(teamsBulletSeparated);
        const teams = teamsBulletSeparated
            .split("•")
            .map((team) => parseInt(team.trim()));
        return {
            station1: teams[0],
            station2: teams[1],
            station3: teams[2],
        };
    }

    // Pull red teams
    get redTeams(): Alliance {
        const teamsBulletSeparated = this.$("table thead tr th").last().text();
        const teams = teamsBulletSeparated
            .split("•")
            .map((team) => parseInt(team.trim()));
        return {
            station1: teams[0],
            station2: teams[1],
            station3: teams[2],
        };
    }

    teamInitiationLine(team: number): boolean {
        return (
            this.$(
                `table tbody span[title="Team ${team} Initiation Line"]`
            ).text() === "Yes"
        );
    }

    // Autonomous
    get blueAutoCellsBottom(): number {
        return parseInt(
            this.$('span[title="Auto Cells, Bottom Port"]').first().text()
        );
    }
    get blueAutoCellsOuter(): number {
        return parseInt(
            this.$('span[title="Auto Cells, Outer Port"]').first().text()
        );
    }
    get blueAutoCellsInner(): number {
        return parseInt(
            this.$('span[title="Auto Cells, Inner Port"]').first().text()
        );
    }
    get redAutoCellsBottom(): number {
        return parseInt(
            this.$('span[title="Auto Cells, Bottom Port"]').last().text()
        );
    }
    get redAutoCellsOuter(): number {
        return parseInt(
            this.$('span[title="Auto Cells, Outer Port"]').last().text()
        );
    }
    get redAutoCellsInner(): number {
        return parseInt(
            this.$('span[title="Auto Cells, Inner Port"]').last().text()
        );
    }
    get blueInitiationLinePoints(): number {
        return parseInt(this.$("tr:nth-child(4) td").first().text());
    }
    get redInitiationLinePoints(): number {
        return parseInt(this.$("tr:nth-child(4) td").last().text());
    }
    get blueAutoPowerCellPoints(): number {
        return parseInt(this.$("tr:nth-child(5) td").first().text());
    }
    get redAutoPowerCellPoints(): number {
        return parseInt(this.$("tr:nth-child(5) td").last().text());
    }
    get blueAutoPoints(): number {
        return parseInt(this.$("tr:nth-child(6) td").first().text());
    }
    get redAutoPoints(): number {
        return parseInt(this.$("tr:nth-child(6) td").last().text());
    }

    // Teleop cells
    get blueTeleopCellsBottom(): number {
        return parseInt(
            this.$('span[title="Teleop Cells, Bottom Port"]').first().text()
        );
    }
    get blueTeleopCellsOuter(): number {
        return parseInt(
            this.$('span[title="Teleop Cells, Outer Port"]').first().text()
        );
    }
    get blueTeleopCellsInner(): number {
        return parseInt(
            this.$('span[title="Teleop Cells, Inner Port"]').first().text()
        );
    }
    get redTeleopCellsBottom(): number {
        return parseInt(
            this.$('span[title="Teleop Cells, Bottom Port"]').last().text()
        );
    }
    get redTeleopCellsOuter(): number {
        return parseInt(
            this.$('span[title="Teleop Cells, Outer Port"]').last().text()
        );
    }
    get redTeleopCellsInner(): number {
        return parseInt(
            this.$('span[title="Teleop Cells, Inner Port"]').last().text()
        );
    }
    get blueTeleopPowerCellPoints(): number {
        return parseInt(this.$("tr:nth-child(9) td").first().text());
    }
    get redTeleopPowerCellPoints(): number {
        return parseInt(this.$("tr:nth-child(9) td").last().text());
    }

    // Control Panel
    get blueControlPanelStage1(): boolean {
        return (
            this.$('span[title="Stage 1 Activated"]').first().text() === "Yes"
        );
    }
    get blueControlPanelStage2(): boolean {
        return (
            this.$('span[title="Stage 2 Activated"]').first().text() === "Yes"
        );
    }
    get blueControlPanelStage3(): boolean {
        return (
            this.$('span[title="Stage 3 Activated"]').first().text() === "Yes"
        );
    }
    get redControlPanelStage1(): boolean {
        return (
            this.$('span[title="Stage 1 Activated"]').last().text() === "Yes"
        );
    }
    get redControlPanelStage2(): boolean {
        return (
            this.$('span[title="Stage 2 Activated"]').last().text() === "Yes"
        );
    }
    get redControlPanelStage3(): boolean {
        return (
            this.$('span[title="Stage 3 Activated"]').last().text() === "Yes"
        );
    }
    get blueControlPanelPoints(): number {
        return parseInt(this.$("tr:nth-child(11) td").first().text());
    }
    get redControlPanelPoints(): number {
        return parseInt(this.$("tr:nth-child(11) td").last().text());
    }

    // Endgame
    teamEndgame(team: number): string {
        return this.$(`table tbody span[title="Team ${team} Endgame"]`).text();
    }
    get blueRungLevel(): boolean {
        return (
            this.$(`table tbody span[title="Shield Generator Bar Level"]`)
                .first()
                .text() === "Rung was Level"
        );
    }
    get redRungLevel(): boolean {
        return (
            this.$(`table tbody span[title="Shield Generator Bar Level"]`)
                .last()
                .text() === "Rung was Level"
        );
    }
    get blueEndgamePoints(): number {
        return parseInt(this.$("tr:nth-child(15) td").first().text());
    }
    get redEndgamePoints(): number {
        return parseInt(this.$("tr:nth-child(15) td").last().text());
    }

    // Total
    get blueTeleopPoints(): number {
        return parseInt(this.$("tr:nth-child(16) td").first().text());
    }
    get redTeleopPoints(): number {
        return parseInt(this.$("tr:nth-child(16) td").last().text());
    }

    get blueFouls(): number {
        return parseInt(
            this.$(`table tbody span[title="Fouls"]`).first().text()
        );
    }
    get redFouls(): number {
        return parseInt(
            this.$(`table tbody span[title="Fouls"]`).last().text()
        );
    }
    get blueTechFouls(): number {
        return parseInt(
            this.$(`table tbody span[title="Tech Fouls"]`).first().text()
        );
    }
    get redTechFouls(): number {
        return parseInt(
            this.$(`table tbody span[title="Tech Fouls"]`).last().text()
        );
    }
    get blueFoulPoints(): number {
        return parseInt(this.$("tr:nth-child(19) td").first().text());
    }
    get redFoulPoints(): number {
        return parseInt(this.$("tr:nth-child(19) td").last().text());
    }
    get blueFinalScore(): number {
        return parseInt(this.$("tr:nth-child(20) td").first().text());
    }
    get redFinalScore(): number {
        return parseInt(this.$("tr:nth-child(20) td").last().text());
    }
    get blueRankingPoints(): number {
        return parseInt(this.$("tr:nth-child(22) td").first().text());
    }
    get redRankingPoints(): number {
        return parseInt(this.$("tr:nth-child(22) td").last().text());
    }
    get blueShieldEnergized(): boolean {
        return (
            this.$('.info img[title="Shield Energized Ranking Point Achieved"]')
                .length > 0
        );
    }
    get redShieldEnergized(): boolean {
        return (
            this.$(
                '.danger img[title="Shield Energized Ranking Point Achieved"]'
            ).length > 0
        );
    }
    get blueShieldOperational(): boolean {
        return (
            this.$(
                '.info img[title="Shield Operational Ranking Point Achieved"]'
            ).length > 0
        );
    }
    get redShieldOperational(): boolean {
        return (
            this.$(
                '.danger img[title="Shield Operational Ranking Point Achieved"]'
            ).length > 0
        );
    }

    /**
     * Return the score breakdown of the match.
     */
    get breakdown(): any | Match_Score_Breakdown_2020 {
        const redTeams = this.redTeams;
        const blueTeams = this.blueTeams;
        const compLevel = this.compLevel;
        return {
            blue: {
                initLineRobot1: this.teamInitiationLine(blueTeams.station1)
                    ? "Exited"
                    : "None",
                initLineRobot2: this.teamInitiationLine(blueTeams.station2)
                    ? "Exited"
                    : "None",
                initLineRobot3: this.teamInitiationLine(blueTeams.station3)
                    ? "Exited"
                    : "None",
                endgameRobot1: this.teamEndgame(blueTeams.station1),
                endgameRobot2: this.teamEndgame(blueTeams.station2),
                endgameRobot3: this.teamEndgame(blueTeams.station3),
                autoCellsBottom: this.blueAutoCellsBottom,
                autoCellsOuter: this.blueAutoCellsOuter,
                autoCellsInner: this.blueAutoCellsInner,
                teleopCellsBottom: this.blueTeleopCellsBottom,
                teleopCellsOuter: this.blueTeleopCellsOuter,
                teleopCellsInner: this.blueTeleopCellsInner,
                stage1Activated: this.blueControlPanelStage1,
                stage2Activated: this.blueControlPanelStage2,
                stage3Activated: this.blueControlPanelStage3,
                stage3TargetColor: "Unknown",
                endgameRungIsLevel: this.blueRungLevel ? "IsLevel" : "NotLevel",
                autoInitLinePoints: this.blueInitiationLinePoints,
                autoCellPoints: this.blueAutoPowerCellPoints,
                autoPoints: this.blueAutoPoints,
                controlPanelPoints: this.blueControlPanelPoints,
                endgamePoints: this.blueEndgamePoints,
                teleopCellPoints: this.blueTeleopPowerCellPoints,
                teleopPoints: this.blueTeleopPoints,
                foulPoints: this.blueFoulPoints,
                totalPoints: this.blueFinalScore,
                shieldOperationalRankingPoint: this.blueShieldOperational,
                shieldEnergizedRankingPoint: this.blueShieldEnergized,
                foulCount: this.blueFouls,
                techFoulCount: this.blueTechFouls,
                // adjustPoints: 0,
                rp:
                    compLevel === Match.comp_level.QM
                        ? this.blueRankingPoints
                        : undefined,
            },
            red: {
                initLineRobot1: this.teamInitiationLine(redTeams.station1)
                    ? "Exited"
                    : "None",
                initLineRobot2: this.teamInitiationLine(redTeams.station2)
                    ? "Exited"
                    : "None",
                initLineRobot3: this.teamInitiationLine(redTeams.station3)
                    ? "Exited"
                    : "None",
                endgameRobot1: this.teamEndgame(redTeams.station1),
                endgameRobot2: this.teamEndgame(redTeams.station2),
                endgameRobot3: this.teamEndgame(redTeams.station3),
                autoCellsBottom: this.redAutoCellsBottom,
                autoCellsOuter: this.redAutoCellsOuter,
                autoCellsInner: this.redAutoCellsInner,
                teleopCellsBottom: this.redTeleopCellsBottom,
                teleopCellsOuter: this.redTeleopCellsOuter,
                teleopCellsInner: this.redTeleopCellsInner,
                stage1Activated: this.redControlPanelStage1,
                stage2Activated: this.redControlPanelStage2,
                stage3Activated: this.redControlPanelStage3,
                stage3TargetColor: "Unknown",
                endgameRungIsLevel: this.redRungLevel ? "IsLevel" : "NotLevel",
                autoInitLinePoints: this.redInitiationLinePoints,
                autoCellPoints: this.redAutoPowerCellPoints,
                autoPoints: this.redAutoPoints,
                controlPanelPoints: this.redControlPanelPoints,
                endgamePoints: this.redEndgamePoints,
                teleopCellPoints: this.redTeleopPowerCellPoints,
                teleopPoints: this.redTeleopPoints,
                foulPoints: this.redFoulPoints,
                totalPoints: this.redFinalScore,
                shieldOperationalRankingPoint: this.redShieldOperational,
                shieldEnergizedRankingPoint: this.redShieldEnergized,
                foulCount: this.redFouls,
                techFoulCount: this.redTechFouls,
                // adjustPoints: 0,
                rp:
                    compLevel === Match.comp_level.QM
                        ? this.redRankingPoints
                        : undefined,
            },
        };
    }

    get match(): any {
        const redTeams = this.redTeams;
        const blueTeams = this.blueTeams;
        const set = this.setNumber;

        return {
            key: this.key,
            comp_level: this.compLevel,
            set_number: set === -1 ? 1 : set,
            match_number: this.matchNumber,
            event_key: process.env.CURRENT_EVENT as string,
            // score_breakdown: JSON.stringify(this.breakdown),
            score_breakdown: this.breakdown,
            alliances: {
                red: {
                    teams: [
                        "frc" + redTeams.station1,
                        "frc" + redTeams.station2,
                        "frc" + redTeams.station3,
                    ],
                    score: this.redFinalScore,
                },
                blue: {
                    teams: [
                        "frc" + blueTeams.station1,
                        "frc" + blueTeams.station2,
                        "frc" + blueTeams.station3,
                    ],
                    score: this.blueFinalScore,
                },
            },
        };
    }
}
