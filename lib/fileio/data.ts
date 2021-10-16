import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig";

export type UploadedMatch = {
    fmsMatchKey: string;
    tbaMatchKey: string;
};

var db = new JsonDB(
    new Config(`data/${process.env.CURRENT_EVENT}/uploads`, true, false, "/")
);

export function writeUploadedMatch(fmsKey: string, tbaKey: string) {
    db.push(`/uploads/${fmsKey}`, { fmsMatchKey: fmsKey, tbaMatchKey: tbaKey });
}

export function isMatchUploaded(fmsKey: string) {
    const match = db.getData(`/uploads/${fmsKey}`);
    return match !== null && match.tbaMatchKey != "";
}

export function deleteMatch(fmsKey: string) {
    db.delete(`/uploads/${fmsKey}`);
}
