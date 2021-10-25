import { NextApiRequest, NextApiResponse } from "next";
import { postMatch, postTeams } from "../../../lib/WriteApi";
import { OpenAPI, EventService } from "tba-api-v3client-ts";
import { getMatch, getMatchList } from "../../../lib/FMSApi";
import { isMatchUploaded, writeUploadedMatch } from "../../../lib/fileio/data";

const currentEvent = process.env.CURRENT_EVENT as string;

export default async (req: NextApiRequest, res: NextApiResponse) => {
    console.log(process.env.CURRENT_EVENT);
    const levelParam = parseInt(req.query.levelParam as string);
    if (req.method === "POST") {
        // pull matches from FMS, figure out which ones have already been uploaded, then send those to the write API
        const allMatches = await getMatchList(levelParam);
        let uploadCount = 0;
        console.log(`Loaded ${allMatches.length} matches`);
        for (const match of allMatches) {
            if (!isMatchUploaded(match.matchId)) {
                const matchData = await getMatch<any>(match.matchId);
                if (matchData.score_breakdown?.blue?.totalPoints !== null) {
                    // console.log(`Uploading match ${match.matchId}`);
                    const response = await postMatch(matchData);
                    console.log(response);
                    if (response.status === 200) {
                        writeUploadedMatch(match.matchId, matchData.key);
                        uploadCount++;
                    }
                }
            }
        }
        res.status(200).send({ uploadCount });
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
};
