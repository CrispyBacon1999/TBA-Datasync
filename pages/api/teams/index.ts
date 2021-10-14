import { NextApiRequest, NextApiResponse } from "next";
import { postTeams } from "../../../lib/WriteApi";
import { OpenAPI, EventService } from "tba-api-v3client-ts";

OpenAPI.HEADERS = {
    "X-TBA-Auth-Key": process.env.TBA_KEY || "",
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
    console.log(process.env.CURRENT_EVENT);
    if (req.method === "GET") {
        const teams = await EventService.getEventTeamsKeys(
            process.env.CURRENT_EVENT || ""
        );
        res.status(200).json(teams);
    } else if (req.method === "POST") {
        const teams = JSON.parse(req.body);

        try {
            const data = await postTeams(
                process.env.CURRENT_EVENT || "",
                teams
            );
            res.status(200).send("Success");
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
};
