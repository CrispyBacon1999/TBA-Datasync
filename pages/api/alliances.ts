import { NextApiRequest, NextApiResponse } from "next";
import { uploadAlliances } from "../../lib/WriteApi";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        console.log(req.body);
        const response = await uploadAlliances(req.body).then((res) => {
            console.log(res);
            return res.json();
        });
        console.log(response);
        res.json(req.body);
    } else {
        res.status(405).end();
    }
}
