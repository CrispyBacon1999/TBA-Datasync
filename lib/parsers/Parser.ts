import * as cheerio from "cheerio";
import type { Cheerio, Element, CheerioAPI } from "cheerio";
import { Match } from "tba-api-v3client-ts";

export enum AllianceSide {
    Red,
    Blue,
}

export default abstract class Parser<T> {
    protected pageData: string;
    protected $: CheerioAPI;
    constructor(data: string) {
        this.pageData = data;
        this.$ = cheerio.load(data);
    }

    abstract get breakdown(): T;
    abstract get match(): Match;

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
