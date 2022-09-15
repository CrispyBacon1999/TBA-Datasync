import { NextApiRequest, NextApiResponse } from "next";
import { Elimination_Alliance, Match } from "tba-api-v3client-ts";
import { getCurrentEvent } from "../../../lib/fileio/data";
import {
    generateElimSchedule,
    generateElimScheduleOrder,
} from "../../../lib/FMSApi";
import { EventService } from "../../../lib/TBAApi";
import { postMatch, WritableMatch } from "../../../lib/WriteApi";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    console.log(req);
    if (req.method === "GET") {
        const alliances =
            req.body.alliances ??
            (await EventService.getEventAlliances(getCurrentEvent()));
        console.log(alliances);
        const matchOrder = generateElimScheduleOrder(alliances.length);

        console.log(matchOrder);

        const matches: WritableMatch<any>[] = generateElimSchedule(
            alliances.map((x: Elimination_Alliance) => x.picks),
            matchOrder
        );
        for (const match of matches) {
            await postMatch(match);
            console.log(`Posted match: ${match.key}`);
        }
        res.status(200).json(matches);
    }
}
