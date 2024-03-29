import RapidReactParser from "../../lib/parsers/RapidReact";
import fs from "fs";

describe("RapidReact", () => {
    it("should parse FMS_Practice1.html correctly", () => {
        const data = fs.readFileSync("public/sample/FMS_Practice1.html");
        const parser = new RapidReactParser(data.toString());
        const match = parser.match;
        expect(match).toMatchInlineSnapshot(`
Object {
  "alliances": Object {
    "blue": Object {
      "score": 331,
      "teams": Array [
        "frc1",
        "frc2",
        "frc3",
      ],
    },
    "red": Object {
      "score": 374,
      "teams": Array [
        "frc4",
        "frc5",
        "frc6",
      ],
    },
  },
  "comp_level": undefined,
  "event_key": "2022mimus",
  "key": "2022mimus_undefined1",
  "match_number": 1,
  "score_breakdown": Object {
    "blue": Object {
      "autoCargoLowerBlue": 2,
      "autoCargoLowerFar": 1,
      "autoCargoLowerNear": 4,
      "autoCargoLowerRed": 3,
      "autoCargoPoints": 188,
      "autoCargoTotal": 52,
      "autoCargoUpperBlue": 10,
      "autoCargoUpperFar": 9,
      "autoCargoUpperNear": 12,
      "autoCargoUpperRed": 11,
      "autoPoints": 192,
      "autoTaxiPoints": 4,
      "cargoBonusRankingPoint": false,
      "endgamePoints": 45,
      "endgameRobot1": "Traversal",
      "endgameRobot2": "Traversal",
      "endgameRobot3": "Traversal",
      "foulCount": 8,
      "foulPoints": 64,
      "hangarBonusRankingPoint": false,
      "matchCargoTotal": 72,
      "quintetAchieved": true,
      "rp": NaN,
      "taxiRobot1": "No",
      "taxiRobot2": "No",
      "taxiRobot3": "Yes",
      "techFoulCount": 3,
      "teleopCargoLowerBlue": 2,
      "teleopCargoLowerFar": 1,
      "teleopCargoLowerNear": 4,
      "teleopCargoLowerRed": 3,
      "teleopCargoPoints": 30,
      "teleopCargoTotal": 20,
      "teleopCargoUpperBlue": 2,
      "teleopCargoUpperFar": 1,
      "teleopCargoUpperNear": 4,
      "teleopCargoUpperRed": 3,
      "teleopPoints": 75,
      "totalPoints": 331,
    },
    "red": Object {
      "autoCargoLowerBlue": 6,
      "autoCargoLowerFar": 5,
      "autoCargoLowerNear": 8,
      "autoCargoLowerRed": 7,
      "autoCargoPoints": 284,
      "autoCargoTotal": 84,
      "autoCargoUpperBlue": 14,
      "autoCargoUpperFar": 13,
      "autoCargoUpperNear": 16,
      "autoCargoUpperRed": 15,
      "autoPoints": 288,
      "autoTaxiPoints": 4,
      "cargoBonusRankingPoint": false,
      "endgamePoints": 0,
      "endgameRobot1": "None",
      "endgameRobot2": "None",
      "endgameRobot3": "None",
      "foulCount": 0,
      "foulPoints": 56,
      "hangarBonusRankingPoint": false,
      "matchCargoTotal": 104,
      "quintetAchieved": false,
      "rp": NaN,
      "taxiRobot1": "No",
      "taxiRobot2": "Yes",
      "taxiRobot3": "No",
      "techFoulCount": 8,
      "teleopCargoLowerBlue": 2,
      "teleopCargoLowerFar": 1,
      "teleopCargoLowerNear": 4,
      "teleopCargoLowerRed": 3,
      "teleopCargoPoints": 30,
      "teleopCargoTotal": 20,
      "teleopCargoUpperBlue": 2,
      "teleopCargoUpperFar": 1,
      "teleopCargoUpperNear": 4,
      "teleopCargoUpperRed": 3,
      "teleopPoints": 30,
      "totalPoints": 374,
    },
  },
  "set_number": 1,
}
`);
    });
});
