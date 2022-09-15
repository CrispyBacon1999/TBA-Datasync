import {
    Match_Score_Breakdown_2022,
    Match_Score_Breakdown_2022_Alliance,
} from "tba-api-v3client-ts";
import NewParser from "./NewParser";
import { Alliance, AllianceSide } from "./Parser";

type GameStage = "Teleop" | "Auto";
type ExitDirection = "Blue" | "Near" | "Far" | "Red";
type ExitHeight = "Low" | "High";

type CargoBreakdown = {
    lower: LevelCount;
    upper: LevelCount;
};

type LevelCount = {
    near: number;
    far: number;
    blue: number;
    red: number;
};

const selectors = {
    Auto: {
        Low: "tr:nth-child(3)",
        High: "tr:nth-child(4)",
    },
    Teleop: {
        Low: "tr:nth-child(11)",
        High: "tr:nth-child(12)",
    },
};

export default class RapidReactParser extends NewParser<Match_Score_Breakdown_2022> {
    cargoElement(
        side: AllianceSide,
        gameStage: GameStage,
        direction: ExitDirection,
        height: ExitHeight
    ): number {
        const selector = selectors[gameStage][height];

        const row = this.getElementBySelector(selector);
        const text = row
            .find(
                `${side === AllianceSide.Blue ? ".info" : ".danger"} *[title="${
                    height === "Low" ? "Lower" : "Upper"
                } ${direction} Exit"]`
            )
            .text();
        if (isNaN(Number(text))) {
            return 0;
        }
        return parseInt(text);
    }

    /**
     * The way teams are handled in 2022 is different than in 2020.
     * @param side
     * @returns
     */
    teams(side: AllianceSide): Alliance {
        const elements = this.$(
            `table tbody tr:nth-child(1) td:nth-child(${
                2 + (side === AllianceSide.Blue ? 0 : 1)
            }) .row div`
        );
        const teams = elements.map((i, el) => {
            return parseInt(this.$(el).text());
        });

        return {
            station1: teams[0],
            station2: teams[1],
            station3: teams[2],
        };
    }

    cargoBreakdown(side: AllianceSide, gameStage: GameStage): CargoBreakdown {
        const counts = {
            lower: {
                near: this.cargoElement(side, gameStage, "Near", "Low"),
                far: this.cargoElement(side, gameStage, "Far", "Low"),
                blue: this.cargoElement(side, gameStage, "Blue", "Low"),
                red: this.cargoElement(side, gameStage, "Red", "Low"),
            },
            upper: {
                near: this.cargoElement(side, gameStage, "Near", "High"),
                far: this.cargoElement(side, gameStage, "Far", "High"),
                blue: this.cargoElement(side, gameStage, "Blue", "High"),
                red: this.cargoElement(side, gameStage, "Red", "High"),
            },
        };
        return counts;
    }

    robotTaxi(teamNumber: number): "YES" | "NO" {
        const icon = this.getIconByTitle(`Team ${teamNumber} Taxi`);

        if (icon.includes("fa-check")) {
            return "YES";
        }
        return "NO";
    }

    endgame(teamNumber: number): "TRAVERSAL" | "HIGH" | "MID" | "LOW" | "NONE" {
        const text = this.getStringByTitle(
            `Team ${teamNumber} Endgame`,
            AllianceSide.Blue
        ).toLowerCase();
        if (text.includes("traversal")) {
            return "TRAVERSAL";
        }
        if (text.includes("high")) {
            return "HIGH";
        }
        if (text.includes("mid")) {
            return "MID";
        }
        if (text.includes("low")) {
            return "LOW";
        }
        return "NONE";
    }

    autoCargoTotal = (side: AllianceSide): number =>
        this.getNumberByRowNumber(5, side);
    teleopCargoTotal = (side: AllianceSide): number =>
        this.getNumberByRowNumber(13, side);
    matchCargoTotal = (side: AllianceSide): number =>
        this.getNumberByRowNumber(14, side);
    autoTaxiPoints = (side: AllianceSide): number =>
        this.getNumberByRowNumber(7, side);
    autoCargoPoints = (side: AllianceSide): number =>
        this.getNumberByRowNumber(8, side);
    autoPoints = (side: AllianceSide): number =>
        this.getNumberByRowNumber(9, side);
    quintetAchieved(side: AllianceSide): boolean {
        const icon = this.getIconByRowNumber(6, side);
        return icon.includes("fa-check");
    }
    teleopCargoPoints = (side: AllianceSide): number =>
        this.getNumberByRowNumber(15, side);
    endgamePoints = (side: AllianceSide): number =>
        this.getNumberByRowNumber(17, side);
    teleopPoints = (side: AllianceSide): number =>
        this.getNumberByRowNumber(18, side);
    cargoBonusRankingPoint = (side: AllianceSide): boolean =>
        this.existsByTitle("Cargo Bonus Ranking Point Achieved", side);
    hangarBonusRankingPoint = (side: AllianceSide): boolean =>
        this.existsByTitle("Hangar Bonus Ranking Point Achieved", side);

