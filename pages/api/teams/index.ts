import { NextApiRequest, NextApiResponse } from "next";
import { postTeams } from "../../../lib/WriteApi";
import { OpenAPI, EventService } from "tba-api-v3client-ts";
import { getCurrentEvent } from "../../../lib/fileio/data";

OpenAPI.HEADERS = {
    "X-TBA-Auth-Key": process.env.TBA_KEY || "",
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
        const teams = await EventService.getEventTeamsKeys(getCurrentEvent());
        res.status(200).json(teams);
    } else if (req.method === "POST") {
        // const teams = JSON.parse(req.body);
        const teams = req.body;
        try {
            const data = await postTeams(teams);
            res.status(200).send("Success");
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
};
