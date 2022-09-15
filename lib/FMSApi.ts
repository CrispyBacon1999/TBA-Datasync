import util from "util";
import fetch from "node-fetch";
import AbortController from "abort-controller";
import { InfiniteRecharge, MatchListParser, RapidReact } from "./parsers";
import Parser from "./parsers/Parser";
import { Match } from "tba-api-v3client-ts";
import { getCurrentEvent } from "./fileio/data";
import { WritableMatch } from "./WriteApi";

console.log(process.env.CURRENT_EVENT?.substr(0, 4) || "");
const current_year = parseInt(process.env.CURRENT_EVENT?.substr(0, 4) || "");

const FMS_URL = process.env.FMS_URL || "http://10.0.100.5";
const URLS = {
    matches: `${FMS_URL}/FieldMonitor/MatchesPartialByLevel?levelParam=%d`,
    match: `${FMS_URL}/FieldMonitor/Matches/Score?matchId=%s`,
    rankings: `${FMS_URL}/Pit/GetData`,
    pit: `${FMS_URL}/Pit/Qual`,
    ping: `${FMS_URL}`,
};

// Wack syntax to be able to pass in a parser class without instantiating it
type Newable<T> = { new (...args: any[]): T };
// Map of parsers for all years that have one
const parsers: { [key: number]: Newable<Parser<any>> } = {
    2020: InfiniteRecharge,
    2021: InfiniteRecharge,
    2022: RapidReact,
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
export const getMatch = async <T>(
    matchCode: string
): Promise<WritableMatch<T>> => {
    const response = await fetch(util.format(URLS.match, matchCode));
    const data = await response.text();
    // console.log(`Current Year: ${current_year}`);
    const p = parsers[current_year];
    // console.log(p);
    const parser = new p(data);
    return parser.match;
};

export const getSampleMatch = async <T>(
    sampleMatchName: string
): Promise<WritableMatch<T>> => {
    const response = await fetch(
        `http://localhost:3000/sample/${sampleMatchName}`
    );
    const data = await response.text();
    // console.log(`Current Year: ${current_year}`);
    const p = parsers[current_year];
    // console.log(p);
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

export const getRankingData = async () => {
    const rankings = (await fetch(URLS.rankings, {
        headers: {
            Referer: URLS.pit,
        },
    }).then((res) => res.json())) as any;
    console.log("FMS Rankings:");
    console.log(rankings);

    if (rankings.qualRanks) {
        const tbaRanks = rankings.qualRanks.map((rank: any) => ({
            team_key: "frc" + rank.team,
            rank: rank.rank,
            wins: rank.wins,
            losses: rank.losses,
            ties: rank.ties,
            played: rank.played,
            dqs: rank.dq,
            "Ranking Score": rank.sort1,
            "Avg Match": rank.sort2,
            "Avg Hangar": rank.sort3,
            "Avg Taxi + Auto Cargo": rank.sort4,
        }));

        console.log("TBA Rankings:");
        console.log(tbaRanks);

        return {
            breakdowns: [
                "wins",
                "losses",
                "ties",
                "Ranking Score",
                "Avg Match",
                "Avg Hangar",
                "Avg Taxi + Auto Cargo",
            ],
            rankings: tbaRanks,
        };
    }
    return null;
};

export const generateElimScheduleOrder = (
    allianceCount: number
): number[][] => {
    if (allianceCount === 5) {
        console.log("Generating alliances");
        return generateElimScheduleOrderRoundRobin(5);
    }
    const matchList: number[][] = [];
    for (let i = 0; i < allianceCount / 2; i++) {
        matchList.push([i + 1, allianceCount - i]);
    }

    const matchOrder: number[][] = [];
    const loopCount = matchList.length / 2;
    for (let i = 0; i < loopCount; i++) {
        const first = matchList.splice(0, 1)[0];
        matchOrder.push(first);
        const last = matchList.pop();
        if (last !== undefined) {
            matchOrder.push(last);
        }
    }
    return matchOrder;
};

export const generateElimScheduleOrderRoundRobin = (allianceCount: number) => {
    // Todo: Actually do this automatically
    const matchList: number[][] = [
        [1, 4],
        [2, 3],
        [1, 4],
        [2, 3],
        [4, 5],
        [1, 2],
        [3, 5],
        [1, 2],
        [3, 5],
        [4, 5],
        [1, 3],
        [2, 5],
        [1, 3],
        [2, 5],
        [3, 4],
        [1, 5],
        [2, 4],
        [1, 5],
        [2, 4],
        [3, 4],
    ];
    return matchList;
};

export const generateElimSchedule = (
    alliances: string[][],
    matchOrder: number[][]
): WritableMatch<any>[] => {
    let matchLevel = Match.comp_level.QF;
    if (matchOrder.length > 4) {
        matchLevel = Match.comp_level.EF;
    } else if (matchOrder.length > 2 && matchOrder.length < 4) {
        matchLevel = Match.comp_level.SF;
    } else if (matchOrder.length === 1) {
        matchLevel = Match.comp_level.F;
    }

    const event = getCurrentEvent();

    let i = 1;
    const matches = [];
    for (let matchAlliances of matchOrder) {
        console.log(matchAlliances);
        for (let set = 1; set <= 3; set++) {
            const match: WritableMatch<any> = {
                event_key: event,
                set_number: i,
                match_number: set,
                comp_level: matchLevel,
                key: event + "_" + matchLevel + i + "m" + set,
                alliances: {
                    blue: {
                        score: -1,
                        teams: [
                            ...alliances[matchAlliances[1] - 1].slice(0, 3),
                        ],
                    },
                    red: {
                        score: -1,
                        teams: [
                            ...alliances[matchAlliances[0] - 1].slice(0, 3),
                        ],
                    },
                },
            };
            matches.push(match);
        }
        i++;
    }
    return matches;
};
