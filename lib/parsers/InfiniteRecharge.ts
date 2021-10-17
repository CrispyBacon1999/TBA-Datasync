import {
    Match,
    Match_Score_Breakdown_2020,
    Match_Score_Breakdown_2020_Alliance,
} from "tba-api-v3client-ts";
import Parser, { AllianceSide } from "./Parser";
import type { Cheerio, Element, CheerioAPI } from "cheerio";

type Alliance = {
    station1: number;
    station2: number;
    station3: number;
};

type GameStage = "Teleop" | "Auto";
type PowerPortLocations = "Bottom" | "Outer" | "Inner";

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

    teams(side: AllianceSide): Alliance {
        const element = this.$("table thead tr th");
        let teamsBulletSeparated = "";
        if (side === AllianceSide.Blue) {
            teamsBulletSeparated = element.first().text();
        } else {
            teamsBulletSeparated = element.last().text();
        }
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

    initiationLinePoints(side: AllianceSide) {
        return this.getNumberByRowNumber(4, side);
    }
    autoPowerCellPoints(side: AllianceSide) {
        return this.getNumberByRowNumber(5, side);
    }
    autoPoints(side: AllianceSide): number {
        return this.getNumberByRowNumber(6, side);
    }

    // Teleop cells
    private cellsByArea(
        stage: GameStage,
        location: PowerPortLocations,
        side: AllianceSide
    ) {
        return this.getNumberByTitle(`${stage} Cells, ${location} Port`, side);
    }
    autoCellsByArea(location: PowerPortLocations, side: AllianceSide) {
        return this.cellsByArea("Auto", location, side);
    }
    teleopCellsByArea(location: PowerPortLocations, side: AllianceSide) {
        return this.cellsByArea("Teleop", location, side);
    }
    teleopPowerCellPoints(side: AllianceSide): number {
        return this.getNumberByRowNumber(9, side);
    }

    // Control Panel
    controlPanelStage(stage: number, side: AllianceSide): boolean {
        return (
            this.getStringByTitle(`Stage ${stage} Activated`, side) === "Yes"
        );
    }
    controlPanelPoints(side: AllianceSide): number {
        return this.getNumberByRowNumber(11, side);
    }

    // Endgame
    teamEndgame(team: number): string {
        return this.$(`table tbody span[title="Team ${team} Endgame"]`).text();
    }

    rungLevel(side: AllianceSide): boolean {
        return (
            this.getStringByTitle("Shield Generator Bar Level", side) ===
            "Rung was Level"
        );
    }
    endgamePoints(side: AllianceSide): number {
        return this.getNumberByRowNumber(15, side);
    }

    // Total
    teleopPoints(side: AllianceSide): number {
        return this.getNumberByRowNumber(16, side);
    }

    fouls(side: AllianceSide): number {
        return this.getNumberByTitle("Fouls", side);
    }
    techFouls(side: AllianceSide): number {
        return this.getNumberByTitle("Tech Fouls", side);
    }
    foulPoints(side: AllianceSide): number {
        return this.getNumberByRowNumber(19, side);
    }
    finalScore(side: AllianceSide): number {
        return this.getNumberByRowNumber(20, side);
    }
    rankingPoints(side: AllianceSide): number {
        return this.getNumberByRowNumber(22, side);
    }
    shieldEnergized(side: AllianceSide): boolean {
        return this.existsByTitle(
            "Shield Energized Ranking Point Achieved",
            side
        );
    }
    shieldOperational(side: AllianceSide): boolean {
        return this.existsByTitle(
            "Shield Operational Ranking Point Achieved",
            side
        );
    }

    private shouldShowRankingPoints(): boolean {
        return this.compLevel === Match.comp_level.QM;
    }

    allianceBreakdown(side: AllianceSide): Match_Score_Breakdown_2020_Alliance {
        const teams = this.teams(side);
        const compLevel = this.compLevel;
        return {
            initLineRobot1: this.teamInitiationLine(teams.station1)
                ? "Exited"
                : "None",
            initLineRobot2: this.teamInitiationLine(teams.station2)
                ? "Exited"
                : "None",
            initLineRobot3: this.teamInitiationLine(teams.station3)
                ? "Exited"
                : "None",
            endgameRobot1: this.teamEndgame(teams.station1),
            endgameRobot2: this.teamEndgame(teams.station2),
            endgameRobot3: this.teamEndgame(teams.station3),
            autoCellsBottom: this.autoCellsByArea("Bottom", side),
            autoCellsOuter: this.autoCellsByArea("Outer", side),
            autoCellsInner: this.autoCellsByArea("Inner", side),
            teleopCellsBottom: this.teleopCellsByArea("Bottom", side),
            teleopCellsOuter: this.teleopCellsByArea("Outer", side),
            teleopCellsInner: this.teleopCellsByArea("Inner", side),
            stage1Activated: this.controlPanelStage(1, side),
            stage2Activated: this.controlPanelStage(2, side),
            stage3Activated: this.controlPanelStage(3, side),
            stage3TargetColor: "Unknown",
            endgameRungIsLevel: this.rungLevel(side) ? "IsLevel" : "NotLevel",
            autoInitLinePoints: this.initiationLinePoints(side),
            autoCellPoints: this.autoPowerCellPoints(side),
            autoPoints: this.autoPoints(side),
            controlPanelPoints: this.controlPanelPoints(side),
            endgamePoints: this.endgamePoints(side),
            teleopCellPoints: this.teleopPowerCellPoints(side),
            teleopPoints: this.teleopPoints(side),
            foulPoints: this.foulPoints(side),
            totalPoints: this.finalScore(side),
            shieldOperationalRankingPoint: this.shieldOperational(side),
            shieldEnergizedRankingPoint: this.shieldEnergized(side),
            foulCount: this.fouls(side),
            techFoulCount: this.techFouls(side),
            rp: this.shouldShowRankingPoints()
                ? this.rankingPoints(side)
                : undefined,
        };
    }

    /**
     * Return the score breakdown of the match.
     */
    get breakdown(): any | Match_Score_Breakdown_2020 {
        return {
            blue: this.allianceBreakdown(AllianceSide.Blue),
            red: this.allianceBreakdown(AllianceSide.Red),
        };
    }

    get match(): any {
        const redTeams = this.teams(AllianceSide.Red);
        const blueTeams = this.teams(AllianceSide.Blue);
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
                    score: this.finalScore(AllianceSide.Red),
                },
                blue: {
                    teams: [
                        "frc" + blueTeams.station1,
                        "frc" + blueTeams.station2,
                        "frc" + blueTeams.station3,
                    ],
                    score: this.finalScore(AllianceSide.Blue),
                },
            },
        };
    }
}
