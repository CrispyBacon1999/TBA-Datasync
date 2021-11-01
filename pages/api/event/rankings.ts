import { NextApiRequest, NextApiResponse } from "next";
import { getRankingData } from "../../../lib/FMSApi";
import { postRankings } from "../../../lib/WriteApi";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    const ranks = await getRankingData();
    if (ranks !== null) {
        const result = await postRankings(ranks);
        console.log(result);

        res.status(200).json(result);
    } else {
        res.status(200).json({ message: "No ranks found" });
    }
}
