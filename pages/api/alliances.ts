import { NextApiRequest, NextApiResponse } from "next";
import { uploadAlliances } from "../../lib/WriteApi";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const response = await uploadAlliances(
            process.env.CURRENT_EVENT as string,
            req.body
        ).then((res) => res.json());
        res.json(response);
    } else {
        res.status(405).end();
    }
}
