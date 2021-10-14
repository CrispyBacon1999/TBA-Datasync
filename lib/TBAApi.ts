import { OpenAPI } from "tba-api-v3client-ts";

OpenAPI.HEADERS = {
    "X-TBA-Auth-Key": process.env.TBA_KEY || "",
};

export { EventService, TeamService, MatchService } from "tba-api-v3client-ts";
