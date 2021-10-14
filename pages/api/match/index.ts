import { NextApiRequest, NextApiResponse } from "next";
import { getMatchList } from "../../../lib/FMSApi";
import { MatchLevel } from "../../../lib/consts";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    console.log(process.env.CURRENT_EVENT);
    if (req.method === "GET") {
        const matchList = await getMatchList(
            req.query.level
                ? parseInt(req.query.level as string)
                : MatchLevel.Qualification
        );
        res.json(matchList);
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
};
