import { NextApiRequest, NextApiResponse } from "next";
import { Match } from "tba-api-v3client-ts";
import { getCurrentEvent } from "../../../lib/fileio/data";

export default function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const matchOrder = req.body.matchOrder;
        const alliances = req.body.alliances;
        let matchLevel = Match.comp_level.QF;
        if (matchOrder.length > 4) {
            matchLevel = Match.comp_level.EF;
        } else if (matchOrder.length > 2 && matchOrder.length < 4) {
            matchLevel = Match.comp_level.SF;
        } else if (matchOrder.length) {
            matchLevel = Match.comp_level.F;
        }

        const event = getCurrentEvent();

        let i = 1;
        const matches = [];
        for (let matchAlliances of matchOrder) {
            for (let set = 1; set <= 3; set++) {
                const match: Match = {
                    event_key: event,
                    set_number: set,
                    match_number: i,
                    comp_level: matchLevel,
                    key: event + "_" + matchLevel + i + "m" + set,
                    alliances: {
                        blue: {
                            score: -1,
                            team_keys: [
                                ...alliances[matchAlliances[1] - 1].slice(0, 3),
                            ],
                        },
                        red: {
                            score: -1,
                            team_keys: [
                                ...alliances[matchAlliances[0] - 1].slice(0, 3),
                            ],
                        },
                    },
                };
                matches.push(match);
            }
            i++;
        }

        res.status(200).json(matches);
    }
}
