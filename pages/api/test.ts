import { NextApiRequest, NextApiResponse } from "next";
import { MatchService } from "tba-api-v3client-ts";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    const match = await MatchService.getMatch("2021mirc_f1m3");
    res.json(match);
}