    foulCount(side: AllianceSide): number {
        const foulText = this.getStringByRowNumber(20, side);
        const fouls = foulText.split("•").map((x) => parseInt(x.trim()));
        return fouls[0];
    }
    techFoulCount(side: AllianceSide): number {
        const foulText = this.getStringByRowNumber(20, side);
        const fouls = foulText.split("•").map((x) => parseInt(x.trim()));
        return fouls[1];
    }
    foulPoints = (side: AllianceSide): number =>
        this.getNumberByRowNumber(21, side);
    rp = (side: AllianceSide): number => this.getNumberByRowNumber(24, side);
    totalPoints = (side: AllianceSide): number =>
        this.getNumberByRowNumber(22, side);

    win = (side: AllianceSide): boolean => {
        return this.existsByTitle("Won Match", side);
    };

    allianceBreakdown(side: AllianceSide): Match_Score_Breakdown_2022_Alliance {
        const teams: Alliance = this.teams(side);
        const autoCargo = this.cargoBreakdown(side, "Auto");
        const teleopCargo = this.cargoBreakdown(side, "Teleop");
        return {
            taxiRobot1:
                Match_Score_Breakdown_2022_Alliance.taxiRobot1[
                    this.robotTaxi(teams.station1)
                ],
            taxiRobot2:
                Match_Score_Breakdown_2022_Alliance.taxiRobot2[
                    this.robotTaxi(teams.station2)
                ],
            taxiRobot3:
                Match_Score_Breakdown_2022_Alliance.taxiRobot3[
                    this.robotTaxi(teams.station3)
                ],
            endgameRobot1:
                Match_Score_Breakdown_2022_Alliance.endgameRobot1[
                    this.endgame(teams.station1)
                ],
            endgameRobot2:
                Match_Score_Breakdown_2022_Alliance.endgameRobot2[
                    this.endgame(teams.station2)
                ],
            endgameRobot3:
                Match_Score_Breakdown_2022_Alliance.endgameRobot3[
                    this.endgame(teams.station3)
                ],
            autoCargoLowerNear: autoCargo.lower.near,
            autoCargoLowerFar: autoCargo.lower.far,
            autoCargoLowerBlue: autoCargo.lower.blue,
            autoCargoLowerRed: autoCargo.lower.red,
            autoCargoUpperNear: autoCargo.upper.near,
            autoCargoUpperFar: autoCargo.upper.far,
            autoCargoUpperBlue: autoCargo.upper.blue,
            autoCargoUpperRed: autoCargo.upper.red,
            autoCargoTotal: this.autoCargoTotal(side),
            teleopCargoLowerNear: teleopCargo.lower.near,
            teleopCargoLowerFar: teleopCargo.lower.far,
            teleopCargoLowerBlue: teleopCargo.lower.blue,
            teleopCargoLowerRed: teleopCargo.lower.red,
            teleopCargoUpperNear: teleopCargo.upper.near,
            teleopCargoUpperFar: teleopCargo.upper.far,
            teleopCargoUpperBlue: teleopCargo.upper.blue,
            teleopCargoUpperRed: teleopCargo.upper.red,
            teleopCargoTotal: this.teleopCargoTotal(side),
            matchCargoTotal: this.matchCargoTotal(side),
            autoTaxiPoints: this.autoTaxiPoints(side),
            autoCargoPoints: this.autoCargoPoints(side),
            autoPoints: this.autoPoints(side),
            quintetAchieved: this.quintetAchieved(side),
            teleopCargoPoints: this.teleopCargoPoints(side),
            endgamePoints: this.endgamePoints(side),
            teleopPoints: this.teleopPoints(side),
            cargoBonusRankingPoint: this.cargoBonusRankingPoint(side),
            hangarBonusRankingPoint: this.hangarBonusRankingPoint(side),
            foulCount: this.foulCount(side),
            techFoulCount: this.techFoulCount(side),
            foulPoints: this.foulPoints(side),
            rp: this.rp(side),
            totalPoints: this.totalPoints(side),
        };
    }

    finalScore(side: AllianceSide): number {
        return this.totalPoints(side);
    }

    /**
     * Return the score breakdown of the match.
     */
    get breakdown(): Match_Score_Breakdown_2022 {
        return {
            blue: this.allianceBreakdown(AllianceSide.Blue),
            red: this.allianceBreakdown(AllianceSide.Red),
        };
    }
}
