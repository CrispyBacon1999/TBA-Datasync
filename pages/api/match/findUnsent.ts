import { NextApiRequest, NextApiResponse } from "next";
import { postTeams } from "../../../lib/WriteApi";
import { OpenAPI, EventService } from "tba-api-v3client-ts";

OpenAPI.HEADERS = {
    "X-TBA-Auth-Key": process.env.TBA_KEY || "",
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
    console.log(process.env.CURRENT_EVENT);
    if (req.method === "GET") {
        // pull events from FMS, figure out which ones have already been uploaded, then send those to the write API
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
};
