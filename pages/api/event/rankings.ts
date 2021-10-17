import { NextApiRequest, NextApiResponse } from "next";
import { getRankingData } from "../../../lib/FMSApi";
import { postRankings } from "../../../lib/WriteApi";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    const ranks = await getRankingData();
    // console.log(ranks);
    const result = await postRankings(
        process.env.CURRENT_EVENT as string,
        ranks
    );
    // console.log(result);

    res.status(200).json(result);
}
