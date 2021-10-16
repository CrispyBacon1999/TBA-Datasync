import { NextApiRequest, NextApiResponse } from "next";
import { checkFMSConnection } from "../../lib/FMSApi";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (await checkFMSConnection()) {
        res.status(200).json({ fmsConnected: true });
    } else {
        res.status(200).json({ fmsConnected: false });
    }
};
