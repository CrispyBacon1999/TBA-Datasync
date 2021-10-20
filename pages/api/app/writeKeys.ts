import { NextApiRequest, NextApiResponse } from "next";
import {
    getCurrentEvent,
    getTBAWriteCredentials,
    setCurrentEvent,
    setTBAWriteKey,
} from "../../../lib/fileio/data";

export default function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        res.status(200).json({
            code: getTBAWriteCredentials(),
        });
    } else if (req.method === "POST") {
        console.log(req.body);
        setTBAWriteKey(req.body.clientId, req.body.secret);
        res.status(200).end();
    } else {
        res.status(405).end();
    }
}
