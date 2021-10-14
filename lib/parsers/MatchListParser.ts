import * as cheerio from "cheerio";
import type { Cheerio, Element, CheerioAPI } from "cheerio";
import qs from "qs";

type MatchURL = {
    number: number;
    matchId: string;
    level: number;
};

export default class MatchListParser {
    private data: string;
    private $: CheerioAPI;
    constructor(data: string) {
        this.data = data;
        this.$ = cheerio.load(data);
    }

    private getMatchRow(tr: Element, levelParam: number): MatchURL | undefined {
        const cells = this.$(tr).children("td");
        if (cells.length === 10) {
            const link = this.$(cells[2]).children("a").attr("href") as string;
            const query = link.split("?")[1];
            const { matchId } = qs.parse(query);

            const matchPlay = this.$(cells[3])
                .children("button")
                .first()
                .text();
            console.log(matchPlay);
            const matchPlaySplit = matchPlay.split("/");
            const number = parseInt(matchPlaySplit[0]);

            return {
                number,
                matchId: matchId as string,
                level: levelParam,
            };
        }
    }

    private getMatchRows(
        table: Cheerio<Element>,
        levelParam: number
    ): MatchURL[] {
        const rows = table.children("tr");
        const matches: MatchURL[] = [];
        rows.each((index, row) => {
            const match = this.getMatchRow(row, levelParam);
            if (match) {
                matches.push(match);
            }
        });

        return matches;
    }

    public getMatches(levelParam: number): MatchURL[] {
        const rows = this.getMatchRows(this.$(".matchTable tbody"), levelParam);
        return rows;
    }
}
