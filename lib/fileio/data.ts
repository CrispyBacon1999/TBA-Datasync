import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig";

export type UploadedMatch = {
    fmsMatchKey: string;
    tbaMatchKey: string;
};

var db = new JsonDB(
    new Config(`data/${process.env.CURRENT_EVENT}/uploads`, true, true, "/")
);

export function writeUploadedMatch(fmsKey: string, tbaKey: string) {
    db.push(`/uploads/${fmsKey}`, { fmsMatchKey: fmsKey, tbaMatchKey: tbaKey });
}

export function isMatchUploaded(fmsKey: string) {
    try {
        const match = db.getData(`/uploads/${fmsKey}`);
        // console.log(match);
        return match !== null && match.tbaMatchKey != "";
    } catch (err) {
        return false;
    }
}

export function deleteMatch(fmsKey: string) {
    db.delete(`/uploads/${fmsKey}`);
}
