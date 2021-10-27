import type { NextApiRequest, NextApiResponse } from "next";
import { eventData } from "../../../lib/WriteApi";

const currentEvent = process.env.CURRENT_EVENT as string;

export default async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        eventData(2);
        res.status(200).json({
            message: "OK",
        });
    } else {
        res.status(405).send("Method not allowed");
    }
}
