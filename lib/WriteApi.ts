import n_fetch from "node-fetch";
import { createHash } from "crypto";
import { Match } from "tba-api-v3client-ts";

const auth_id: string = process.env.TBA_WRITE_AUTH_ID || "";
const auth_secret: string = process.env.TBA_WRITE_AUTH_SECRET || "";

export const fetch = async (endpoint: string, data: any) => {
    const body = JSON.stringify(data);
    console.log(
        "Pre hash: ",
        `${auth_secret}/api/trusted/v1${endpoint}${body}`
    );
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

export const postTeams = async (eventKey: string, teamNumbers: number[]) => {
    const endpoint = `/event/${eventKey}/team_list/update`;

    const teamKeys = teamNumbers.map((team: number) => {
        return "frc" + team;
    });

    const response = await fetch(endpoint, teamKeys);

    return response;
};

export const postMatch = async (eventKey: string, match: Match) => {
    const endpoint = `/event/${eventKey}/matches/update`;
    const response = await fetch(endpoint, [match]);

    return response;
};

export const deleteMatch = async (eventKey: string, matchNumber: number) => {
    const endpoint = `/event/${eventKey}/matches/delete`;
    const response = await fetch(endpoint, [matchNumber]);

    return response;
};
