import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig";

export type UploadedMatch = {
    fmsMatchKey: string;
    tbaMatchKey: string;
};

var appDb = new JsonDB(new Config("data/app", true, true, "/"));

var db = new JsonDB(
    new Config(`data/${getCurrentEvent()}/uploads`, true, true, "/")
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

export function setTBAWriteKey(clientId: string, secret: string) {
    appDb.push("/tbaWriteCredentials", { clientId, secret });
}

export function getTBAWriteCredentials(): { clientId: string; secret: string } {
    return appDb.getData("/tbaWriteCredentials");
}

export function setCurrentEvent(eventKey: string) {
    appDb.push("/currentEvent", eventKey);
}

export function getCurrentEvent(): string {
    return appDb.getData("/currentEvent");
}
