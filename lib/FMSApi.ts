import util from "util";
import fetch from "node-fetch";
import AbortController from "abort-controller";
import { InfiniteRecharge, MatchListParser } from "./parsers";
import Parser from "./parsers/Parser";

console.log(process.env.CURRENT_EVENT?.substr(0, 4) || "");
const current_year = parseInt(process.env.CURRENT_EVENT?.substr(0, 4) || "");

const FMS_URL = process.env.FMS_URL || "http://10.0.100.5";
const URLS = {
    matches: `${FMS_URL}/FieldMonitor/MatchesPartialByLevel?levelParam=%d`,
    match: `${FMS_URL}/FieldMonitor/Matches/Score?matchId=%s`,
    rankings: `${FMS_URL}/Put/GetData`,
    ping: `${FMS_URL}`,
};

// Wack syntax to be able to pass in a parser class without instantiating it
type Newable<T> = { new (...args: any[]): T };
// Map of parsers for all years that have one
const parsers: { [key: number]: Newable<Parser<any>> } = {
    2020: InfiniteRecharge,
    2021: InfiniteRecharge,
};

// Pull match list, and return match codes, along with match numbers
export const getMatchList = async (levelParam: number) => {
    const matchListPage = await fetch(
        util.format(URLS.matches, levelParam)
    ).then((res) => res.text());
    const parser = new MatchListParser(matchListPage);
    const matches = parser.getMatches(levelParam);
    return matches;
};

// Get match data from FMS, and return parsed data
export const getMatch = async (matchCode: string) => {
    const response = await fetch(util.format(URLS.match, matchCode));
    const data = await response.text();
    console.log(current_year);
    const p = parsers[current_year];
    console.log(p);
    const parser = new p(data);
    return parser.match;
};

// Check if FMS is up and able to be pinged
export const checkFMSConnection = async () => {
    try {
        const controller = new AbortController();
        const signal = controller.signal;
        setTimeout(() => {
            controller.abort();
        }, 5000);
        await fetch(URLS.ping, { signal });
        return true;
    } catch (e) {
        return false;
    }
};
