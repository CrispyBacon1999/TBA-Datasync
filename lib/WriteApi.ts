import n_fetch from "node-fetch";
import { createHash } from "crypto";
import { Match } from "tba-api-v3client-ts";
import { getCurrentEvent, getTBAWriteCredentials } from "./fileio/data";

// const auth_id: string = process.env.TBA_WRITE_AUTH_ID || "";
// const auth_secret: string = process.env.TBA_WRITE_AUTH_SECRET || "";

/**
 * The Write API is used to create and modify data in the The Blue Alliance API.
 * @param endpoint The endpoint to send the request to
 * @param data The data to send
 * @returns The response from the server
 */
export const fetch = async (endpoint: string, data: any) => {
    const { clientId, secret } = getTBAWriteCredentials();

    const body = JSON.stringify(data);
    const md5Hash = createHash("md5")
        .update(`${secret}/api/trusted/v1${endpoint}${body}`)
        .digest("hex");

    const headers = {
        "X-TBA-Auth-Id": clientId,
        "X-TBA-Auth-Sig": md5Hash,
        "Content-Type": "application/json",
    };

    const response = await n_fetch(
        `https://www.thebluealliance.com/api/trusted/v1${endpoint}`,
        {
            method: "POST",
            headers,
            body,
        }
    );

    return response;
};

/**
 * Post updated team data to the TBA API.
 * @param eventKey The event key to post teams to
 * @param teamNumbers The team numbers to post
 * @returns The response from the server
 */
export const postTeams = async (teamKeys: string[]) => {
    const eventKey = getCurrentEvent();
    const endpoint = `/event/${eventKey}/team_list/update`;

    // const teamKeys = teamNumbers.map((team: number) => {
    //     return "frc" + team;
    // });

    const response = await fetch(endpoint, teamKeys);

    return response;
};

/**
 * Post updated match data to the TBA API.
 * @param eventKey The event key to post matches to
 * @param match The match to post
 * @returns The response from the server
 */
export const postMatch = async (match: WritableMatch<any>) => {
    console.log("Match:");
    console.log(match);
    const eventKey = getCurrentEvent();
    const endpoint = `/event/${eventKey}/matches/update`;
    const response = await fetch(endpoint, [match]);

    return response;
};

/**
 * Delete a match from the TBA api.
 * @param eventKey The event key to post delete match from
 * @param matchNumber The match number to delete
 * @returns The response from the server
 */
export const deleteMatch = async (matchNumber: string) => {
    const eventKey = getCurrentEvent();
    const endpoint = `/event/${eventKey}/matches/delete`;
    const response = await fetch(endpoint, [matchNumber]);

    return response;
};

export const eventData = async (bracketType: number) => {
    const eventKey = getCurrentEvent();
    const endpoint = `/event/${eventKey}/info/update`;
    const data = {
        playoff_type: bracketType,
    };
    const response = await fetch(endpoint, data);
    return response;
};

/**
 * Write ranks
 */
export const postRankings = async (ranks: any) => {
    const eventKey = getCurrentEvent();
    const endpoint = `/event/${eventKey}/rankings/update`;
    const response = await fetch(endpoint, ranks);
    return response;
};

export const uploadAlliances = async (alliances: string[][]) => {
    const eventKey = getCurrentEvent();
    const endpoint = `/event/${eventKey}/alliances/update`;
    const response = await fetch(endpoint, alliances);
    return response;
};

export interface WritableMatch<T> {
    key: string;
    comp_level: Match.comp_level;
    set_number: number;
    match_number: number;
    event_key: string;
    score_breakdown?: T;
    alliances: {
        red: {
            teams: string[];
            score: number;
        };
        blue: {
            teams: string[];
            score: number;
        };
    };
}
