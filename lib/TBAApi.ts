import { OpenAPI } from "tba-api-v3client-ts";

OpenAPI.HEADERS = {
    "X-TBA-Auth-Key": process.env.TBA_KEY
        ? process.env.TBA_KEY // Default use environment variable if it exists
        : "9kw4ECi9M4IxqZOKhwLZ28sY9ZlgvM2l9lcGk6oqB9mFSuBrrCRHOu44k6NG8Dgr", // Otherwise go with the default key
};

export { EventService, TeamService, MatchService } from "tba-api-v3client-ts";
