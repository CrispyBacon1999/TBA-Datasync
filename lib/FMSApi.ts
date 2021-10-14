import util from "util";
import fetch from "node-fetch";
import { InfiniteRecharge } from "./parsers";
import Parser from "./parsers/Parser";

const current_year = parseInt(process.env.CURRENT_EVENT?.substr(0, 4) || "");

const FMS_URL = process.env.FMS_URL || "https://10.0.100.5";
const URLS = {
    matches: `${FMS_URL}/FieldMonitor/MatchesPartialByLevel?levelParam=%d`,
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
export const getMatchList = async () => {};

// Get match data from FMS, and return parsed data
export const getMatch = async (matchCode: string) => {
    const response = await fetch(`${URLS.matches}&matchCode=${matchCode}`);
    const data = await response.json();
    const parser = parsers[current_year];
    return new parser(data);
};

// Check if FMS is up and able to be pinged
export const checkFMSConnection = async () => {
    try {
        await fetch(URLS.ping);
        return true;
    } catch (e) {
        return false;
    }
};
