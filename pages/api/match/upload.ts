import { NextApiRequest, NextApiResponse } from "next";
import { postMatch, postTeams } from "../../../lib/WriteApi";
import { getMatch, getMatchList } from "../../../lib/FMSApi";
import { isMatchUploaded, writeUploadedMatch } from "../../../lib/fileio/data";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const levelParam = parseInt(req.query.levelParam as string);
    console.log(levelParam);
    if (req.method === "POST") {
        // pull matches from FMS, figure out which ones have already been uploaded, then send those to the write API
        const allMatches = await getMatchList(levelParam);
        let uploadCount = 0;
        const uploads = [];
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
                        uploads.push(matchData);
                    }
                }
            }
        }
        res.status(200).send({ uploadCount, uploads });
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
};
