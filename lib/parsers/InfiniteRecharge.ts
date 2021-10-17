import {
    Match,
    Match_Score_Breakdown_2020,
    Match_Score_Breakdown_2020_Alliance,
} from "tba-api-v3client-ts";
import Parser, { Alliance, AllianceSide } from "./Parser";

type GameStage = "Teleop" | "Auto";
type PowerPortLocations = "Bottom" | "Outer" | "Inner";

export default class InfiniteRechargeParser extends Parser<Match_Score_Breakdown_2020> {
    private hasTargetColor(): boolean {
        const element = this.$("tr:nth-child(11) td:nth-child(2)");
        if (element.text().trim() === "Stage 3 Target") {
            console.log("Has Target Color");
            return true;
        } else {
            console.log("No Target Color");
            return false;
        }
    }

    // Autonomous Points
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

    // Power cells
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
        let rowNumber = 11;
        if (this.hasTargetColor()) rowNumber++;
        return this.getNumberByRowNumber(rowNumber, side);
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
        let rowNumber = 15;
        if (this.hasTargetColor()) rowNumber++;
        return this.getNumberByRowNumber(rowNumber, side);
    }

    // Total
    teleopPoints(side: AllianceSide): number {
        let rowNumber = 16;
        if (this.hasTargetColor()) rowNumber++;
        return this.getNumberByRowNumber(rowNumber, side);
    }

    fouls(side: AllianceSide): number {
        return this.getNumberByTitle("Fouls", side);
    }
    techFouls(side: AllianceSide): number {
        return this.getNumberByTitle("Tech Fouls", side);
    }
    foulPoints(side: AllianceSide): number {
        let rowNumber = 19;
        if (this.hasTargetColor()) rowNumber++;
        return this.getNumberByRowNumber(rowNumber, side);
    }
    finalScore(side: AllianceSide): number {
        let rowNumber = 20;
        if (this.hasTargetColor()) rowNumber++;
        return this.getNumberByRowNumber(rowNumber, side);
    }
    rankingPoints(side: AllianceSide): number {
        let rowNumber = 22;
        if (this.hasTargetColor()) rowNumber++;
        return this.getNumberByRowNumber(rowNumber, side);
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
        const teams: Alliance = this.teams(side);
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
                ? this.rankingPoints(side) +
                  (this.shieldEnergized(side) ? 1 : 0)
                : undefined,
        };
    }

    /**
     * Return the score breakdown of the match.
     */
    get breakdown(): Match_Score_Breakdown_2020 {
        return {
            blue: this.allianceBreakdown(AllianceSide.Blue),
            red: this.allianceBreakdown(AllianceSide.Red),
        };
    }
}
