import Parser, { AllianceSide } from "./Parser";
import * as cheerio from "cheerio";

export default abstract class NewParser<T> extends Parser<T> {
    protected getStringByRowNumber(
        rowNumber: number,
        side: AllianceSide
    ): string {
        const element = this.$(
            `tr:nth-child(${rowNumber}) td.${
                side === AllianceSide.Blue ? "info" : "danger"
            }`
        );

        return element.text();
    }

    protected getNumberByRowNumber(
        rowNumber: number,
        side: AllianceSide
    ): number {
        const element = this.$(
            `tr:nth-child(${rowNumber}) td.${
                side === AllianceSide.Blue ? "info" : "danger"
            }`
        );

        return parseInt(element.text());
    }

    protected getIconByRowNumberAndStation(
        rowNumber: number,
        station: number,
        side: AllianceSide
    ): string {
        const icon = this.$(
            `tr:nth-child(${rowNumber}) .${
                side === AllianceSide.Blue ? "info" : "danger"
            }>.row>.col-sm-4:nth-child(${station}) i`
        );
        const classList = icon.attr("class") || "";
        return classList.replace(/fas\s*/, "");
    }

    protected getElementBySelector(
        selector: cheerio.BasicAcceptedElems<cheerio.Node>
    ) {
        const element = this.$(selector);

        return element;
    }
}
