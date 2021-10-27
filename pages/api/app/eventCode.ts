import { NextApiRequest, NextApiResponse } from "next";
import { setEventName } from "../../../electron/lib/touchbar";
import { getCurrentEvent, setCurrentEvent } from "../../../lib/fileio/data";

export default function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        res.status(200).json({
            code: getCurrentEvent(),
        });
    } else if (req.method === "POST") {
        console.log(req.body);
        setCurrentEvent(req.body.code);
        setEventName();
        res.status(200).end();
    } else {
        res.status(405).end();
    }
}
