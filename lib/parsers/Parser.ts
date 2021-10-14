import * as cheerio from "cheerio";
import type { Cheerio, Element, CheerioAPI } from "cheerio";
import { Match } from "tba-api-v3client-ts";

export default abstract class Parser<T> {
    protected pageData: string;
    protected $: CheerioAPI;
    constructor(data: string) {
        this.pageData = data;
        this.$ = cheerio.load(data);
    }

    abstract get breakdown(): T;
    abstract get match(): Match;
}
