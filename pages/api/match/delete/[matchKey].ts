import { NextApiRequest, NextApiResponse } from "next";
import { getMatchList } from "../../../../lib/FMSApi";
import { deleteMatch } from "../../../../lib/WriteApi";
import { MatchLevel } from "../../../../lib/consts";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    console.log(process.env.CURRENT_EVENT);
    if (req.method === "GET") {
        deleteMatch(req.query.matchId as string);
        res.json({});
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
};
