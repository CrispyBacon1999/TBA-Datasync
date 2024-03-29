import { NextApiRequest, NextApiResponse } from "next";
import { getSampleMatch } from "../../../../lib/FMSApi";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    console.log(process.env.CURRENT_EVENT);
    if (req.method === "GET") {
        const match = await getSampleMatch(req.query.matchId as string);
        res.json(match);
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
};
