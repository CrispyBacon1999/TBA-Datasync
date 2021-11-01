import { NextApiRequest, NextApiResponse } from "next";
import { getMatch, getMatchList } from "../../../lib/FMSApi";
import { MatchLevel } from "../../../lib/consts";
import { deleteMatch } from "../../../lib/WriteApi";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    console.log(process.env.CURRENT_EVENT);
    if (req.method === "GET") {
        const match = await getMatch(req.query.matchId as string);
        res.json(match);
    } else if (req.method === "DELETE") {
        const result = await deleteMatch(req.query.matchId as string);
        console.log(result);
        res.json({ ":)": ":)" });
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
};
