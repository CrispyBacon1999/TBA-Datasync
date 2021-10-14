import {
    Match,
    Match_Score_Breakdown_2020,
    Match_Score_Breakdown_2020_Alliance,
} from "tba-api-v3client-ts";
import Parser from "./Parser";

export default class InfiniteRechargeParser extends Parser<Match_Score_Breakdown_2020> {
    get breakdown(): Match_Score_Breakdown_2020 {
        return {} as Match_Score_Breakdown_2020;
    }

    get tba_rep(): Match {
        return {} as Match;
    }
}
