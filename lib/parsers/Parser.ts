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

    /**
     * @return {string} The TBA key for the match
     */
    get key(): string {
        const eventCode = process.env.CURRENT_EVENT as string;
        const matchCode = this.matchCode;
        return `${eventCode}_${matchCode}`;
    }

    /**
     * @return {string} the short code for the match (i.e. qm1, sf1m2, etc)
     */
    get matchCode(): string {
        const compLevel = this.compLevel;
        const setNum = this.setNumber;
        const matchNum = this.matchNumber;
        return `${compLevel}${setNum !== -1 ? setNum + "m" : ""}${matchNum}`;
    }

    get compLevel(): Match.comp_level {
        const splitTitle = this.splitTitle;
        const compLevel = CompLevels[splitTitle[0]];
        return compLevel;
    }

    /**
     * @return {number} the match number within the current set/series of matches
     */
    get matchNumber(): number {
        const splitTitle: string[] = this.splitTitle;
        const compLevel = CompLevels[splitTitle[0]];
        const tiebreaker: boolean = splitTitle[1] === "Tiebreaker";

        // Grab the match number
        let matchNum = parseInt(splitTitle[tiebreaker ? 2 : 1]);
        console.log(`Raw Match Number: ${compLevel}${matchNum}`);

        // For different competition levels, calculate out the match number, without the set number
        if (compLevel === Match.comp_level.EF) {
            matchNum += tiebreaker ? 16 : 0;
            return Math.floor((matchNum - 1) / 8) + 1;
        } else if (compLevel === Match.comp_level.QF) {
            // Add 8 to the match number if it's a tiebreaker match (qf1m3 => qf9)
            matchNum += tiebreaker ? 8 : 0;
            // Integer divide by 4 to get the set number
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

    /**
     * @return {number} the number of the current set/series of matches (i.e. qf1, qf2, qf3, etc). QM => -1
     */
    get setNumber(): number {
        const splitTitle = this.splitTitle;
        const compLevel = CompLevels[splitTitle[0]];
        // Check if it's a tiebreaker match, super jank way of doing it
        const tiebreaker = splitTitle[1] === "Tiebreaker";

        // Grab the match number
        let matchNum = parseInt(splitTitle[tiebreaker ? 2 : 1]);

        // For different competition levels, calculate out the set/series number
        if (compLevel === Match.comp_level.EF) {
            matchNum += tiebreaker ? 16 : 0;
            return ((matchNum - 1) % 8) + 1;
        } else if (compLevel === Match.comp_level.QF) {
            // Add 8 to the match number if it's a tiebreaker match (qf1m3 => m9)
            matchNum += tiebreaker ? 8 : 0;
            // Modulo by 4 to get the set number (m9 -> qf1, m10 -> qf2)
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

    /**
     * @param {AllianceSide} side The side of the alliance to get the teams for
     * @return {Alliance} The alliance for the given side
     */
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

    protected get splitTitle(): string[] {
        const title = this.$("main .container-fluid .container h3")
            .first()
            .text()
            .trim();
        return title.split(" ");
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
