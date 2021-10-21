import { NextApiRequest, NextApiResponse } from "next";
import { Match } from "tba-api-v3client-ts";
import { getCurrentEvent } from "../../../lib/fileio/data";
import {
    generateElimSchedule,
    generateElimScheduleOrder,
} from "../../../lib/FMSApi";
import { EventService } from "../../../lib/TBAApi";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const alliances =
            req.body.alliances ??
            (await EventService.getEventAlliances(getCurrentEvent()));
        const matchOrder = generateElimScheduleOrder(alliances.length);

        console.log(matchOrder);

        const matches: Match[] = generateElimSchedule(alliances, matchOrder);

        res.status(200).json(matches);
    }
}
