import { NextApiRequest, NextApiResponse } from "next";
import { TeamService } from "tba-api-v3client-ts";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        res.status(200).json(
            await TeamService.getTeam(req.query.team as string)
        );
    } else {
        res.status(405).end();
    }
}
