import { Match } from "tba-api-v3client-ts";

export default abstract class Parser<T> {
    protected pageData: string;
    constructor(data: string) {
        this.pageData = data;
    }

    abstract get breakdown(): T;

    abstract get tba_rep(): Match;
}
