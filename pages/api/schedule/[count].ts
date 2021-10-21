import { NextApiRequest, NextApiResponse } from "next";
import { generateElimScheduleOrder } from "../../../lib/FMSApi";

export default function (req: NextApiRequest, res: NextApiResponse) {
    const allianceCount = parseInt(req.query.count as string);
    const matchOrder = generateElimScheduleOrder(allianceCount);
    res.status(200).json(matchOrder);
}
