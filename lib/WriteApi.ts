import n_fetch from "node-fetch";
import { createHash } from "crypto";
import { Match } from "tba-api-v3client-ts";

const auth_id: string = process.env.TBA_WRITE_AUTH_ID || "";
const auth_secret: string = process.env.TBA_WRITE_AUTH_SECRET || "";

/**
 * The Write API is used to create and modify data in the The Blue Alliance API.
 * @param endpoint The endpoint to send the request to
 * @param data The data to send
 * @returns The response from the server
 */
export const fetch = async (endpoint: string, data: any) => {
    const body = JSON.stringify(data);
    const md5Hash = createHash("md5")
        .update(`${auth_secret}/api/trusted/v1${endpoint}${body}`)
        .digest("hex");

    const headers = {
        "X-TBA-Auth-Id": auth_id,
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
export const postTeams = async (eventKey: string, teamNumbers: number[]) => {
    const endpoint = `/event/${eventKey}/team_list/update`;

    const teamKeys = teamNumbers.map((team: number) => {
        return "frc" + team;
    });

    const response = await fetch(endpoint, teamKeys);

    return response;
};

/**
 * Post updated match data to the TBA API.
 * @param eventKey The event key to post matches to
 * @param match The match to post
 * @returns The response from the server
 */
export const postMatch = async (eventKey: string, match: Match) => {
    console.log("Match:");
    console.log(match);
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
export const deleteMatch = async (eventKey: string, matchNumber: string) => {
    const endpoint = `/event/${eventKey}/matches/delete`;
    const response = await fetch(endpoint, [matchNumber]);

    return response;
};

export const eventData = async (eventKey: string, bracketType: number) => {
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
export const postRankings = async (eventKey: string, ranks: any) => {
    const endpoint = `/event/${eventKey}/rankings/update`;
    const response = await fetch(endpoint, ranks);
    return response;
};

export const uploadAlliances = async (
    eventKey: string,
    alliances: string[][]
) => {
    const endpoint = `/event/${eventKey}/alliances/update`;
    const response = await fetch(endpoint, alliances);
    return response;
};
