import * as cheerio from "cheerio";
import type { Cheerio, Element, CheerioAPI } from "cheerio";
import { Match } from "tba-api-v3client-ts";

export enum AllianceSide {
    Red,
    Blue,
}

export type Alliance = {
    station1: number;
    station2: number;
    station3: number;
};

export const CompLevels: { [key: string]: Match.comp_level } = {
    Qualification: Match.comp_level.QM,
    Quarterfinal: Match.comp_level.QF,
    Semifinal: Match.comp_level.SF,
    Final: Match.comp_level.F,
};

export default abstract class Parser<T> {
    protected pageData: string;
    protected $: CheerioAPI;
    constructor(data: string) {
        this.pageData = data;
        this.$ = cheerio.load(data);
    }

    abstract get breakdown(): T;
    abstract finalScore(side: AllianceSide): number;

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

    protected getStringByRowNumber(
        rowNumber: number,
        side: AllianceSide
    ): string {
        const element = this.$(`tr:nth-child(${rowNumber}) td`);
        if (side === AllianceSide.Blue) {
            return element.first().text();
        } else {
            return element.last().text();
        }
    }

    protected getNumberByRowNumber(
        rowNumber: number,
        side: AllianceSide
    ): number {
        const element = this.$(`tr:nth-child(${rowNumber}) td`);
        if (side === AllianceSide.Blue) {
            return parseInt(element.first().text());
        } else {
            return parseInt(element.last().text());
        }
    }

    protected getNumberByTitle(titleAttr: string, side: AllianceSide): number {
        const element = this.$(`*[title="${titleAttr}"]`);
        if (side === AllianceSide.Blue) {
            return parseInt(element.first().text());
        } else {
            return parseInt(element.last().text());
        }
    }

    protected getStringByTitle(titleAttr: string, side: AllianceSide): string {
        const element = this.$(`*[title="${titleAttr}"]`);
        if (side === AllianceSide.Blue) {
            return element.first().text();
        } else {
            return element.last().text();
        }
    }

    protected existsByTitle(titleAttr: string, side: AllianceSide): boolean {
        return (
            this.$(
                `${
                    side === AllianceSide.Blue ? ".info" : ".danger"
                } *[title="${titleAttr}"]`
            ).length > 0
        );
    }
}
