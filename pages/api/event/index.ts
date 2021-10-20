import { NextApiRequest, NextApiResponse } from "next";
import { EventService } from "../../../lib/TBAApi";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
        const events = await EventService.getEventsByYearSimple(
            new Date().getFullYear()
        );
        res.status(200).json(events);
    } else {
        res.status(405).end();
    }
};
